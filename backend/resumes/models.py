from django.db import models
from django.conf import settings

class Resume(models.Model):
    candidate = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='resumes'
    )
    title = models.CharField(max_length=255, default='My Resume')
    file = models.FileField(upload_to='resumes/')
    skills = models.TextField(blank=True, help_text="Comma separated skills")
    experience_years = models.PositiveIntegerField(default=0)
    is_default = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']

    def save(self, *args, **kwargs):
        if self.is_default:
            Resume.objects.filter(candidate=self.candidate).update(is_default=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - {self.candidate.username}"
