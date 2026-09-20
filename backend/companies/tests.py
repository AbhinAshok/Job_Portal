from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Company

User = get_user_model()

class CompanyAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.recruiter = User.objects.create_user(
            username="recruiter1",
            email="recruiter1@test.com",
            password="Password123!",
            role="RECRUITER"
        )
        self.candidate = User.objects.create_user(
            username="candidate1",
            email="candidate1@test.com",
            password="Password123!",
            role="CANDIDATE"
        )
        self.company = Company.objects.create(
            recruiter=self.recruiter,
            name="Tech Corp",
            description="Innovative Tech Solutions",
            industry="Software",
            location="San Francisco"
        )

    def test_list_companies(self):
        response = self.client.get('/api/companies/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_company_by_recruiter(self):
        self.client.force_authenticate(user=self.recruiter)
        payload = {
            "name": "Cloud Systems",
            "description": "Cloud hosting services",
            "industry": "Cloud Computing",
            "location": "Remote"
        }
        response = self.client.post('/api/companies/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], "Cloud Systems")

    def test_create_company_by_candidate_denied(self):
        self.client.force_authenticate(user=self.candidate)
        payload = {
            "name": "Unauthorized Company",
            "industry": "Testing"
        }
        response = self.client.post('/api/companies/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
