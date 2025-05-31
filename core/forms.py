from .models import Comment
from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from .models import Task
from .models import Task
from django.contrib.auth import get_user_model


class LoginForm(forms.Form):
    email = forms.CharField(label="Email")
    password = forms.CharField(widget=forms.PasswordInput)

class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = '__all__'
class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']

class FinalSubmissionForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['final_description']
        widgets = {
            'final_description': forms.Textarea(attrs={'class': 'form-control', 'rows': 4, 'placeholder': 'Enter final work summary...'}),
        }
