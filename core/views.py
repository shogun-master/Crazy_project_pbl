from django.utils import timezone
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import Group
from django.contrib import messages

from .models import Task
from .forms import CommentForm, TaskForm, LoginForm, FinalSubmissionForm


def logout_view(request):
    logout(request)
    return redirect('login')


@login_required
def dashboard_view(request):
    user = request.user
    if user.is_staff:
        tasks = Task.objects.all()
    else:
        tasks = Task.objects.filter(assigned_to=user)

    grouped_tasks = {
        'PENDING': tasks.filter(status='PENDING'),
        'IN_PROGRESS': tasks.filter(status='IN_PROGRESS'),
        'COMPLETED': tasks.filter(status='COMPLETED'),
    }
    return render(request, 'core/dashboard.html', {'grouped_tasks': grouped_tasks, 'now': timezone.now()})


def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(request, username=email, password=password)
            if user:
                login(request, user)
                return redirect('dashboard')
            else:
                form.add_error(None, 'Invalid email or password.')
    else:
        form = LoginForm()
    return render(request, 'core/login.html', {'form': form})


@login_required
def dashboard(request):
    tasks = Task.objects.filter(assigned_to=request.user)
    return render(request, 'core/dashboard.html', {'tasks': tasks})


@staff_member_required
def create_task(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('dashboard')
    else:
        form = TaskForm()
    return render(request, 'core/create_task.html', {'form': form})


@login_required
def update_status(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    if request.method == 'POST':
        new_status = request.POST.get('status')
        task.status = new_status
        task.save()
    return redirect('dashboard')


@login_required
def submit_for_review(request, task_id):
    task = get_object_or_404(Task, id=task_id)

    if request.user != task.assigned_to or task.status != 'COMPLETED':
        return redirect('dashboard')

    if request.method == 'POST':
        form = FinalSubmissionForm(request.POST, instance=task)
        if form.is_valid():
            task = form.save(commit=False)
            task.submitted_for_review = True
            task.save()
            return redirect('dashboard')
    else:
        form = FinalSubmissionForm(instance=task)

    return render(request, 'core/submit_review.html', {'form': form, 'task': task})


@login_required
def submitted_tasks(request):
    if not request.user.is_staff:
        return redirect('dashboard')
        
    tasks = Task.objects.filter(submitted_for_review=True)
    return render(request, 'core/submitted_tasks.html', {'tasks': tasks})


@login_required
def review_task(request, task_id):
    if not request.user.is_staff:
        return redirect('dashboard')

    task = get_object_or_404(Task, id=task_id)

    if request.method == 'POST':
        decision = request.POST.get('decision')
        final_desc = request.POST.get('final_description')

        task.final_description = final_desc

        if decision == 'accept':
            task.review_status = 'VERIFIED'
            task.submitted_for_review = False
            messages.success(request, 'Task verified successfully.')
        elif decision == 'reject':
            task.review_status = 'REJECTED'
            task.submitted_for_review = False
            task.status = 'IN_PROGRESS'
            messages.warning(request, 'Task rejected with feedback.')

        task.save()
        return redirect('submitted_tasks')

    return render(request, 'core/review_task.html', {'task': task})
