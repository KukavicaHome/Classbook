from django import forms
 
 
from django.core.exceptions import ValidationError 
 

class UserForm(forms.Form):
    username = forms.CharField(max_length=100)
    email = forms.CharField(max_length=100)
    password = forms.CharField(max_length=100)
    confirmation = forms.CharField(max_length=100)
    status = forms.CharField(max_length=7)

   

   