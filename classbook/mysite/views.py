from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from .models import User
from .decorators import anonymous_user_only, anonymous_user
from django.contrib.auth.decorators import login_required
from staff.models import Project, Question
from . forms import UserForm
from .utils import validate_data

@anonymous_user()
def index(request, *args, **kwargs):
    return render(request, "mysite/index.html")

#za logiranje
@anonymous_user_only()
def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST.get("username")
        password = request.POST.get("password")
        #authentication
        user = authenticate(request, username=username, password=password)
        # Check if authentication successful
        if user is not None:
            login(request, user)
            print("user, user.is_staff:", user, user.is_teacher)
            if user.is_teacher == True:
                return redirect('staff:projects')   # ako je user teacher
            else:
                return redirect('class:all-projects')    # ako je user student
        else:    # ako je user nije dobro unio podatke za login
            return render(request,"mysite/login.html",{"message": "Invalid username and/or password.", "success": "no"})
    else:# GET
        return render(request, "mysite/login.html")

@login_required(login_url="login")
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("mysite:index"))

 
@anonymous_user_only()
def register_student_teacher(request):
    print('U register_student_teacher')
    if request.method == 'POST':
        userform = UserForm(request.POST)
        context = {}
        data = {}
        if userform.is_valid():
            for key, value in request.POST.items():
                # Remove Leading and Trailing Whitespace from Strings sa strip()  methodom
                data[key] = value.strip()
            err_message = validate_data(data)   # evaluira data
            
            if err_message != '':
                print('err_message',err_message)
                 # zdruzimo errors i data u context
                context = data
                context['message'] = err_message
                return render(request, "mysite/register.html", context)
            # mozemo sacuvati
            if data["status"] == 'student':
                user = User.objects.create_user(
                            username = data['username'],
                            is_student = True,
                            email=data['email'],
                            password=data['password']
                        )
                user.save()
                login(request, user)
                #rdiarect na student
                return redirect('class:all-projects')# ide na funkciju getProject()
            else:
                user = User.objects.create_user(
                            username = data['username'],
                            is_teacher = True,
                            email=data['email'],
                            password=data['password']
                        )
                user.save()
                login(request, user)
                return redirect('staff:projects')# ide na funkciju getProject()
    return render(request, "mysite/register.html")

@anonymous_user_only()
def register_student(request):
    context = {"status": "student"}
    return render(request, "mysite/register.html", context)

@anonymous_user_only()
def register_teacher(request):
    context = {"status": "teacher"}
    return render(request, "mysite/register.html", context)
    
@anonymous_user_only()
def get_users_Names(request):
    try:
        all_users_obj = User.objects.all().order_by("id").reverse()
        all_users = []
        for user in all_users_obj:
            #print('username',user.username)
            all_users.append(user.username)
        return JsonResponse({"all_users": all_users})
    except:
        return JsonResponse({"success": "no"})


@login_required(login_url="login")
def play_Quiz(request, pk):
    user = request.user
    try:
        project =  get_object_or_404(Project, id=pk)
    except:
        return render(request,'error.html', {'problem': 'Such a project does not exist.!'})
    if project.quiz_published == False and user.is_student == True:
        problem = 'There is no published quiz for ' + project.projectName + ' project..!'
        return render(request,'error.html', {'problem': problem})
    context = {'is_student': user.is_student}
    return render(request,'mysite/quiz/quiz.html', context)


@login_required(login_url="login")
def get_Quiz(request, pk):
    user = request.user
    try:
        project =  get_object_or_404(Project, id=pk)
    except:
        return render(request,'error.html', {'problem': 'Such a project does not exist.!'})
    # teacher moze samo igrati kviz ako kviz nije publiciran i postoji bar 1 pitanje
    if project.quiz_published == False and user.is_student == True :
        problem = 'There is no published quiz for ' + project.projectName + ' project..!'
        return render(request,'error.html', {'problem': problem})
    quiz = Question.objects.filter(question_quiz = project)
    # list to store pitanja
    quiz_dict = []  
    for q in quiz:
        dict = {}   # prazan dictionary
        opt_list = []   # option list za svako pitannje
        # napunimo dictionery sa key-value
        dict["question"] = q.question
        dict["answer"] = q.answer   # row[1]
        #len_row = len(q)   # duzina liste row
        # napunimo option list
        opt_list.append(q.option_1)
        opt_list.append(q.option_2)
        opt_list.append(q.option_3)
        dict["opt"] = opt_list
        # dodamo u quiz_dict array dict
        quiz_dict.append(dict)
        #print('dict', dict)
    return JsonResponse({'list_dict': quiz_dict})
     
 
         