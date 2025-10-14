from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

# Create your tests here.
class UserProfileAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.valid_data = {
            "full_name": "Jane Doe",
            "address1": "456 Elm St",
            "address2": "Apt 101",
            "city": "Springfield",
            "state": "IL",
            "zip_code": "62704",
            "skills": ["Python", "JavaScript"],
            "preferences": "No preferences",
            "availability": ["2025-10-20", "2025-10-21"]
        }
        self.invalid_data = {
            "full_name": "",  # missing required
            "address1": "",
            "city": "",
            "state": "",
            "zip_code": "123",  # too short
            "skills": [],
            "availability": []
        }

    def test_get_profile(self):
        response = self.client.get("/user/profile/")
        self.assertEqual(response.status_code, 200)
        # check all expected keys exist
        for key in ["full_name", "address1", "address2", "city", "state", "zip_code", "skills", "preferences", "availability"]:
            self.assertIn(key, response.data)

    def test_save_profile_valid(self):
        response = self.client.post("/user/profile/save", self.valid_data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "saved")
        # check all fields in response
        for key, value in self.valid_data.items():
            self.assertEqual(response.data["data"][key], value)

        # Verify GET reflects updated data
        get_resp = self.client.get("/user/profile/")
        for key, value in self.valid_data.items():
            self.assertEqual(get_resp.data[key], value)

    def test_save_profile_invalid(self):
        response = self.client.post("/user/profile/save", self.invalid_data, format="json")
        self.assertEqual(response.status_code, 400)
        # make sure errors exist for required fields
        for key in ["full_name", "address1", "city", "state", "zip_code", "skills", "availability"]:
            self.assertIn(key, response.data)