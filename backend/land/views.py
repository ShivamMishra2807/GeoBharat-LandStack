import json
import uuid
from datetime import date

from django.contrib.auth import authenticate, get_user_model
from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import AuditEvent, CitizenRequest, OfficialQueueItem, Parcel, ParcelRecord, UserProfile, UtilityDataset

User = get_user_model()


def user_payload(user):
    profile = getattr(getattr(user, 'profile', None), 'data', {}) or {}
    return {
        'id': profile.get('id', user.username),
        'name': user.get_full_name() or profile.get('name', user.username),
        'email': user.email,
        'role': profile.get('role', 'citizen'),
        **{key: value for key, value in profile.items() if key not in {'id', 'name', 'role'}},
    }


def auth_response(user):
    profile = getattr(getattr(user, 'profile', None), 'data', {}) or {}
    role = profile.get('role', 'citizen')
    return {'token': f'geobharat-{user.pk}-{uuid.uuid4()}', 'role': role, 'user': user_payload(user)}


def request_user(request):
    authorization = request.headers.get('Authorization', '')
    if not authorization.startswith('Bearer geobharat-'):
        return None
    token_parts = authorization.removeprefix('Bearer geobharat-').split('-', 1)
    if not token_parts[0].isdigit():
        return None
    return User.objects.filter(pk=int(token_parts[0])).first()


def record_for(ulpin, record_type):
    try:
        return ParcelRecord.objects.get(ulpin=ulpin, record_type=record_type)
    except ParcelRecord.DoesNotExist:
        return None


class AuthView(APIView):
    def post(self, request, action):
        payload = request.data or {}
        if action == 'signup':
            name = str(payload.get('name', '')).strip()
            email = str(payload.get('email', '')).strip().lower()
            password = payload.get('password', '')
            if not name or not email or not password:
                return Response({'error': 'Name, email, and password are required fields.'}, status=400)
            if User.objects.filter(email__iexact=email).exists():
                return Response({'error': 'An account with this email address already exists. Please log in.'}, status=400)
            user = User.objects.create_user(username=email, email=email, password=password, first_name=name)
            UserProfile.objects.create(user=user, data={
                'id': f'CIT-{user.pk:04d}', 'name': name, 'role': 'citizen',
                'phone': payload.get('phone', '+91 98000 00000'),
                'state': payload.get('state', 'Maharashtra'), 'district': payload.get('district', 'Pune'),
                'village': payload.get('village', 'Wagholi'), 'ulpin_associated': None,
            })
            return Response(auth_response(user), status=201)

        identifier = str(payload.get('email') or payload.get('username') or '').strip().lower()
        user = User.objects.filter(email__iexact=identifier).first() or User.objects.filter(username__iexact=identifier).first()
        if not user or not user.check_password(payload.get('password', '')):
            return Response({'error': 'Invalid credentials.'}, status=401)
        requested_role = payload.get('role', 'citizen')
        actual_role = (getattr(getattr(user, 'profile', None), 'data', {}) or {}).get('role', 'citizen')
        if requested_role in {'admin', 'official'} and actual_role not in {'admin', 'official'}:
            return Response({'error': 'Official credentials are required.'}, status=403)
        return Response(auth_response(user))


class ParcelListView(APIView):
    def get(self, request):
        features = [parcel.as_feature() for parcel in Parcel.objects.all()]
        return Response({'type': 'FeatureCollection', 'name': 'GeoBharat_Cadastral_Parcels', 'features': features})


class ParcelView(APIView):
    def get(self, request, ulpin):
        parcel = Parcel.objects.filter(ulpin=ulpin).first()
        if not parcel:
            return Response({'error': 'Parcel not found'}, status=404)
        return Response(parcel.as_feature())


class ParcelRecordView(APIView):
    record_type = None

    def get(self, request, ulpin):
        record = record_for(ulpin, self.record_type)
        if not record:
            return Response({'error': f'{self.record_type.title()} record not found for ULPIN {ulpin}'}, status=404)
        return Response(record.data)


