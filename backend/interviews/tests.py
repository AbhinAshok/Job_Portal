from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils import timezone
from jobs.models import Job
from applications.models import Application
from interviews.models import Interview

User = get_user_model()

class InterviewAPITestCase(TestCase):
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
            title="Backend Engineer",
            description="Dev position",
            location="Remote"
        )
        self.application = Application.objects.create(
            job=self.job,
            candidate=self.candidate
        )

    def test_schedule_interview_by_recruiter(self):
        self.client.force_authenticate(user=self.recruiter)
        scheduled_time = (timezone.now() + timezone.timedelta(days=2)).isoformat()
        payload = {
            "application": self.application.id,
            "scheduled_at": scheduled_time,
            "duration_minutes": 45,
            "meeting_link": "https://meet.google.com/abc-defg-hij"
        }
        response = self.client.post('/api/interviews/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'scheduled')
        
        # Check that application status was updated
        self.application.refresh_from_db()
        self.assertEqual(self.application.status, 'interview')

    def test_candidate_view_interviews(self):
        scheduled_time = timezone.now() + timezone.timedelta(days=2)
        Interview.objects.create(
            application=self.application,
            candidate=self.candidate,
            recruiter=self.recruiter,
            scheduled_at=scheduled_time
        )
        self.client.force_authenticate(user=self.candidate)
        response = self.client.get('/api/interviews/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
