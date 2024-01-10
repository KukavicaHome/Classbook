from django.urls import path
from . import views

app_name = "class"
 
urlpatterns = [
    path('projects/', views.all_projects, name='all-projects'),
    path('project_search_view/', views.project_search_view, name='project_search_view'),
    path('project/<int:pk>', views.single_project, name='current-project'),
    path("remove_like/<int:pk>", views.remove_like, name="remove-like"),
    path("add_like/<int:pk>", views.add_like, name="like-project"),
    path("all-project-comments/<int:pk>", views.all_Comments_of_Project, name="all-project-comments"),
    path("add-comment/<int:pk>", views.add_Comment, name="add-comment"),
    path("edit-comment/<int:pk>", views.edit_Comment, name="edit-comment"),
    path("delete-comment/<int:pk>", views.delete_Comment, name="delete-comment"),
    path('submissions/', views.get_Subissions, name='submissions'),
    path('submit-quiz/<int:pk>/', views.submit_Quiz, name='submit-quiz'),
]