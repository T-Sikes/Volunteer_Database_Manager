from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.
def user_list(request):
    return HttpResponse("User List - To be implemented")
def user_detail(request, user_id):
    return HttpResponse(f"User Detail for user {user_id} - To be implemented")
