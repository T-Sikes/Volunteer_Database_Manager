from django.db import models

# Create your models here.
class ExampleModel(models.Model):
    name = models.CharField(max_length=100)