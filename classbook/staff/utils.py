# Provjerimo dali ima veze sa Youtube
import requests
from django.core.exceptions import ValidationError
import staff.models
 
url = "https://www.youtube.com/"
timeout = 5
def is_connected():
    try:
        request = requests.get(url, timeout=timeout)
        print("Connected to the Internet")
        return True
    except (requests.ConnectionError, requests.Timeout) as exception:
        print("No INTERNET")
        return False
    
#za validacij velivine pdf na 1 MB
def validate_file_size(value):
    filesize= value.size
    if filesize > 1048576:
        return True
    else:
        return False
    
#za validacij velivine pdf na 1 MB
def validate_file_name_length(value):
    filename= value.name
    
    if len(filename) > 50:
        return True
    else:
        return False
 
# jel ime jedinstveno u db   
def validate_project_name_is_uniq(projectName, pk = ''):
    if pk == '':
        all_projects =  staff.models.Project.objects.all()
    else:
        all_projects =  staff.models.Project.objects.exclude(id=pk)

    for project in all_projects:
        if projectName == project.projectName or projectName == '':
            return True    #project nema jedinstveno ime
    return False # project ima jedinstveno ime

# jel description duza od 500 znakova
def validate_description_length(value):
    if len(value) > 500:
        return True
    else:
        return False

def validate_error_projectName_length(value) :
    if len(value.strip()) > 100:
        return True
    else:
        return False
    
# jel extenzija  .pdf
def validate_pdf_file_extension(value):
    if str(value).endswith('.pdf'):
        return False
    else:
        return True

def get_current_pdf(pk):
    all_projects =  staff.models.Project.objects.all()
    #print('get_current_pdf:')
    for item in all_projects:
        #print('item.pdf, pk, item.id',item.pdf, pk,item.id)
        if item.id == pk:

            return item.pdf
           

# evaluacija projecta
def evaluate_project(request, pk=''):
    #print("Kreiranje projekta:")
    errors = {}
    data = {}
    request = request
    
    errors["error_pdf_maxSize"] = False
    errors["error_pdf_file_name_length"] = False
    data['published'] = ''
    data['description'] = ''
   
    data['valid_pdf'] = get_current_pdf(pk)
     

    for key, value in request.POST.items():
        # Remove Leading and Trailing Whitespace from Strings sa strip()  methodom
        data[key] = value.strip()
 

    try:
        pdf = request.FILES['pdf']
        data["pdf"] = pdf
    except:
        pdf = ''
        data["pdf"] = ''

    # evaluiramo projectName
    if pk == '':
        errors['error_projectName'] = validate_project_name_is_uniq(data['projectName'])
    else:
        errors['error_projectName'] = validate_project_name_is_uniq(data['projectName'], pk)

    if pdf != '':
        errors["error_pdf_maxSize"] = validate_file_size(pdf)
        errors["error_pdf_file_name_length"] = validate_file_name_length(pdf)
        errors['error_pdf_extension'] = validate_pdf_file_extension(pdf)

    if errors["error_pdf_maxSize"] != False and errors["error_pdf_file_name_length"] != False and errors['error_pdf_extension'] :
        data['valid_pdf'] = pdf
    
    errors['error_description'] = validate_description_length(data['description'])
    errors['error_projectName_length'] = validate_error_projectName_length(data['projectName'])

    # zdruzimo errors i data u context
    context = errors.copy()
    context.update(data)
    return errors, context  # vratimo errors i context
    
# vrati projekt context
def get_project(project):
    context = {'projectName': project.projectName, 'description': project.description,  
               'video':project.video, 'pdf':project.pdf, 'published': project.published, 'valid_pdf': project.pdf }  
 
    return context

def get_all_project_names(pk=''):
    if pk:
        all_projects =  staff.models.Project.objects.all().exclude(pk=pk)
    else:
        all_projects =  staff.models.Project.objects.all()
    project_names = []
    for project in all_projects:
        project_names.append(project.projectName)

    return project_names
    
    
    

 
 
