from django.contrib import admin
from . models import Project,Like, Question

# Register your models here.
admin.site.register(Project)
admin.site.register(Question)
admin.site.register(Like)
 