from django.shortcuts import render, redirect, get_object_or_404
from .models import Project, Question
from .forms import ProjectForm, QuestionForm
from django.db import IntegrityError
from .utils import is_connected, evaluate_project, get_all_project_names
from django.contrib.auth.decorators import login_required
from mysite.decorators import teacher_access_only
from django.http import JsonResponse
from django.core.files.storage import FileSystemStorage
import json 
from django.core.paginator import Paginator
 
@login_required(login_url="login")
@teacher_access_only()
def projects(request, *args, **kwargs):
    user = request.user
    try:
        print("user", user)
        '''projekti iz db za onog ko je logiran'''
        projects = Project.objects.filter(owner=user)
        #return render(request, 'staff/projects.html', context) 
        message = request.session.get('message')
        if message != None:
            context = {'projects': projects, 
                    'message': message}
        else:
            context = {'projects': projects}
 
        request.session['message'] = None
        return render(request, 'staff/projects.html', context)
    except :
        return render(request,'error.html', {'problem': 'The server is unable to read the data!'})

# kreira object koji dobije preko forme 
@login_required(login_url="login")
@teacher_access_only()
def createProject(request):
    if request.method == 'POST':
        #evaluira request paket u utils.py
        errors, context = evaluate_project(request)
        # sa request.FILES kazemo da ce doci i neki fajlovi(images, pdf, ..) sa POST
        form = ProjectForm(request.POST, request.FILES)
        # dodamo u context i jos jedan clan
        context['project_form'] = form
        
        try:
            #form valid i u errors sve value = False
            if form.is_valid() and not any(errors.values()): 
                form_data = form.cleaned_data
                print('project_published, project_published', form_data.get('project_published'), request.POST.get('project_published'))
                obj = form.save(commit=False)
                obj.owner = request.user
                obj.save()
                all_objects = Project.objects.all().order_by("id").reverse()
                pk = all_objects[0].id
                project =  get_object_or_404(Project, pk=pk)
                # updejtujemo project_published
                if  request.POST.get('project_published') == 'on':
                    project.project_published = True
                    project.save()
                return redirect('staff:get-project', pk)# ide na funkciju getProject()
            return render(request, 'staff/create-project.html', context)
        except :
            request.session['message'] ='You have not created a project!'
            return render(request, 'staff/create-project.html', context)
    return render(request, 'staff/create-project.html' )

# vrati projekt i kreira Quiz prvi put kad se projekt lodira
@login_required(login_url="login")
@teacher_access_only()
def getProject(request, pk):
    print('U get-project')
    # kojeg zelimo update procitamo iz db
    project =  get_object_or_404(Project, pk=pk)
    context = {'project': project}
 
    request.session['message'] = None
    return render(request, 'staff/single-project.html', context)

# brise project
@login_required(login_url="login")
@teacher_access_only()
def delete_Project(request):
    if request.method == 'POST':
        jsonData = json.loads(request.body)
        print('u delete_Project, jsonData', jsonData)
        # Attempt to sign user in
        pk = int(jsonData.get("pk"))
        project =  get_object_or_404(Project, pk=pk)
        try:
            # izbrise pdf fajl ako postoji
            if project.pdf :
                file_to_delite = project.pdf
                fs = FileSystemStorage()
                file_path = fs.path(file_to_delite.name)
                fs.delete(file_path)
                project.pdf = ''
                project.save()
            #izbrise project
        
            project =  get_object_or_404(Project, pk=pk)
            project.delete()
           
            return JsonResponse({"success": "yes"})
        except:
            request.session['message'] ='Delete of project was not successful!'
            return JsonResponse({"success": "no"})
    else:
        return render(request,'error.html', {'problem': 'You are not allowed to visit this page!'})


@login_required(login_url="login")
@teacher_access_only()
def publish_unpublish_Project(request, pk):
    if request.method == 'POST':
        try:
            user = request.user
            # kojeg zelimo update procitamo iz db
            project =  get_object_or_404(Project, pk=pk)
            print("in publishProject, a project.published", project.project_published)
            if project.project_published is None or project.project_published is False:
                project.project_published = True    # published
                project.save()
                print("Project published :user, user.isteacher:", user, user.is_teacher)
                return JsonResponse({"success": "published"})
            elif project.project_published is True:
                project.project_published = False  # unpublished
                project.save()
                print("Project published :user, user.is_teacher:", user, user.is_teacher)
                return JsonResponse({"success": "unpublished"})
            return JsonResponse({"success": "no"})
        except:
            return render(request,'error.html', {'problem': 'The server is unable to read the data!'})
    else:
        return render(request,'error.html', {'problem': 'You are not allowed to visit this page!'})
    
 
