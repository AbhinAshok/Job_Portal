from django.db import models
from django.conf import settings

class Company(models.Model):
    recruiter = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='companies'
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    website = models.URLField(max_length=500, blank=True)
    location = models.CharField(max_length=255, blank=True)
    logo = models.FileField(upload_to='company_logos/', null=True, blank=True)
    industry = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Companies"
        ordering = ['-created_at']

    def __str__(self):
        return self.name