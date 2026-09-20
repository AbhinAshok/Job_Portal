from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Message

User = get_user_model()

class MessageAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(
            username="user1",
            email="user1@test.com",
            password="Password123!",
            role="RECRUITER"
        )
        self.user2 = User.objects.create_user(
            username="user2",
            email="user2@test.com",
            password="Password123!",
            role="CANDIDATE"
        )

    def test_send_message(self):
        self.client.force_authenticate(user=self.user1)
        payload = {
            "recipient": self.user2.id,
            "content": "Hello candidate, are you available for an interview?"
        }
        response = self.client.post('/api/messaging/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['content'], payload['content'])

    def test_get_message_thread(self):
        Message.objects.create(
            sender=self.user1,
            recipient=self.user2,
            content="Initial message"
        )
        self.client.force_authenticate(user=self.user2)
        response = self.client.get(f'/api/messaging/thread/?user_id={self.user1.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['content'], "Initial message")
