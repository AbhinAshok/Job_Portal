from rest_framework import serializers
from .models import Application
from jobs.serializers import JobListSerializer, JobDetailSerializer
from resumes.serializers import ResumeSerializer


class ApplicationListSerializer(serializers.ModelSerializer):
    candidate_username = serializers.ReadOnlyField(source='candidate.username')
    job_title = serializers.ReadOnlyField(source='job.title')
    company_name = serializers.ReadOnlyField(source='job.company.name')

    class Meta:
        model = Application
        fields = [
            'id', 'job', 'job_title', 'company_name',
            'candidate', 'candidate_username',
            'resume', 'status', 'applied_at', 'updated_at',
        ]


class ApplicationDetailSerializer(serializers.ModelSerializer):
    candidate_username = serializers.ReadOnlyField(source='candidate.username')
    candidate_email = serializers.ReadOnlyField(source='candidate.email')
    job_title = serializers.ReadOnlyField(source='job.title')
    company_name = serializers.ReadOnlyField(source='job.company.name')
    job_details = JobDetailSerializer(source='job', read_only=True)
    resume_details = ResumeSerializer(source='resume', read_only=True, allow_null=True)

    class Meta:
        model = Application
        fields = [
            'id', 'job', 'job_title', 'company_name', 'job_details',
            'candidate', 'candidate_username', 'candidate_email',
            'resume', 'resume_details', 'cover_letter', 'status',
            'applied_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'candidate', 'status', 'applied_at', 'updated_at',
        ]

    def validate_job(self, job):
        if not job.is_active:
            raise serializers.ValidationError("This job is no longer accepting applications.")
        return job

    def validate_resume(self, resume):
        if resume is None:
            return resume
        user = self.context['request'].user
        if resume.candidate_id != user.id:
            raise serializers.ValidationError("You can only attach your own resume.")
        return resume

    def validate(self, data):
        user = self.context['request'].user
        job = data.get('job')
        if self.instance is None and job and Application.objects.filter(job=job, candidate=user).exists():
            raise serializers.ValidationError({"job": "You have already applied for this job."})
        return data

    def create(self, validated_data):
        from django.db import IntegrityError
        validated_data['candidate'] = self.context['request'].user
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError(
                {"job": "You have already applied for this job."}
            )


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['status']

    def validate_status(self, value):
        
        allowed = {c[0] for c in Application.Status.choices}
        if value not in allowed:
            raise serializers.ValidationError("Invalid status.")
        return value