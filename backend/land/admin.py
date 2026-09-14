from django.contrib import admin
from .models import AuditEvent, CitizenRequest, OfficialQueueItem, Parcel, ParcelRecord, UserProfile, UtilityDataset

admin.site.register([Parcel, ParcelRecord, UserProfile, UtilityDataset, CitizenRequest, OfficialQueueItem, AuditEvent])
