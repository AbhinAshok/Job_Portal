from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, MeView, PasswordResetRequestView, PasswordResetConfirmView, RecruiterProfileView, CandidateProfileView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', MeView.as_view(), name='user_detail'),
    path('password/reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('profile/recruiter/', RecruiterProfileView.as_view(), name='recruiter-profile'),
    path('profile/candidate/', CandidateProfileView.as_view(), name='candidate-profile'),
]
