from django.urls import path, include
from .views import get_events, get_volunteers, match_volunteers, get_all_matches, get_notifications, send_notification, create_event, update_or_delete_event, delete_match, assign_volunteer, get_user_events, get_volunteers_for_event

urlpatterns = [
    path("", get_events, name="get_events"),
    path("create/", create_event, name="create_event"),    
    path("<int:pk>/", update_or_delete_event, name="update_or_delete_event"),              
    path("volunteers/", get_volunteers),   
    path("match/", match_volunteers),      
    path("matches/", get_all_matches),     
    path("match/<str:volunteer_name>/", delete_match, name="delete_match"),
    path("notifications/", get_notifications),       
    path("send-notification/", send_notification),  
    path("assign/", assign_volunteer, name="assign_volunteer"),
    path("assigned-events/", get_user_events, name="get_user_events" ),
    path("volunteers/<int:pk>", get_volunteers_for_event, name="get_volunteers_for_event" ),
    path("api-auth/", include("rest_framework.urls")) # For being able to log in and log out when testing API calls using the Django Rest Framework UI
]