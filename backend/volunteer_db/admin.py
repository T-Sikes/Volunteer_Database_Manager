from django.contrib import admin
from .models import UserCredentials, UserProfile, EventDetails, VolunteerHistory, Notification

admin.site.register(UserCredentials)
admin.site.register(UserProfile)
admin.site.register(EventDetails)
admin.site.register(VolunteerHistory)
admin.site.register(Notification)
