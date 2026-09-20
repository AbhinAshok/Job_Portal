from django.contrib import admin
from .models import Interview

@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = ('candidate', 'recruiter', 'scheduled_at', 'status')
    list_filter = ('status', 'scheduled_at')
    search_fields = ('candidate__username', 'recruiter__username', 'meeting_link')
