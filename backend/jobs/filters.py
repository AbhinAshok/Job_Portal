from django.db.models import Q

def filter_jobs(queryset, params):
    category = params.get('category')
    job_type = params.get('job_type')
    location = params.get('location')
    search = params.get('search')
    is_active = params.get('is_active')

    if is_active is not None:
        queryset = queryset.filter(is_active=(is_active.lower() == 'true'))
    if category:
        queryset = queryset.filter(category__iexact=category)
    if job_type:
        queryset = queryset.filter(job_type__iexact=job_type)
    if location:
        queryset = queryset.filter(location__icontains=location)
    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) | 
            Q(description__icontains=search) | 
            Q(tags__icontains=search) |
            Q(category__icontains=search)
        )
    return queryset
