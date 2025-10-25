from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import MaxLengthValidator, MinLengthValidator
from django.core.exceptions import ValidationError
from django.utils import timezone

#these classes represent names of tables that are translated by django to SQL


# =========================
#  Custom Validators
# =========================

def validate_zipcode(value):
    if not value.isdigit() or len(value) != 5:
        raise ValidationError("Zipcode must be exactly 5 digits.")

def validate_urgency(value):
    valid_levels = ['Low', 'Medium', 'High', 'Critical']
    if value not in valid_levels:
        raise ValidationError(f"Urgency must be one of {valid_levels}.")

def validate_future_date(value):
    if value < timezone.now().date():
        raise ValidationError("Event date cannot be in the past.")



# =========================
#  USER MANAGER
# =========================

class UserCredentialsManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError("Users must have a username.")
        user = self.model(username=username, **extra_fields)
        user.set_password(password)  # hashes password automatically
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(username, password, **extra_fields)


# =========================
#  USER CREDENTIALS TABLE
# =========================

class UserCredentials(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = UserCredentialsManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username
    
    # note AbstractBaseUser is built in django paramater that creates a hashed password field 
    # this hashed password should not be directly accesed. 
    # Use user.set_password('raw_password') to set it
    # Use user.check_password('raw_password') to verify it
    
    
# =========================
#  STATES TABLE
# =========================

class States(models.Model):
    state_code = models.CharField(max_length=2, unique=True)
    state_name = models.CharField(max_length=100)

    def __str__(self):
        return self.state_name
    

# =========================
#  USER PROFILE TABLE
# =========================


class UserProfile(models.Model):
    user = models.OneToOneField(UserCredentials, on_delete=models.CASCADE, related_name="profile")
    full_name = models.CharField(max_length=200)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.ForeignKey(States, on_delete=models.SET_NULL, null=True)
    zipcode = models.CharField(max_length=10, validators=[validate_zipcode])
    skills = models.TextField(blank=True)
    preferences = models.TextField(blank=True)
    availability = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.full_name} ({self.user.username})"
    
# =========================
#  EVENT DETAILS TABLE
# =========================
class EventDetails(models.Model):
    event_name = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    required_skills = models.TextField()
    urgency = models.CharField(max_length=50, validators=[validate_urgency])
    event_date = models.DateField(validators=[validate_future_date])

    def __str__(self):
        return self.event_name
    

# =========================
#  VOLUNTEER HISTORY TABLE
# =========================
class VolunteerHistory(models.Model):
    user = models.ForeignKey(UserCredentials, on_delete=models.CASCADE)
    event = models.ForeignKey(EventDetails, on_delete=models.CASCADE)
    participation_date = models.DateField(default=timezone.now)
    hours_served = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.event.event_name}"
