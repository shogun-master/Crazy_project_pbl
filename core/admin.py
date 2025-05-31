from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Task, Comment

# Register custom User model
admin.site.register(User, UserAdmin)

# Custom admin for Task
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    fields = ['title', 'description', 'assigned_to', 'status', 'deadline']
    list_display = ['title', 'assigned_to', 'status', 'deadline']

# Register Comment model
admin.site.register(Comment)
