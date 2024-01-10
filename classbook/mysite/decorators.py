from functools import wraps
from django.contrib import messages
from django.shortcuts import redirect
from django.http import HttpResponse
 
 
def student_test_function(user):
    if user.is_student:
        return True
    return False
 
 
def teacher_test_function(user):
    if user.is_teacher:
        return True
    return False
 
 
def anonymous_user_test_function(user):
    if user.is_anonymous:
        return True
    return False

def is_staff_user_test_function(user):
    if user.is_staff:
        return True
    return False
 
 
def student_access_only():
    def decorator(view):
        @wraps(view)
        def _wrapped_view(request, *args, **kwargs):
            if not student_test_function(request.user):
                return HttpResponse("You are not a student and \
                        you are not allowed to access this page !")
            return view(request, *args, **kwargs)
        return _wrapped_view
    return decorator
 
 
def teacher_access_only(view_to_return="user_urls:home-page"):
    def decorator(view):
        @wraps(view)
        def _wrapped_view(request, *args, **kwargs):
            if not teacher_test_function(request.user):
                messages.error(request, "You cannot access \
                                the teachers  page !")
                return redirect(view_to_return)
            return view(request, *args, **kwargs)
        return _wrapped_view
    return decorator
 
 
def anonymous_user_only(message_to_deliver="You are logedin !"):
    def decorator(view):
        @wraps(view)
        def _wrapped_view(request, *args, **kwargs):
            if not is_staff_user_test_function(request.user):
                if not anonymous_user_test_function(request.user):
                    if teacher_test_function(request.user):
                        messages.error(request, message_to_deliver)
                        return redirect("staff:projects")
                    else:
                        messages.error(request, message_to_deliver)
                        return redirect("class:all-projects")
            return view(request, *args, **kwargs)
        return _wrapped_view
    return decorator

def anonymous_user(message_to_deliver=None):
    def decorator(view):
        @wraps(view)
        def _wrapped_view(request, *args, **kwargs):
                if not is_staff_user_test_function(request.user):
                    if not anonymous_user_test_function(request.user):
                        if teacher_test_function(request.user):
                            messages.error(request, message_to_deliver)
                            return redirect("staff:projects")
                        else:
                            messages.error(request, message_to_deliver)
                            return redirect("class:all-projects")
                return view(request, *args, **kwargs)
        return _wrapped_view
    return decorator