from django.urls import path

from . import views

app_name = "mysite"
urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register-student", views.register_student, name="register-student"),
    path("register-teacher", views.register_teacher, name="register-teacher"),
    path("register-student-teacher", views.register_student_teacher, name="register-student-teacher"),
    path('get-users', views.get_users_Names, name='get-users'),
    path('play-quiz/<int:pk>/', views.play_Quiz, name='play-quiz'),
    path('get-quiz/<int:pk>/', views.get_Quiz, name='get-quiz'),
     
]