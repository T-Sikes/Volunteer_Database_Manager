from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class UserLoginAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.signup_url = '/user_login/signup/'  # adjust if needed

    def test_signup_valid(self):
        data = {
            "username": "zack@gmail.com",
            "password": "Pass1234!"
        }
        response = self.client.post(self.signup_url, data, format='json')
        self.assertEqual(response.status_code, 201)  # or whatever your view returns

    def test_signup_invalid(self):
        data = {"username": "", "password": ""}
        response = self.client.post(self.signup_url, data, format='json')
        self.assertEqual(response.status_code, 400)

class UserLoginAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Create a user to test login
        self.user = User.objects.create_user(username="zack@gmail.com", password="Pass1234!")
        self.login_url = '/user_login/login/'  # make sure this matches your urls.py

    def test_login_valid(self):
        data = {
            "username": "zack@gmail.com",
            "password": "Pass1234!"
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)

    def test_login_invalid_password(self):
        data = {
            "username": "zack@gmail.com",
            "password": "WrongPass!"
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, 404)

    def test_login_invalid_username(self):
        data = {
            "username": "notexist@gmail.com",
            "password": "Pass1234!"
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, 404)
