from django.urls import path
from .views import (
    get_user_profile, save_user_profile,
    get_volunteer_history, save_volunteer_record,
    get_events, get_current_user,
    get_volunteer_history_from_user_id,
    export_reports_csv, export_reports_pdf
)

#endpoint definitons
urlpatterns = [
    # Current user endpoint (ADD THIS)
    path('current/', get_current_user, name='get_current_user'),

    # User profile
    path('profile/<str:username>/', get_user_profile),
    path('profile/<str:username>/save/', save_user_profile),

    # Volunteer history
    path('history/<str:username>/', get_volunteer_history),
    path('history/<str:username>/save/', save_volunteer_record),
    path('history/user/<int:user_id>/', get_volunteer_history_from_user_id),

    # Events
    path('events/', get_events),

    # export
    path('export/reports-csv/', export_reports_csv),
    path('export/reports-pdf/', export_reports_pdf),
]

