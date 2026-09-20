from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


class CandidateRegistrationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')

    def test_candidate_registration_success(self):
        payload = {
            "username": "candidate1",
            "email": "candidate1@example.com",
            "password": "Password123!",
            "role": "CANDIDATE"
        }
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['username'], 'candidate1')
        self.assertEqual(response.data['user']['role'], 'CANDIDATE')

        user = User.objects.get(username='candidate1')
        self.assertTrue(hasattr(user, 'candidate_profile'))

    def test_candidate_registration_with_empty_company_name(self):
        payload = {
            "username": "candidate2",
            "email": "candidate2@example.com",
            "password": "Password123!",
            "role": "CANDIDATE",
            "company_name": ""
        }
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        user = User.objects.get(username='candidate2')
        self.assertTrue(hasattr(user, 'candidate_profile'))


class RecruiterRegistrationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')

    def test_recruiter_registration_success(self):
        payload = {
            "username": "recruiter1",
            "email": "recruiter1@example.com",
            "password": "Password123!",
            "role": "RECRUITER",
            "company_name": "Tech Corp"
        }
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)

        user = User.objects.get(username='recruiter1')
        self.assertTrue(hasattr(user, 'recruiter_profile'))
        self.assertEqual(user.recruiter_profile.company_name, "Tech Corp")

    def test_recruiter_registration_missing_company_name(self):
        payload = {
            "username": "recruiter2",
            "email": "recruiter2@example.com",
            "password": "Password123!",
            "role": "RECRUITER"
        }
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('company_name', response.data)


class LoginTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse('login')
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="SecretPassword123",
            role="CANDIDATE"
        )

    def test_login_success(self):
        payload = {
            "username": "testuser",
            "password": "SecretPassword123"
        }
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')

    def test_login_invalid_password(self):
        payload = {
            "username": "testuser",
            "password": "WrongPassword"
        }
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_non_existent_user(self):
        payload = {
            "username": "nonexistent",
            "password": "SecretPassword123"
        }
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserDetailTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.me_url = reverse('user_detail')
        self.user = User.objects.create_user(
            username="detailuser",
            email="detailuser@example.com",
            password="SecretPassword123",
            role="CANDIDATE"
        )

    def test_get_user_detail_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'detailuser')

    def test_get_user_detail_unauthenticated(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_candidate_profile(self):
        from accounts.models import CandidateProfile
        CandidateProfile.objects.create(user=self.user)
        self.client.force_authenticate(user=self.user)

        update_payload = {
            "email": "newemail@example.com",
            "candidate_profile": {
                "skills": "Python, Django, React",
                "experience_years": 3
            }
        }
        response = self.client.patch(self.me_url, update_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'newemail@example.com')
        self.assertEqual(response.data['candidate_profile']['skills'], 'Python, Django, React')
        self.assertEqual(response.data['candidate_profile']['experience_years'], 3)


class TokenRefreshTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.refresh_url = reverse('token_refresh')

    def test_token_refresh(self):
        reg_payload = {
            "username": "tokenuser",
            "email": "tokenuser@example.com",
            "password": "Password123!",
            "role": "CANDIDATE"
        }
        reg_response = self.client.post(self.register_url, reg_payload, format='json')
        refresh_token = reg_response.data['refresh']

        refresh_payload = {"refresh": refresh_token}
        response = self.client.post(self.refresh_url, refresh_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
