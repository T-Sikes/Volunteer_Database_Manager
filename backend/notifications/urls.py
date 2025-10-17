from django.urls import path
from . import views

urlpatterns = [
    path("", views.get_notifications, name="notifications-list"),
    path("send/", views.send_notification, name="notifications-send"),
]