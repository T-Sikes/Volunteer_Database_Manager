from django.urls import path
from .views import get_events

# API endpoints

urlpatterns = [
    path("events/", get_events, name="get_events")
]