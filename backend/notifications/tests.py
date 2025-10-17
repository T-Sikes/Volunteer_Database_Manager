from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class NotificationTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_get_notifications_initial_empty(self):
        response = self.client.get("/api/notifications/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 0)

    def test_send_notification_success_match(self):
        data = {
            "notificationType": "match",
            "volunteerName": "Alice Martin",
            "eventName": "Community Clean-Up",
            "message": "You have been matched to the Community Clean-Up event!"
        }
        response = self.client.post("/api/notifications/send/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("notification", response.data)
        notification = response.data["notification"]
        self.assertEqual(notification["volunteerName"], "Alice Martin")
        self.assertEqual(notification["eventName"], "Community Clean-Up")

    def test_send_notification_missing_volunteer(self):
        data = {
            "notificationType": "match",
            "eventName": "Community Clean-Up",
            "message": "You have been matched to the Community Clean-Up event!"
        }
        response = self.client.post("/api/notifications/send/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    def test_send_notification_invalid_type(self):
        data = {
            "notificationType": "weird",
            "volunteerName": "Eladio Carrion",
            "message": "Hello"
        }
        response = self.client.post("/api/notifications/send/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    def test_send_notification_nonexistent_volunteer(self):
        data = {
            "notificationType": "match",
            "volunteerName": "Nonexistent Volunteer",
            "eventName": "Community Clean-Up",
            "message": "You have been matched to the Community Clean-Up event!"
        }
        response = self.client.post("/api/notifications/send/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)