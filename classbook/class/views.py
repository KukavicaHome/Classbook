from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse
from django.db.models import Q
from staff.models import Project, User, Like
from .models import  Comment, Submission
from django.contrib.auth.decorators import login_required
from .utils import is_connected
from mysite.decorators import student_access_only
from . import forms
from django.core.paginator import Paginator
import json
# user: meho, password: kuku

@login_required(login_url="login")
@student_access_only()
def all_projects(request):
    print("U class/projects")
    #projekti iz db za onog ko je logiran
    all_projects = Project.objects.all().order_by("id").reverse()
    paginator = Paginator(all_projects, 10)
    page_number = request.GET.get('page')
    posts_of_the_page = paginator.get_page(page_number)
    # napunimo listu ko_ti_se_svidza
 
    #print('PROJECTS: request.user.is_staff', projects, request.user.is_staff)
    context = {'projects': all_projects, 'posts_of_the_page': posts_of_the_page}
    return render(request, 'class/all_projects.html', context)


@login_required(login_url="login")
@student_access_only()
def single_project(request, pk):
    print("U class/project")
    projectObj = get_object_or_404(Project, pk=pk)
    #projectObj = Project.objects.get(id=pk)
    teacher = User.objects.get(pk=request.user.id)
    # nadzemo like za id, kojeg brisemo
    like = Like.objects.filter(user=teacher, project=projectObj)
    jel_ti_se_svidza = False
    # ako je broj lajkova 1 za ovaj projekt od ovog usera
    if like.count() != 0:
        jel_ti_se_svidza = True
    #likes = projectObj.tags.all()
    context = {'project': projectObj, 
                'jel_ti_se_svidza': jel_ti_se_svidza,
                'is_conected': is_connected(),
                }
    return render(request, 'class/current-project.html', context)

'''“Like” and “Unlike”: Users should be able to click a button or link on any post to toggle
whether or not they “like” that post'''
@login_required(login_url="login")
@student_access_only()
def remove_like(request, pk):
    project = Project.objects.get(id=pk)
    # updejtujemo brok lajkova
    broj_lajkova = project.num_of_likes
    project.num_of_likes = broj_lajkova - 1
    #updejtuje project
    project.save()
    student = User.objects.get(pk=request.user.id)
    # nadzemo like za id, kojeg brisemo
    like = Like.objects.filter(user=student, project=project)
    like.delete()
    return JsonResponse({"message": "sussesiful"})

@login_required(login_url="login")
@student_access_only()
def add_like(request, pk):
    project = Project.objects.get(id=pk)
      # updejtujemo brok lajkova
    broj_lajkova = project.num_of_likes
    project.num_of_likes = broj_lajkova + 1
    project.save()
    student = User.objects.get(pk=request.user.id)
    # kreiramo novi red(objekt)
    newLike = Like(user=student, project=project)
    newLike.save()  # sacuvamo novi like za post i user

    return JsonResponse({"message": "sussesiful"})

# za search polje
@login_required(login_url="login")
@student_access_only()
def project_search_view(request):
    #print(request.GET)
    query = request.GET.get('q')    #<input type="serch" name="q">
     
    if query is not None:
        # trazi kljucne rijeci i za projectName i description
        lookups = Q(projectName__icontains=query) | Q(description__icontains=query)
        qs = Project.objects.filter(lookups)  
        #print(projectObj.projectName)
    
    context = {
         'object_list': qs,
         'query': query
    }
    return render(request,'class/search.html',context=context)

@login_required(login_url="login")
@student_access_only()
def all_Comments_of_Project(request, pk):
    '''All Comments: The “All Comments link in the navigation bar should take
        the user to a page where they can see all posts from all users for this project, with the most recent posts first.'''
    print('all_Comments_of_Project')
    # lista commentara u db za projekt, sortirani od zadnjeg do prvog
    project = Project(pk=pk)
    allComments_of_project = Comment.objects.filter(project=project).all().order_by("id").reverse()
    
    # Paginator  koliko dugu listu hocemo da vidimo na monitoru
    paginator = Paginator(allComments_of_project, 10)
    page_number = request.GET.get('page')
    posts_of_the_page = paginator.get_page(page_number)
    # procitamo imali u session sta
    message = request.session.get('message')
    if message != None:
        context = {"allComments_of_project": allComments_of_project, 'project_id': project.id , 
                    'message': message, 'posts_of_the_page':posts_of_the_page}
    else:
        context = { "allComments_of_project": allComments_of_project, 'project_id': project.id,'posts_of_the_page':posts_of_the_page}
    # izbrisemo sessen
    request.session['message'] = None
    return render(request, "class/all-comments.html", context)

'''When a user clicks “Edit” for one of their own comment, the content of their comment
should be replaced with a textarea where the user can edit the content of their post.'''

@login_required(login_url="login")
@student_access_only()
def edit_Comment(requst, pk):
    print("U edit")
    if requst.method == "POST":
        try:
            data = json.loads(requst.body)
            #print("data", data)
            # dobijemo red za id = post_id iz Post tabele
            edit_comment = Comment.objects.get(id=pk)
            edit_comment.content = data['content'].strip()
            # ako je duzina komentarapreduga
            if len(edit_comment.content) > 200:
                return JsonResponse({"susses": "no"})
            else:
                # sacuvamo promjenu kolone u db
                edit_comment.save()
                return JsonResponse({"susses": "yes"})
        except:
            return JsonResponse({"susses": "no"})
        
@login_required(login_url="login")
@student_access_only()       
def add_Comment(request, pk):
    print("U comment post")
    # ako je POST sacuva post
    if request.method == "POST":
        #print('request.POST["content"]',request.POST["content"])
        #print('Project.objects.get(id = pk)',Project.objects.get(id = pk))
        
        try:
            content = request.POST["content"]
            user = request.user
            project = Project.objects.get(id = pk)
            new_comment = Comment(content=content, user=user, project=project)
            new_comment.save()
            #return JsonResponse({"sussesiful": "yes" })
            return redirect('class:all-project-comments', pk = pk)
             
        except:
           return render(request,'error.html', {'problem': 'The comment was not successfully saved on the server!'})

@login_required(login_url="login")
@student_access_only()
def delete_Comment(request, pk):
    try:
        comment =  get_object_or_404(Comment, id=pk)
        comment.delete()
        return JsonResponse({"success": "yes"})
    except:
        request.session['message'] ='Delete of comment was not successful!'
        return JsonResponse({"success": "no"})

# funkcija za predaju rezultata kviza
@login_required(login_url="login")
@student_access_only()
def submit_Quiz(request, pk):
    if request.method == 'POST':
        try:
            project =  get_object_or_404(Project, id=pk)
        except:
            return JsonResponse({"message": "No such project", "success": "no"})
        if project.quiz_published == False:
            return JsonResponse({"message": "No quiz for project", "success": "no"})
        jsonData = json.loads(request.body)
        score = jsonData.get('score')
        max_score = jsonData.get('max_score')
        submission = Submission(submission_owner=request.user, project=project, points=score, max_points=max_score)
        try:
            submission.save()
        except:
            return JsonResponse({"message": "", "success": "no"})
        #print('score, max_score', score, max_score)
        return JsonResponse({"message": "", "success": "yes"})
    
@login_required(login_url="login")
@student_access_only()  
def get_Subissions(request):
    user = request.user
    all_submissions = Submission.objects.filter(submission_owner=user).all()
    #print('all_submissions', all_submissions)
    context = {'submissions': all_submissions,'name': user}
    return render(request, "class/submissions.html", context)
    