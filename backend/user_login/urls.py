from django.urls import path

from . import views

urlpatterns = [
    path('login/', views.login),
    path('signup/', views.signup),
    path('logout/', views.logout),
    path('test_token/', views.test_token),
]
