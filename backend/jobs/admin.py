from django.contrib import admin
from .models import Job

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'recruiter', 'job_type', 'location', 'is_active', 'created_at')
    list_filter = ('job_type', 'is_active', 'category', 'created_at')
    search_fields = ('title', 'description', 'location', 'category', 'tags')
