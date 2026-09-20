def notify_status_change(application, new_status, recruiter):
    """
    Utility function to generate a notification when an application status changes.
    """
    from notifications.models import Notification
    
    status_display = application.get_status_display()
    title = f"Application Status Updated: {application.job.title}"
    message = f"Your application for '{application.job.title}' has been updated to '{status_display}'."

    Notification.objects.create(
        recipient=application.candidate,
        sender=recruiter,
        title=title,
        message=message,
        notification_type='application_status'
    )
