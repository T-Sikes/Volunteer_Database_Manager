from django.urls import path
from .views import get_user_profile, save_user_profile, get_volunteer_history, save_volunteer_record, get_events

#endpoint definitons
urlpatterns = [
    #user profile endpoints
    path('profile/', get_user_profile),
    path('profile/save/', save_user_profile),

    #volunteer history endpoints
    path('history/', get_volunteer_history),
    path('history/save/', save_volunteer_record),

    #temporary dynamic events endpoint
     path('events/', get_events),
]
