from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    data = models.JSONField(default=dict)


class Parcel(models.Model):
    ulpin = models.CharField(max_length=14, unique=True)
    feature_id = models.CharField(max_length=100, blank=True)
    geometry = models.JSONField()
    properties = models.JSONField(default=dict)

    class Meta:
        ordering = ['ulpin']

    def as_feature(self):
        return {
            'type': 'Feature',
            'id': self.feature_id or f'PARCEL-{self.pk}',
            'properties': self.properties,
            'geometry': self.geometry,
        }


class ParcelRecord(models.Model):
    RECORD_TYPES = [('ror', 'Record of Rights'), ('registration', 'Registration'), ('planning', 'Planning'), ('taxation', 'Taxation')]
    ulpin = models.CharField(max_length=14)
    record_type = models.CharField(max_length=20, choices=RECORD_TYPES)
    data = models.JSONField(default=dict)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['ulpin', 'record_type'], name='unique_parcel_record')]


class UtilityDataset(models.Model):
    name = models.CharField(max_length=100, unique=True)
    data = models.JSONField(default=dict)


class CitizenRequest(models.Model):
    request_id = models.CharField(max_length=40, unique=True)
    applicant_id = models.CharField(max_length=40)
    ulpin = models.CharField(max_length=14)
    data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']


class OfficialQueueItem(models.Model):
    item_id = models.CharField(max_length=50, unique=True)
    data = models.JSONField(default=dict)
    updated_at = models.DateTimeField(auto_now=True)


class AuditEvent(models.Model):
    event_type = models.CharField(max_length=100)
    actor_id = models.CharField(max_length=100, blank=True)
    ulpin = models.CharField(max_length=14, blank=True)
    payload = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
