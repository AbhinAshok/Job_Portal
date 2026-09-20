from django.db import models
from django.conf import settings
from applications.models import Application

class Interview(models.Model):
    class Status(models.TextChoices):
        SCHEDULED = 'scheduled', 'Scheduled'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'
        RESCHEDULED = 'rescheduled', 'Rescheduled'

    application = models.ForeignKey(
        Application, 
        on_delete=models.CASCADE, 
        related_name='interviews'
    )
    candidate = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='candidate_interviews'
    )
    recruiter = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='recruiter_interviews'
    )
    scheduled_at = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(default=30)
    meeting_link = models.CharField(max_length=500, blank=True)
    notes = models.TextField(blank=True)
    status = models.CharField(
        max_length=50, 
        choices=Status.choices, 
        default=Status.SCHEDULED
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['scheduled_at']

    def __str__(self):
        return f"Interview with {self.candidate.username} for {self.application.job.title}"
