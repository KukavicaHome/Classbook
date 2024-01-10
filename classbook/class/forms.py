from django import forms

class NewCommentForm(forms.Form):
     content = forms.CharField(label="New Post", max_length=140, widget=forms.Textarea(attrs={"rows":"1"}))