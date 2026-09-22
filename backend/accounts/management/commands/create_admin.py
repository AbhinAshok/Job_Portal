import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    def handle(self, *args, **options):
        User = get_user_model()
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

        if not username or not password:
            self.stdout.write(self.style.WARNING('Superuser environment variables not set. Skipping.'))
            return

        if not User.objects.filter(username=username).exists():
            self.stdout.write(f"Creating superuser {username}...")
            
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
                role='ADMIN',  
                
            )
            self.stdout.write(self.style.SUCCESS('Superuser created successfully.'))
        else:
            self.stdout.write(f"Superuser {username} already exists.")