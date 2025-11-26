from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from user_login.serializers import UserSerializer
from volunteer_db.models import UserCredentials  
from rest_framework.test import APITestCase
from rest_framework import status

User = get_user_model()

class UserSignupAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.signup_url = '/user_login/signup/'

    def test_signup_valid(self):
        data = {
            "email": "zack@gmail.com",
            "password": "Pass1234!"
        }
        response = self.client.post(self.signup_url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)

    def test_signup_valid_with_username(self):
        data = {
            "email": "withusername@gmail.com",
            "username": "customuser",
            "password": "Pass1234!"
        }
        response = self.client.post(self.signup_url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'customuser')

    def test_signup_invalid(self):
        data = {"email": "", "password": ""}
        response = self.client.post(self.signup_url, data, format='json')
        self.assertEqual(response.status_code, 400)

class UserLoginAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Create a user to test login
        self.user = User.objects.create_user(email="zack@gmail.com", password="Pass1234!")
        self.login_url = '/user_login/login/' 

    def test_login_valid(self):
        data = {
            "email": "zack@gmail.com",
            "password": "Pass1234!"
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)

    def test_login_invalid_password(self):
        data = {
            "email": "zack@gmail.com",
            "password": "WrongPass!"
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, 401)

    def test_login_invalid_email(self):
        data = {
            "email": "notexist@gmail.com",
            "password": "Pass1234!"
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, 404)

    def test_login_missing_email(self):
        data = {
            "password": "Pass1234!"
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('detail', response.data)

    def test_login_missing_password(self):
        data = {
            "email": "zack@gmail.com"
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('detail', response.data)

    def test_login_missing_both(self):
        data = {}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('detail', response.data)


class UserSerializerTests(TestCase):

    def test_serializer_creates_user_with_username(self):
        data = {
            "email": "test@example.com",
            "username": "testuser",
            "password": "Pass1234!"
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        user = serializer.save()

        self.assertEqual(user.email, data["email"])
        self.assertEqual(user.username, data["username"])
        self.assertTrue(user.check_password(data["password"]))

    def test_serializer_creates_user_without_username(self):
        data = {
            "email": "nousername@example.com",
            "password": "Pass1234!"
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        user = serializer.save()

        # Default username to email
        self.assertEqual(user.username, data["email"])
        self.assertTrue(user.check_password(data["password"]))

    def test_serializer_invalid_missing_password(self):
        data = {
            "email": "fail@example.com",
            "username": "failuser"
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("password", serializer.errors)


class TestTokenAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Create a user and token
        self.user = User.objects.create_user(email="tokentest@gmail.com", password="Pass1234!")
        self.token = Token.objects.create(user=self.user)
        self.test_token_url = '/user_login/test_token/'

    def test_token_authenticated(self):
        # Test with valid token
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.get(self.test_token_url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("Token works for", response.data)

    def test_token_unauthenticated(self):
        # Test without token
        response = self.client.get(self.test_token_url)
        self.assertEqual(response.status_code, 403)


class UserLogoutAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Create a user and token
        self.user = User.objects.create_user(email="logouttest@gmail.com", password="Pass1234!")
        self.token = Token.objects.create(user=self.user)
        self.logout_url = '/user_login/logout/'

    def test_logout_authenticated(self):
        # Test logout with valid token
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('detail', response.data)
        self.assertEqual(response.data['detail'], 'Successfully logged out')

        # Verify token is deleted
        self.assertFalse(Token.objects.filter(user=self.user).exists())

    def test_logout_unauthenticated(self):
        # Test logout without token
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, 403)

    def test_logout_invalid_token(self):
        # Test logout with invalid token
        self.client.credentials(HTTP_AUTHORIZATION='Token invalidtoken123')
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, 403)

