from django.contrib import admin
from .models import Resume

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('title', 'candidate', 'experience_years', 'is_default', 'uploaded_at')
    list_filter = ('is_default', 'uploaded_at')
    search_fields = ('title', 'candidate__username', 'skills')