@login_required(login_url="login")
@teacher_access_only()
def get_projectNames(request):
    if request.method == 'POST':
        
        jsonData = json.loads(request.body)
        print('u evaluate_projectName, jsonData', jsonData)
        # Attempt to sign user in
        pk = jsonData.get("pk")
         #kreira se project
        if pk == 0:
            project_names = get_all_project_names()
             #edituje se project
        else:
            project_names = get_all_project_names(pk)
            #print('get_projectNames, project_names:',project_names)
        return JsonResponse({"project_names": project_names})
    else:
        return render(request,'error.html', {'problem': 'You are not allowed to visit this page!'})
    

# change_pdf
@login_required(login_url="login")
@teacher_access_only()
def update_pdf_file(request, pk):
    print('pk', pk)
    # kojeg zelimo update procitamo iz db
    project =  get_object_or_404(Project, pk=pk)
    if request.method == 'POST':
        # jel mozda bez fajla request
        try:
            uploaded_file = request.FILES['pdf']
        except:
            print('update_pdf_file-prazan paket')
            context = {'project_pdf': project.pdf, 'message': 'You must choose a pdf file!!'}
            return render(request,'staff/update-pdf-file.html', context)
        print('update_pdf_file, uploaded_file', uploaded_file)
        # ako vec postoji pdf za projekt, izbrisemo postojeci sa servera
        if project.pdf :
            file_to_delite = project.pdf
            fs = FileSystemStorage()
            file_path = fs.path(file_to_delite.name)
            fs.delete(file_path)
            print('file delited')
            # updejtujemo project
            project.pdf = uploaded_file
            project.save()
        else:   # ne postoji pdf file za project
            project.pdf = uploaded_file
            project.save()
        return redirect('staff:get-project',pk)
    else:
        context = {'project_pdf': project.pdf}
        return render(request,'staff/update-pdf-file.html', context)


@login_required(login_url="login")
@teacher_access_only()
def delete_File(request):
    if request.method == 'POST':
        jsonData = json.loads(request.body)
        print('u delete_Project, jsonData', jsonData)
        # pk mora biti int
        pk = int(jsonData.get("pk"))
        try:
            project =  get_object_or_404(Project, pk=pk)
            file_to_delite = project.pdf
            fs = FileSystemStorage()
            file_path = fs.path(file_to_delite.name)
            fs.delete(file_path)
            print('file delited')
            # updejtujemo project
            project.pdf = ''
            project.save()
            request.session['message'] ='Delete of pdf file was successful!'
            return JsonResponse({"success": "yes"})
        except:
            request.session['message'] ='Delete of pdf file was successful!'
            return JsonResponse({"success": "no"})
    else:
        return render(request,'error.html', {'problem': 'You are not allowed to visit this page!'})
    
@login_required(login_url="login")
@teacher_access_only()
def update_ProjectField(request, pk):
    print('U update_ProjectField,request:', request)
    project =  get_object_or_404(Project, pk=pk)
    if request.method == 'POST':
        try:
            jsonData = json.loads(request.body) 
            print('U update_ProjectField, jsonData', jsonData)
            key_list = list(jsonData.keys())
            # ime za field, nprprojectName
            field_name = key_list[0]
            field_value = jsonData.get(key_list[0])
            print('key_list',key_list, key_list[0],jsonData.get(key_list[0]))
            # PROMJENIMO VRIJEDNOST U DB ZA VALUE
            if field_name == 'projectName':
                project.projectName = field_value
            elif field_name == 'description':
                project.description = field_value
            elif field_name == 'video':
                project.video = field_value
            project.save()
        except:
            return JsonResponse({"success": 'no'})
        return JsonResponse({"success": 'yes'})
    else:
        return render(request,'error.html', {'problem': 'You are not allowed to visit this page!'})

# kreira kviz ako nepostoji i prikaze sva pitanja kviza  
@login_required(login_url="login")
@teacher_access_only()
def get_create_Quiz_Question(request, pk):
    project =  get_object_or_404(Project, pk=pk)
    print('project.num_of_qustions', project.num_of_qustions)
    # procita Questions i vrati listu ako postoji object Question za project
    project_quiz = Question.objects.filter(question_quiz=project).order_by('id').all()
    context = {'project_quiz': project_quiz, 'project_id': project.id, 'quiz_nmb': project.num_of_qustions + 1, 'projectName': project.projectName}
    message = request.session['message'] 
    
    quiz_publish_condition = request.session.get('quiz_publish_condition')
    context['quiz_publish_condition'] = quiz_publish_condition
    if message != None:
        context['message'] = message
        request.session['message'] = None

    # Paginator  koliko dugu listu hocemo da vidimo na monitoru
    paginator = Paginator(project_quiz, 5)
    page_number = request.GET.get('page')
    posts_of_the_page = paginator.get_page(page_number)
    context['posts_of_the_page'] = posts_of_the_page
    context['quiz_published'] = project.quiz_published
    context['project'] = project
    return render(request,'staff/create-quiz-question.html', context)
     
