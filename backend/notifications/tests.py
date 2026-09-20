from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Notification

User = get_user_model()

class NotificationAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="user1",
            email="user1@test.com",
            password="Password123!",
            role="CANDIDATE"
        )
        self.notification = Notification.objects.create(
            recipient=self.user,
            title="Welcome to HireFlow",
            message="Thank you for registering!",
            notification_type="welcome"
        )

    def test_list_notifications(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/notifications/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_mark_notification_read(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(f'/api/notifications/{self.notification.id}/mark_as_read/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_read'])

    def test_unread_count(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/notifications/unread_count/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['unread_count'], 1)
