from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Resume

User = get_user_model()

class ResumeAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.candidate = User.objects.create_user(
            username="candidate1",
            email="candidate1@test.com",
            password="Password123!",
            role="CANDIDATE"
        )
        self.sample_file = SimpleUploadedFile("resume.pdf", b"file_content", content_type="application/pdf")
        self.resume = Resume.objects.create(
            candidate=self.candidate,
            title="My Software Resume",
            file=self.sample_file,
            skills="Python, Django",
            experience_years=3
        )

    def test_list_resumes(self):
        self.client.force_authenticate(user=self.candidate)
        response = self.client.get('/api/resumes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_upload_resume(self):
        self.client.force_authenticate(user=self.candidate)
        new_file = SimpleUploadedFile("new_resume.pdf", b"new_content", content_type="application/pdf")
        payload = {
            "title": "Updated Resume",
            "file": new_file,
            "skills": "React, Vite",
            "experience_years": 4
        }
        response = self.client.post('/api/resumes/', payload, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], "Updated Resume")

    def test_set_default_resume(self):
        self.client.force_authenticate(user=self.candidate)
        response = self.client.post(f'/api/resumes/{self.resume.id}/set_default/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_default'])
