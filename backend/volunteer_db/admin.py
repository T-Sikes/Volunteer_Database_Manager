from django.contrib import admin
from .models import UserCredentials, States, UserProfile, EventDetails, VolunteerHistory

admin.site.register(UserCredentials)
admin.site.register(States)
admin.site.register(UserProfile)
admin.site.register(EventDetails)
admin.site.register(VolunteerHistory)
