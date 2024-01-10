
from django.urls import path
from . import views

app_name = "staff"
urlpatterns = [
    path('projects/', views.projects, name='projects'),
    path('create-project/', views.createProject, name='create-project'),
    path('get-project/<int:pk>/', views.getProject, name='get-project'),
    path('delete-project/', views.delete_Project, name='delete-project'),
    path('publish-unpublish-project/<int:pk>/', views.publish_unpublish_Project, name='publish-unpublish-project'),
    path('get-projectNames/', views.get_projectNames, name='get-projectNames'),
    path('update-project-field/<int:pk>/', views.update_ProjectField, name='update-project-field'),
    path('update-pdf-file/<int:pk>/', views.update_pdf_file, name='update-pdf-file'),
    path('delete-file/', views.delete_File, name='delete-file'),
    path('get-create-quiz-question/<int:pk>/', views.get_create_Quiz_Question, name='get-create-quiz-question'),
    path('create-add-question/<int:pk>/', views.create_add_Question, name='create-add-question'),
    path('edit-question/<int:pk1>/<int:pk2>/<int:pk3>/', views.edit_Question, name='edit-question'),
    path('delete-question/<int:pk1>/<int:pk2>/', views.delete_Question, name='delete-question'),
    path('publish-unpublish-quiz/<int:pk>/', views.publish_unpublish_Quiz, name='publish-unpublish-quiz'),
]