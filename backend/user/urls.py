from django.urls import path
from .views import get_user_profile, save_user_profile

#endpoint definitons
urlpatterns = [
    path('profile/', get_user_profile),
    path('profile/save', save_user_profile),
]
