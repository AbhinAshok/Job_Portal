from django.db import models
from django.conf import settings
from applications.models import Application

class Message(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='sent_messages'
    )
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='received_messages'
    )
    application = models.ForeignKey(
        Application, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='messages'
    )
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Message from {self.sender.username} to {self.recipient.username}"
