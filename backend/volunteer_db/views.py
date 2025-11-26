from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer
from volunteer_db.models import UserProfile

# Return notifications for a specific user
class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response({"error": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)

        notifications = Notification.objects.filter(recipient=user_profile).order_by("-timestamp")
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)


# Send a notification to a user
class SendNotificationView(APIView):
    def post(self, request):
        if isinstance(request.data, list):
            return Response(
                {"error": "JSON body must be an object, not a list."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user_id = request.data.get("user_id")
        message = request.data.get("message")

        if not user_id or not message:
            return Response({"error": "user_id and message are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = UserProfile.objects.get(id=user_id)
        except UserProfile.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        Notification.objects.create(recipient=user, message=message)

        return Response({"success": True, "message": "Notification created"}, status=status.HTTP_201_CREATED)