import json
from pathlib import Path

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from land.models import OfficialQueueItem, Parcel, ParcelRecord, UserProfile, UtilityDataset

User = get_user_model()


class Command(BaseCommand):
    help = 'Load GeoBharat mock datasets into the Django database.'

    def load_json(self, filename):
        with Path(settings.MOCK_DATA_DIR, filename).open(encoding='utf-8') as handle:
            return json.load(handle)

    def handle(self, *args, **options):
        parcels = self.load_json('parcels.geojson')
        for feature in parcels.get('features', []):
            properties = feature.get('properties', {})
            Parcel.objects.update_or_create(
                ulpin=str(properties['ulpin']),
                defaults={'feature_id': str(feature.get('id', '')), 'geometry': feature.get('geometry', {}), 'properties': properties},
            )

        for record_type, filename in [('ror', 'record-of-rights.json'), ('registration', 'registration.json'), ('planning', 'planning.json'), ('taxation', 'taxation.json')]:
            for data in self.load_json(filename):
                ParcelRecord.objects.update_or_create(ulpin=str(data['ulpin']), record_type=record_type, defaults={'data': data})

        UtilityDataset.objects.update_or_create(name='default', defaults={'data': self.load_json('utilities.geojson')})
        self.seed_users()
        self.seed_queue()
        self.stdout.write(self.style.SUCCESS('GeoBharat demo data loaded.'))

    def seed_users(self):
        users = [
            ('ramesh.patil@example.in', 'citizen123', 'Ramesh Dnyandev Patil', {'id': 'CIT-001', 'role': 'citizen', 'phone': '+91 98220 44102', 'state': 'Maharashtra', 'district': 'Pune', 'taluka': 'Haveli', 'village': 'Wagholi', 'ulpin_associated': '27250010045001'}),
            ('sunita.gaikwad@example.in', 'citizen123', 'Sunita Suresh Gaikwad', {'id': 'CIT-002', 'role': 'citizen', 'phone': '+91 98231 55900', 'state': 'Maharashtra', 'district': 'Pune', 'taluka': 'Haveli', 'village': 'Wagholi', 'ulpin_associated': '27250010045002'}),
            ('admin@geobharat.gov.in', 'admin123', 'Dr. Vikramaditya Shinde, IAS', {'id': 'ADMIN-001', 'role': 'admin', 'username': 'admin', 'designation': 'Sub-Divisional Officer (SDO) / Prant Officer', 'department': 'Department of Revenue & Land Records', 'jurisdiction': 'Haveli & Pune Metropolitan Region'}),
        ]
        for email, password, name, profile in users:
            user, created = User.objects.get_or_create(username=profile.get('username', email), defaults={'email': email, 'first_name': name})
            user.email = email
            user.first_name = name
            user.set_password(password)
            user.save()
            UserProfile.objects.update_or_create(user=user, defaults={'data': {'name': name, **profile}})

    def seed_queue(self):
        queue = [
            ('MUT-PUN-2024-1029', '27250010045002', 'Sale Deed Mutation Entry', 'Sunita Suresh Gaikwad', 'High'),
            ('BP-PMRDA-2024-014', '27250010045002', 'Commercial Building Permission', 'Sunita Suresh Gaikwad', 'Medium'),
            ('DISP-LKO-2023-019', '09030020114004', 'Boundary Demarcation & Dispute Hearing', 'Brijeshwar Awadh Sharma', 'Urgent / Legal'),
            ('PATTA-KANCHI-2024-091', '33010050082006', 'Patta Sub-Division Regularization', 'K. V. Soundararajan', 'Medium'),
        ]
        for item_id, ulpin, service_type, applicant_name, priority in queue:
            OfficialQueueItem.objects.update_or_create(item_id=item_id, defaults={'data': {'id': item_id, 'ulpin': ulpin, 'service_type': service_type, 'applicant_name': applicant_name, 'priority': priority, 'status': 'Pending Approval', 'department': 'Revenue / Land Records'}})
