from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from companies.models import Company
from .models import Job

User = get_user_model()

class JobAPITestCase(TestCase):
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
            industry="Software"
        )
        self.job = Job.objects.create(
            recruiter=self.recruiter,
            company=self.company,
            title="Senior Python Engineer",
            description="Build scalable web apps",
            location="Remote",
            job_type="REMOTE",
            category="Engineering"
        )

    def test_list_jobs(self):
        response = self.client.get('/api/jobs/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_job_by_recruiter(self):
        self.client.force_authenticate(user=self.recruiter)
        payload = {
            "company": self.company.id,
            "title": "Frontend Developer",
            "description": "Develop modern user interfaces",
            "location": "New York",
            "job_type": "FULL_TIME",
            "category": "Frontend"
        }
        response = self.client.post('/api/jobs/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], "Frontend Developer")

    def test_create_job_by_candidate_denied(self):
        self.client.force_authenticate(user=self.candidate)
        payload = {
            "title": "Unauthorized Job Posting",
            "description": "Invalid",
            "location": "Remote"
        }
        response = self.client.post('/api/jobs/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_search_jobs(self):
        response = self.client.get('/api/jobs/?search=Python')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