class TaxPaymentView(APIView):
    def post(self, request, ulpin):
        record = record_for(ulpin, 'taxation')
        if not record:
            return Response({'error': f'Taxation record not found for ULPIN {ulpin}'}, status=404)
        data = record.data
        amount = float(request.data.get('amount') or data.get('tax_due_inr') or 0)
        today = date.today().isoformat()
        data['tax_due_inr'] = 0
        data['payment_status'] = 'Fully Paid (Instant Receipt)'
        data['last_paid_date'] = today
        data.setdefault('payment_history', []).insert(0, {
            'financial_year': '2024-2025', 'demand_inr': data.get('annual_demand_inr', amount),
            'paid_inr': amount, 'paid_date': today, 'receipt_no': f'ONLINE-PAY-{uuid.uuid4().hex[:10].upper()}',
            'mode': request.data.get('payment_mode', 'UPI / Bharat BillPay'),
        })
        record.data = data
        record.save(update_fields=['data'])
        AuditEvent.objects.create(event_type='tax.payment', ulpin=ulpin, payload={'amount': amount})
        return Response(data)


class UtilitiesView(APIView):
    def get(self, request):
        dataset = UtilityDataset.objects.first()
        return Response(dataset.data if dataset else {'type': 'FeatureCollection', 'features': []})


def create_queue_item_from_citizen_request(cr_data, cr_id, ulpin):
    parcel = Parcel.objects.filter(ulpin=ulpin).first()
    props = parcel.properties if parcel else {}
    survey_no = props.get('survey_no') or props.get('surveyNumber') or '45/1A'
    village_name = props.get('village', 'Wagholi')
    district_name = props.get('district', 'Pune')
    village = f"{village_name}, {district_name}" if district_name else village_name
    service_type = cr_data.get('service_type', 'Service Request')
    is_mutation = 'mutation' in service_type.lower() or 'varas' in service_type.lower()

    return {
        'id': cr_id,
        'ulpin': ulpin,
        'survey_no': survey_no,
        'village': village,
        'service_type': service_type,
        'applicant_name': cr_data.get('applicant_name', 'Citizen User'),
        'deed_number': f"APP-{date.today().year}-{cr_id[-4:]}",
        'submitted_date': cr_data.get('submission_date', date.today().isoformat()),
        'priority': 'High' if is_mutation else 'Medium',
        'status': 'Pending Scrutiny',
        'department': 'Revenue / Land Records',
        'fee_paid_inr': 150,
        'documents': [
            'Citizen Application Form',
            'Aadhaar e-KYC Verification',
            'Land Title / 7/12 Extract Record',
            'Cadastral Boundary Map Sheet',
        ],
        'notes': cr_data.get('remarks') or 'Application submitted online via GeoBharat Citizen Portal. Awaiting revenue officer scrutiny.',
    }


class CitizenRequestsView(APIView):
    def get(self, request):
        current_user = request_user(request)
        applicant_id = request.headers.get('X-Citizen-Id') or (user_payload(current_user).get('id') if current_user else None)
        query = CitizenRequest.objects.all()
        if applicant_id:
            query = query.filter(applicant_id=applicant_id)
        return Response([item.data for item in query])

    def post(self, request):
        payload = request.data or {}
        request_id = f"REQ-{date.today().year}-{uuid.uuid4().hex[:4].upper()}"
        current_user = request_user(request)
        applicant_id = request.headers.get('X-Citizen-Id') or (user_payload(current_user).get('id') if current_user else payload.get('applicant_id', 'CIT-001'))
        today = date.today().isoformat()
        item = {
            'id': request_id, 'ulpin': payload.get('ulpin', ''), 'applicant_id': applicant_id,
            'service_type': payload.get('service_type', 'Service Request'),
            'applicant_name': payload.get('applicant_name', 'Citizen User'),
            'applicant_phone': payload.get('applicant_phone', '+91 98000 00000'),
            'submission_date': today, 'status': 'Submitted & In Queue',
            'assigned_official': 'Sub-Divisional Revenue Desk', 'current_stage': 1,
            'stages': [
                {'name': 'Application Submitted', 'completed': True, 'date': today},
                {'name': 'Document Scrutiny', 'completed': False, 'current': True, 'date': 'Pending'},
                {'name': 'Field Inspection', 'completed': False, 'date': 'Pending'},
                {'name': 'Order Issuance', 'completed': False, 'date': 'Pending'},
            ], 'remarks': payload.get('remarks', 'Application received online via GeoBharat Land Stack.'),
        }
        CitizenRequest.objects.create(request_id=request_id, applicant_id=applicant_id, ulpin=item['ulpin'], data=item)

        # Auto-create entry in OfficialQueueItem so it immediately appears in Admin Portal Scrutiny Queue
        queue_data = create_queue_item_from_citizen_request(item, request_id, item['ulpin'])
        OfficialQueueItem.objects.update_or_create(item_id=request_id, defaults={'data': queue_data})
        AuditEvent.objects.create(event_type='citizen.request_created', actor_id=applicant_id, ulpin=item['ulpin'], payload=queue_data)

        return Response(item, status=201)


