from django.db import models
from django.conf import settings
from jobs.models import Job
from resumes.models import Resume

class Application(models.Model):
    class Status(models.TextChoices):
        APPLIED = 'applied', 'Applied'
        IN_REVIEW = 'in_review', 'Under Review'
        SHORTLISTED = 'shortlisted', 'Shortlisted'
        INTERVIEW = 'interview', 'Interview Scheduled'
        REJECTED = 'rejected', 'Rejected'
        HIRED = 'hired', 'Hired'

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    candidate = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='applications'
    )
    resume = models.ForeignKey(
        Resume, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='applications'
    )
    cover_letter = models.TextField(blank=True)
    status = models.CharField(
        max_length=50, 
        choices=Status.choices, 
        default=Status.APPLIED
    )
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-applied_at']
        constraints = [
            models.UniqueConstraint(
                fields=['job', 'candidate'], 
                name='unique_application_per_job'
            )
        ]

    def __str__(self):
        return f"{self.candidate.username} - {self.job.title} ({self.get_status_display()})"
