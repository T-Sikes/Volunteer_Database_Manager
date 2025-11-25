from django.urls import path
from .views import NotificationListView, SendNotificationView

urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notifications-list'),
    path('notifications/send/', SendNotificationView.as_view(), name='send-notification'),
]
