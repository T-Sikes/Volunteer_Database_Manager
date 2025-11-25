from django.db import models
from volunteer_db.models import UserProfile

# Create your models here.
class ExampleModel(models.Model):
    name = models.CharField(max_length=100)

class Notification(models.Model):
    recipient = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification to {self.recipient.full_name}: {self.message[:20]}"