class OfficialQueueView(APIView):
    def get(self, request):
        # Auto-sync any existing CitizenRequest records that lack an OfficialQueueItem
        existing_ids = set(OfficialQueueItem.objects.values_list('item_id', flat=True))
        for cr in CitizenRequest.objects.all():
            if cr.request_id not in existing_ids:
                queue_data = create_queue_item_from_citizen_request(cr.data or {}, cr.request_id, cr.ulpin)
                OfficialQueueItem.objects.create(item_id=cr.request_id, data=queue_data)

        return Response([item.data for item in OfficialQueueItem.objects.all().order_by('-updated_at')])


class OfficialActionView(APIView):
    def post(self, request, item_id):
        item = OfficialQueueItem.objects.filter(item_id=item_id).first()
        if not item:
            return Response({'error': 'Queue item not found'}, status=404)
        payload = request.data or {}
        data = item.data
        approved = payload.get('action') == 'approve'
        data['status'] = 'Approved & Certified' if approved else 'Rejected / Query Raised'
        data['action_date'] = date.today().isoformat()
        data['officer_remarks'] = payload.get('remarks') or ('Documents found in order. Digital sanction sealed.' if approved else 'Deficiency observed in title clearance.')
        item.data = data
        item.save(update_fields=['data', 'updated_at'])

        # Two-way sync: update CitizenRequest so the citizen tracker reflects the officer's decision
        citizen_req = CitizenRequest.objects.filter(request_id=item_id).first()
        if citizen_req:
            cdata = citizen_req.data or {}
            cdata['status'] = data['status']
            cdata['remarks'] = data['officer_remarks']
            if approved:
                cdata['current_stage'] = 4
                for stg in cdata.get('stages', []):
                    stg['completed'] = True
                    stg['current'] = False
                    if stg.get('date') == 'Pending':
                        stg['date'] = data['action_date']
            else:
                for stg in cdata.get('stages', []):
                    if stg.get('name') == 'Document Scrutiny':
                        stg['current'] = False
                        stg['completed'] = False
                        stg['date'] = 'Rejected / Query Raised'
            citizen_req.data = cdata
            citizen_req.save(update_fields=['data'])

        AuditEvent.objects.create(event_type='official.queue_action', actor_id=request.headers.get('X-Official-Id', ''), ulpin=data.get('ulpin', ''), payload=payload)
        return Response(data)


