from django.forms import ModelForm
from.models import Project, Question
from django import forms 
from django.core.exceptions import ValidationError 
 

class ProjectForm(ModelForm):
    template_name = "staff/form/form-template.html"
    class Meta:
        model = Project
        fields = '__all__'  # ukljuci sva polja
        # iskljuci 2 polja iz vida
        exclude = ['owner', 'num_of_likes', 'num_of_qustions', 'quiz_published']

 
class QuestionForm(ModelForm):
    template_name = "staff/form/question-form.html"

    class Meta:
        model = Question
        fields = '__all__'  # ukljuci sva polja
        # iskljuci 2 polja iz vida
        exclude = ['question_quiz']

 
    



 
    


 