# edituje ili dobije i editujee Question  , pk1 je id projekta tj quiza a pk2 id question-a
@login_required(login_url="login")
@teacher_access_only()   
def create_add_Question(request, pk):
    project =  get_object_or_404(Project, id=pk)
    print('project',project)
    if request.method == 'POST':
        
        question_form = QuestionForm(request.POST)
        if question_form.is_valid() : 
            question = Question(question_quiz = project,question=request.POST['question'],answer=request.POST['answer'],
                                option_1=request.POST['option_1'], option_2=request.POST['option_2'], option_3=request.POST['option_3'])
 
            question.save()
            print('request.POST[question]',request.POST['question'])
            num_of_qustions =  project.num_of_qustions 
            question = Question(question_quiz = project)
            print('num_of_qustions, question',num_of_qustions, question)
            project.num_of_qustions = num_of_qustions + 1
            # udejtujemo pole u project
            project.save()
            return redirect('staff:get-create-quiz-question',pk )
        else:
            # ako je smuljano i izigran client strana samo obavjest
            request.session['message'] ='You have not created a question! Fill out the form correctly!'
            return redirect('staff:get-create-quiz-question',pk )
 
    
# edituje ili dobije i editujee Question  , pk1 je id projekta tj quiza a pk2 id question-a
@login_required(login_url="login")
@teacher_access_only()   
def edit_Question(request, pk1, pk2, pk3):
    project =  get_object_or_404(Project, id=pk1)
    question = get_object_or_404(Question, question_quiz=project,id = pk2)
    
    if request.method == 'POST':
        #return redirect('staff:create-quiz',pk1 )
        question_form = QuestionForm(request.POST)
        if question_form.is_valid() : 
            question.question = request.POST['question']
            question.answer = request.POST['answer']
            question.option_1 = request.POST['option_1']
            question.option_2 = request.POST['option_2']
            question.option_3 = request.POST['option_3']
            question.save()
            
            return redirect('staff:get-create-quiz-question',pk1 )
        else:
            request.session['message'] ='You have not created a question! Fill out the form correctly!'
            return redirect('staff:edit-question',pk1, pk2 )
    else:  #GET  
        context = {'question': question, 'projectName': project.projectName, 'question_id': pk3}
        message_1 = request.session.get('message')   
        if message_1 != None:
            context['message'] = message_1
            request.session['message'] = None   
        return render(request,'staff/edit-question.html', context)

# izbrise question
@login_required(login_url="login")
@teacher_access_only()   
def delete_Question(request, pk1, pk2):
    project =  get_object_or_404(Project, id=pk1)
    print('br pitanje',project.num_of_qustions)
    #question = Question.objects.filter(quiz=project_quiz,id = pk2)
    question = get_object_or_404(Question, question_quiz=project,id = pk2)  
    try:
        question.delete()
        # smanjimo num_of_qustions u Quiz tabeli
        num_of_qustions = project.num_of_qustions
        project.num_of_qustions = num_of_qustions - 1
        project.save()
        # ako je kviz publiciran i br pitanja jednak 5 , broj pitanja se smanji i treba unpublish kviz
        if num_of_qustions == 5 and project.quiz_published == True:
            project.quiz_published = False
            project.save()
        context = {"success": 'yes'}
        return JsonResponse(context)
    except:
        return JsonResponse({"success": 'no'})
 
# publicira quiz za prikaz na student strani
@login_required(login_url="login")
@teacher_access_only()
def publish_unpublish_Quiz(request, pk):
    try:
        # kojeg zelimo update procitamo iz db
        project =  get_object_or_404(Project, pk=pk)
         
        print("in publish quiz, a project.published", project.quiz_published)
        if project.num_of_qustions < 2 :
            return JsonResponse({"message": "The quiz has only " +  project.num_of_qustions + " questions and the quiz must have at least 5 questions to be published for use."})
        elif project.quiz_published is False :
            project.quiz_published = True    # published
            project.save()
            print("Quiz published :user, user.isteacher:")
            return JsonResponse({"success": "published"})
        elif project.quiz_published is True:
            project.quiz_published = False  # unpublished
            project.save()
            return JsonResponse({"success": "unpublished"})
        return JsonResponse({"success": "no"})
    except:
        return render(request,'error.html', {'problem': 'The server is unable to read the data!'})
        
 
        