class AnalyticsView(APIView):
    def get(self, request):
        parcels = Parcel.objects.all()
        zone_counts = {}
        zone_colors = {
            'Residential (R-1)': '#3B82F6',
            'Residential': '#3B82F6',
            'Commercial (C-1)': '#EF4444',
            'Commercial': '#EF4444',
            'Agricultural (A-1)': '#16A34A',
            'Agricultural': '#16A34A',
            'Industrial (I-1)': '#9333EA',
            'Industrial': '#9333EA',
            'Eco-sensitive': '#0D9488',
        }
        for p in parcels:
            props = p.properties or {}
            zt = props.get('zone_type', 'Residential')
            clean_name = zt.split('(')[0].strip() if '(' in zt else zt
            sqm = props.get('area_sqm', 1000)
            if clean_name not in zone_counts:
                zone_counts[clean_name] = {'count': 0, 'area_sqm': 0, 'color': zone_colors.get(clean_name, zone_colors.get(zt, '#3B82F6'))}
            zone_counts[clean_name]['count'] += 1
            zone_counts[clean_name]['area_sqm'] += sqm

        zoning_dist = [
            {'name': name, 'count': item['count'], 'area_sqm': item['area_sqm'], 'color': item['color']}
            for name, item in zone_counts.items()
        ]

        if not zoning_dist:
            zoning_dist = [
                {'name': 'Residential', 'count': 4, 'area_sqm': 17275, 'color': '#3B82F6'},
                {'name': 'Commercial', 'count': 3, 'area_sqm': 11216, 'color': '#EF4444'},
                {'name': 'Agricultural', 'count': 1, 'area_sqm': 9105, 'color': '#16A34A'},
                {'name': 'Industrial', 'count': 1, 'area_sqm': 3561, 'color': '#9333EA'},
                {'name': 'Eco-sensitive', 'count': 1, 'area_sqm': 2428, 'color': '#0D9488'},
            ]

        dispute_split = [
            {'name': 'Clear Title', 'count': 7, 'color': '#10B981'},
            {'name': 'Under Mutation', 'count': 1, 'color': '#F59E0B'},
            {'name': 'Court / Legal Stay', 'count': 1, 'color': '#EF4444'},
            {'name': 'Statutory Buffer', 'count': 1, 'color': '#0D9488'},
        ]

        return Response({
            'summary': {'total_parcels': parcels.count() or 10, 'total_area_sqm': 44417, 'total_area_acres': 10.97, 'mutation_success_rate': '94.2%', 'active_disputes': 2, 'tax_collection_rate': '81.4%', 'revenue_collected_inr': 885780, 'revenue_due_inr': 144000},
            'mutations_monthly': [{'month': month, 'applied': applied, 'approved': approved, 'rejected': applied - approved} for month, applied, approved in [('Jan', 42, 39), ('Feb', 58, 54), ('Mar', 75, 71), ('Apr', 61, 58), ('May', 80, 76), ('Jun', 95, 89), ('Jul', 84, 80), ('Aug', 90, 86)]],
            'zoning_distribution': zoning_dist,
            'dispute_status_split': dispute_split,
        })


class SaleDeedSyncView(APIView):
    @transaction.atomic
    def post(self, request):
        payload = request.data or {}
        ulpin = payload.get('ulpin')
        new_owner = payload.get('new_owner')
        parcel = Parcel.objects.filter(ulpin=ulpin).first()
        if not parcel or not new_owner:
            return Response({'error': 'A valid ULPIN and new_owner are required.'}, status=400)
        parcel.properties['owner_name'] = new_owner
        parcel.properties['status'] = 'Clear Title'
        parcel.save(update_fields=['properties'])
        registration = record_for(ulpin, 'registration')
        if registration:
            registration.data.update({'deed_number': payload.get('deed_number') or registration.data.get('deed_number'), 'consideration_amount_inr': payload.get('consideration_inr') or registration.data.get('market_value_inr'), 'registration_date': date.today().isoformat()})
            registration.save(update_fields=['data'])
        ror = record_for(ulpin, 'ror')
        if ror:
            previous = ror.data.get('owner_name')
            ror.data['owner_name'] = new_owner
            ror.data.setdefault('mutation_history', []).insert(0, {'mutation_id': f'AUTO-MUT-{uuid.uuid4().hex[:8].upper()}', 'date': date.today().isoformat(), 'type': 'Instant SRO Webhook Mutation (Sale Deed)', 'status': 'Certified & Mutated (Auto-Amal)', 'officer': 'Django Interoperable Revenue API', 'remarks': f'Ownership transferred from {previous} to {new_owner}.'})
            ror.save(update_fields=['data'])
        AuditEvent.objects.create(event_type='sale_deed.sync', ulpin=ulpin, payload=payload)
        return Response({'success': True, 'timestamp': date.today().isoformat(), 'transaction_id': f'TXN-SYNC-{uuid.uuid4().hex[:10].upper()}', 'ulpin': ulpin, 'steps': [{'system': 'Sub-Registrar Office (SRO)', 'status': 'Success', 'message': 'Sale deed registered and sealed.'}, {'system': 'Revenue Land Records', 'status': 'Success', 'message': f'RoR mutated to {new_owner}.'}, {'system': 'Municipal Property Tax Gateway', 'status': 'Success', 'message': 'Assessee details mutation scheduled.'}, {'system': 'Citizen Notification Service', 'status': 'Dispatched', 'message': 'Updated extract notification queued.'}]})
