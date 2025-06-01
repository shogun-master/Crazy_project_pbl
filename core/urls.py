from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('create-task/', views.create_task, name='create_task'),
    path('update-status/<int:task_id>/', views.update_status, name='update_status'),
    path('logout/', views.logout_view, name='logout'),
    path('tasks/<int:task_id>/comment/', views.add_comment, name='add_comment'),
    path('tasks/<int:task_id>/submit/', views.submit_for_review, name='submit_for_review'),
    path('tasks/submitted/', views.submitted_tasks, name='submitted_tasks'),
    path('verify-task/<int:task_id>/', views.verify_task, name='verify_task'), 
    path('admin/tasks/review/<int:task_id>/', views.review_task, name='review_task'),
    

    



]
