from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from jobs.models import Job
from applications.models import Application

User = get_user_model()

class ApplicationAPITestCase(TestCase):
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
        self.job = Job.objects.create(
            recruiter=self.recruiter,
            title="Backend Developer",
            description="Django backend dev",
            location="Remote"
        )

    def test_submit_application_by_candidate(self):
        self.client.force_authenticate(user=self.candidate)
        payload = {
            "job": self.job.id,
            "cover_letter": "I am passionate about Django."
        }
        response = self.client.post('/api/applications/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'applied')

    def test_prevent_duplicate_application(self):
        Application.objects.create(job=self.job, candidate=self.candidate)
        self.client.force_authenticate(user=self.candidate)
        payload = {
            "job": self.job.id,
            "cover_letter": "Second attempt"
        }
        response = self.client.post('/api/applications/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_recruiter_update_status(self):
        application = Application.objects.create(job=self.job, candidate=self.candidate)
        self.client.force_authenticate(user=self.recruiter)
        payload = {"status": "shortlisted"}
        response = self.client.patch(f'/api/applications/{application.id}/update_status/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'shortlisted')
