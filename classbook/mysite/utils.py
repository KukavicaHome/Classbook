import requests
from django.core.exceptions import ValidationError
import mysite.models
from email_validator import validate_email, EmailNotValidError

def is_username_unique(username):
    all_users =  mysite.models.User.objects.all()
    for user in all_users:
        if user.username == username:
            return False

    return True

def validate_data(data):
    context = {}
    err_message = ''
    if is_username_unique(data['username']) == False:
        err_message = err_message + ' ' + 'Username already taken.'
             
    if data['password'] != data['confirmation']:
        err_message = err_message + ' ' + 'Passwords must match.'
             
    if data['status'] != 'student' and data['status'] != 'teacher':
        err_message = err_message + ' ' + 'Status must be "student" or "teacher".'

    try:
        email = data['email']
        emailinfo = validate_email(email, check_deliverability=False)
        email = emailinfo.normalized
    except EmailNotValidError as e:
        err_message = err_message + ' ' + 'Please enter a valid email address.'
        
    return err_message