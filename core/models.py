from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model

# Custom User Model
class User(AbstractUser):
    # Extend if needed
    pass

class Task(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
    ]
    REVIEW_STATUS_CHOICES = [
        ('NONE', 'None'),
        ('VERIFIED', 'Verified'),
        ('REJECTED', 'Rejected'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(null=True, blank=True)

    # Submission and Review
    submitted_for_review = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    review_status = models.CharField(max_length=20, choices=REVIEW_STATUS_CHOICES, default='NONE')
    final_description = models.TextField(blank=True, null=True)
    comment = models.TextField(blank=True, null=True)
    changes_description = models.TextField(blank=True, null=True) 
    def __str__(self):
        return self.title

class Comment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author.username} on {self.task.title}"
