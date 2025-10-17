from django.urls import path
from .views import get_events, get_volunteers, match_volunteers, get_all_matches, get_notifications, send_notification

urlpatterns = [
    path("", get_events),                  
    path("volunteers/", get_volunteers),   
    path("match/", match_volunteers),      
    path("matches/", get_all_matches),     
    path("notifications/", get_notifications),       
    path("send-notification/", send_notification),  
]