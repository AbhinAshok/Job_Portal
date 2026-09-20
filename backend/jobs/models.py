from django.db import models
from django.conf import settings
from companies.models import Company

class Job(models.Model):
    class JobType(models.TextChoices):
        FULL_TIME = 'FULL_TIME', 'Full-time'
        PART_TIME = 'PART_TIME', 'Part-time'
        CONTRACT = 'CONTRACT', 'Contract'
        INTERNSHIP = 'INTERNSHIP', 'Internship'
        REMOTE = 'REMOTE', 'Remote'

    recruiter = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='posted_jobs'
    )
    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        related_name='jobs',
        null=True, 
        blank=True
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    requirements = models.TextField(blank=True)
    location = models.CharField(max_length=255)
    job_type = models.CharField(
        max_length=50, 
        choices=JobType.choices, 
        default=JobType.FULL_TIME
    )
    salary_min = models.PositiveIntegerField(null=True, blank=True)
    salary_max = models.PositiveIntegerField(null=True, blank=True)
    salary_currency = models.CharField(max_length=10, default='USD')
    category = models.CharField(max_length=100, blank=True)
    tags = models.CharField(max_length=255, blank=True, help_text="Comma separated tags")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} at {self.company.name if self.company else 'Independent'}"
