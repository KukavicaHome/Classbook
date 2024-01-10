from django.db import models
from mysite.models import User
from staff.models import Project
# Create your models here.

    
class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_comments")
    content = models.TextField(blank=False, max_length=200)
    date_created = models.DateTimeField(auto_now_add=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="project_Comments")
    

    def __str__(self):
         return f"{self.user} ima komentar : {self.content} za project {self.project}"
    
class Submission(models.Model):
    submission_owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_submission")
    date_created = models.DateTimeField(auto_now_add=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="project_Submission")
    points = models.IntegerField(default = 0)
    max_points = models.IntegerField(default = 0)

    def __str__(self):
        return f"{self.submission_owner} je predao kviz za project {self.project}, kojeg je kreirAO {self.project.owner} i osvoio {self.points} od mogucih {self.max_points}"

     