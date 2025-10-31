from django.urls import path
from .views import get_events, get_volunteers, match_volunteers, get_all_matches, get_notifications, send_notification, create_event, update_event, delete_match

urlpatterns = [
    path("", get_events, name="get_events"),
    path("create/", create_event, name="create_event"),    
    path("<int:pk>/", update_event, name="update_event"),              
    path("volunteers/", get_volunteers),   
    path("match/", match_volunteers),      
    path("matches/", get_all_matches),     
    path("match/<str:volunteer_name>/", delete_match, name="delete_match"),
    path("notifications/", get_notifications),       
    path("send-notification/", send_notification),  
]