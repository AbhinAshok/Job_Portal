from rest_framework import serializers
from .models import Job
from companies.models import Company
from companies.serializers import CompanySerializer


class JobListSerializer(serializers.ModelSerializer):
    
    company_name = serializers.CharField(source='company.name', read_only=True, allow_null=True)
    company_logo = serializers.SerializerMethodField()
    recruiter_username = serializers.ReadOnlyField(source='recruiter.username')
    tags = serializers.SerializerMethodField()
    applicant_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'company', 'company_name', 'company_logo',
            'recruiter', 'recruiter_username',
            'location', 'job_type', 'salary_min', 'salary_max', 'salary_currency',
            'category', 'tags', 'is_active', 'created_at', 'applicant_count',
        ]

    def get_company_logo(self, obj):
        if obj.company and obj.company.logo:
            try:
                return obj.company.logo.url
            except ValueError:
                return None
        return None

    def get_tags(self, obj):
        return [t.strip() for t in obj.tags.split(',') if t.strip()] if obj.tags else []


class JobDetailSerializer(serializers.ModelSerializer):
    
    company_name = serializers.CharField(source='company.name', read_only=True, allow_null=True)
    recruiter_username = serializers.ReadOnlyField(source='recruiter.username')
    company_details = CompanySerializer(source='company', read_only=True)
    tags = serializers.SerializerMethodField()
    applicant_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Job
        fields = [
            'id', 'recruiter', 'recruiter_username',
            'company', 'company_name', 'company_details',
            'title', 'description', 'requirements',
            'location', 'job_type',
            'salary_min', 'salary_max', 'salary_currency',
            'category', 'tags', 'is_active',
            'created_at', 'updated_at', 'applicant_count',
        ]
        read_only_fields = ['id', 'recruiter', 'created_at', 'updated_at']

    def get_tags(self, obj):
        return [t.strip() for t in obj.tags.split(',') if t.strip()] if obj.tags else []

    

    def validate_company(self, value):
        if value is None:
            return value
        request = self.context.get('request')
        if request and not request.user.is_superuser:
            if value.recruiter_id != request.user.id:
                raise serializers.ValidationError(
                    "You can only post jobs for companies you own."
                )
        return value

    def validate(self, attrs):
        smin = attrs.get('salary_min')
        smax = attrs.get('salary_max')
        if smin is not None and smax is not None and smin > smax:
            raise serializers.ValidationError(
                {"salary_min": "salary_min cannot exceed salary_max."}
            )
        return attrs

    def create(self, validated_data):
        validated_data['recruiter'] = self.context['request'].user
        return super().create(validated_data)