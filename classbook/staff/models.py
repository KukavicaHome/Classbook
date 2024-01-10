from embed_video.fields import EmbedVideoField
from django.db import models
from mysite.models import User
 

 
 
# Create your models here.
class Project(models.Model):    
    projectName = models.CharField(max_length=100) 
    description = models.TextField(null=True, blank=True, 
                                   max_length=500)
    # pointing to the User model : to=settings.AUTH_USER_MODEL
    owner = models.ForeignKey(User, on_delete=models.CASCADE, 
                              related_name="author")
    created  = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    num_of_likes = models.IntegerField(default = 0)
    num_of_qustions = models.IntegerField(default = 0)
    # polje koje mora biti kopirano sa Youtub kanala
    video = EmbedVideoField(null=True)  # same like models.URLField()
    pdf = models.FileField(null=True, blank=True)
    project_published = models.BooleanField(default=False)
    id = models.IntegerField(unique=True,
                          primary_key=True,editable=False)
    quiz_published =  models.BooleanField(default=False)

 
    # pointing to the User model:
    # https://docs.djangoproject.com/en/3.2/topics/auth/customizing/#referencing-the-user-model

    #koristimo property decorator za pdfURL()
    # imamo pristup do ove metode kao do property
    # ako nema defoult   vrati prazan string
    @property
    def pdfURL(self):
        try:
            img  = self.pdf.url
        except:
             img = ''
        return img
        
    def __str__(self):
        return f"{self.projectName} has: num_of_likes {self.num_of_likes}, num_of_qustions: {self.num_of_qustions}, project_published:{self.project_published}, quiz_published: {self.quiz_published}"
    
class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_like")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="project_like")

    def __str__(self):
        return f"{self.user} liked {self.project}"

class Question(models.Model):
    #vrati broj kao string 
    question_quiz = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="quiz_question")    
    id = models.IntegerField(unique=True,primary_key=True,editable=False)
    question = models.CharField(max_length=150)
    answer = models.CharField(max_length=150)
    option_1 = models.CharField(max_length=150)
    option_2 = models.CharField(max_length=150)
    option_3 = models.CharField(max_length=150)


    def __str__(self):
        return f"id: {self.id}\n, projectName: {self.question_quiz.projectName}\n, question: {self.question}\n, answer: {self.answer}\n, option_1: {self.option_1}\n, option_2: {self.option_2}\n, option_3: {self.option_3}"
