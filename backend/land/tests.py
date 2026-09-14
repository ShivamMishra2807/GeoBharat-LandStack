from django.test import TestCase
from rest_framework.test import APIClient

from .models import Parcel, UserProfile


class LandApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        Parcel.objects.create(
            ulpin='12345678901234', feature_id='PARCEL-TEST',
            geometry={'type': 'Polygon', 'coordinates': []},
            properties={'ulpin': '12345678901234', 'owner_name': 'Test Owner'},
        )

    def test_parcel_list_returns_geojson(self):
        response = self.client.get('/api/v1/parcels')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['features'][0]['properties']['owner_name'], 'Test Owner')

    def test_signup_returns_persisted_profile(self):
        response = self.client.post('/api/v1/auth/signup', {'name': 'Test Citizen', 'email': 'test@example.in', 'password': 'secret'}, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertTrue(UserProfile.objects.filter(data__id=response.data['user']['id']).exists())