from django.urls import path
from .views import AnalyticsView, AuthView, CitizenRequestsView, OfficialActionView, OfficialQueueView, ParcelListView, ParcelRecordView, ParcelView, SaleDeedSyncView, TaxPaymentView, UtilitiesView

class RoRView(ParcelRecordView):
    record_type = 'ror'
class RegistrationView(ParcelRecordView):
    record_type = 'registration'
class PlanningView(ParcelRecordView):
    record_type = 'planning'
class TaxationView(ParcelRecordView):
    record_type = 'taxation'

urlpatterns = [
    path('auth/<str:action>', AuthView.as_view()),
    path('parcels', ParcelListView.as_view()), path('parcels/<str:ulpin>', ParcelView.as_view()),
    path('parcels/<str:ulpin>/ror', RoRView.as_view()), path('parcels/<str:ulpin>/registration', RegistrationView.as_view()),
    path('parcels/<str:ulpin>/planning', PlanningView.as_view()), path('parcels/<str:ulpin>/taxation', TaxationView.as_view()),
    path('parcels/<str:ulpin>/taxation/pay', TaxPaymentView.as_view()), path('utilities', UtilitiesView.as_view()),
    path('citizen/requests', CitizenRequestsView.as_view()), path('official/queue', OfficialQueueView.as_view()),
    path('official/queue/<str:item_id>/action', OfficialActionView.as_view()), path('official/analytics', AnalyticsView.as_view()),
    path('workflows/sync-sale-deed', SaleDeedSyncView.as_view()),
]
