from django.urls import path
from .views import (
    get_user_profile, save_user_profile,
    get_volunteer_history, save_volunteer_record,
    get_events
)

#endpoint definitons
urlpatterns = [
    # User profile
    path('profile/<str:username>/', get_user_profile),
    path('profile/<str:username>/save/', save_user_profile),

    # Volunteer history
    path('history/<str:username>/', get_volunteer_history),
    path('history/<str:username>/save/', save_volunteer_record),

    # Events
    path('events/', get_events),
]