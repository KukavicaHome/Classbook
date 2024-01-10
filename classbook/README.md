# capstone Final-Project

Web Programming with Python and JavaScript

#### Video Demo:  <URL https://www.youtube.com/watch?v=NsUgamC6AD0>

# Distinctiveness and Complexity
This project was conceived as a development and consumption platform intended for teachers and students.
The project is made up of 3 applications: mysite, class and staff.

-the mysite application is used for registration and logging in and connecting the other two applications.
-staff application is used for creating projects by teachers. The project includes a Youtube url, a pdf file as resources and a quiz for the project.
-class app is a consumer application and is used by students to access learning content: video and pdf file and quizes to check knowledge.

The special feature of this project compared to the ones we have done so far is that it enables a connection to Youtube and uploading a pdf file.

The application is simply defined and I intend to use it as a teacher in an elementary school. It is easy to upgrade the application and perhaps add new features.

Special attention was paid to security because there is a lot of data exchange that is checked both on the client side and on the server.

The project uses Django (including at least one model) on the back-end and JavaScript intensively on the front-end.
Project is mobile-responsive.

 
# Files
## Global files
- `capstone/static/styles.css` - Contains styles for all pages.
- `capstone/tamletes/base.html` - Base template
- `capstone/tamletes/error.html`  - Template for displaying errors.
- `capstone/tamletes/base/css.html` - The template contains all links for css files.
- `capstone/tamletes/base/footer.html` - Footer template.
- `capstone/tamletes/base/js.html`- The template contains most of the links for js files.
- `capstone/tamletes/base/messages.html` - Message template.
- `capstone/tamletes/base/navbar.html` - Navbare template for pages.

## mysite app files
- `capstone/static/mysite/css/mysite-styles.css` - Contains styles for mysite app.
- `capstone/static/mysite/css/styles-quiz.css` - Contains styles for get-create-quiz-question page.
- `capstone/static/mysite/css/quiz.css` -  Contains styles for play-quiz page.
- `capstone/static/mysite/js/index.js` -  Contains js for Welcome to Classbook! page.
- `capstone/static/mysite/js/login.js` -  Contains js for login page.
- `capstone/static/mysite/js/quiz.js` -  Contains js for play-quiz page.
- `capstone/static/mysite/js/register.js` -  Contains js for register-student and register-teacher pages.
- `capstone/templates/mysite/form/register-tamplate.html` - Template for registraation form.
- `capstone/templates/mysite/quiz/quiz.html` - Template for play-quiz page.
- `capstone/templates/mysite/quiz/index.html` - Template for the home page of mysite app.
- `capstone/templates/mysite/quiz/login.html` - Template for the login page of mysite app.
- `capstone/templates/mysite/quiz/register.html` - Template for the register-student and register-teacher pages of mysite app.
- `capstone/templates/mysite/decorators.py` - A file that defines the decorators for the project.
- `capstone/templates/mysite/forms.py` - A file that defines the user form for the project.
- `capstone/templates/mysite/models.py` - A file that defines the user model for the project.
- `capstone/templates/mysite/utils.py` - A file that defines helper functions for the mysite app.
- `capstone/templates/mysite/urls.py` - A file that defines app paterns that match the requested URL to find the correct view.
- `capstone/templates/mysite/views.py` - A file that defines functions that takes http requests and returns http response, like HTML documents or json.

## class app files
- `capstone/static/class/styles/class-style.css` - Contains styles for class app.
- `capstone/static/class/js/all-comments.js` -  Contains js for class/all-project-comments page.
- `capstone/static/class/js/current-project.js` -  Contains js for class/project page.
- `capstone/templates/class/all-projects.html` - Template for class/projects page.
- `capstone/templates/class/all-comments.html` - Template for class/all-project-comments page.
- `capstone/templates/class/current-project.html` - Template for class/project page.
- `capstone/templates/class/search.html` - Template for class/project_search_view page.
- `capstone/templates/class/submissions.html` - Template for class/submissions page.
- `capstone/templates/class/forms.py` - A file that defines the NewCommentForm form for the app.
- `capstone/templates/class/models.py` - A file that defines the Comment and Submission model for the app.
- `capstone/templates/class/utils.py` - A file that defines helper functions for the class app.
- `capstone/templates/class/views.py` - A file that defines functions that takes http requests and returns http response, like HTML documents or json.

## staff app files
- `capstone/static/staff/styles/staff-style.css` - Contains styles for staff app.
- `capstone/static/staff/js/create-project.js` -  Contains js for staff/create-project page.
- `capstone/static/staff/js/create-quiz.js` -  Contains js for staff/get-create-quiz-question page.
- `capstone/static/staff/js/delete-project.js` -  Contains js for asynchronous deletion of the project.
- `capstone/static/staff/js/pdf_update.js` -  Contains js for staff/update-pdf-file page.
- `capstone/static/staff/js/projects.js` -  Contains js for staff/projects page.
- `capstone/static/staff/js/publish_unpublish.js` -  Contains js for asynchronous publish/unpublish of projects and quizes.
- `capstone/static/staff/js/get-project.js` -  Contains js for staff/get-project page.
- `capstone/templates/staff/form/edit-description.html` - Template for description editing of project.
- `capstone/templates/staff/form/edit-pdf.html` - Template for pdf editing of project.
- `capstone/templates/staff/form/edit-projectName.html` - Template for projectName editing of project.
- `capstone/templates/staff/form/edit-question-form.html` - Template for question editing of project.
- `capstone/templates/staff/form/edit-video-form.html` - Template for video editing of project.
- `capstone/templates/staff/form/project-form-template.html` - Template for creating of project.
- `capstone/templates/staff/form/question-form.html` - Template for creating of question of project.
- `capstone/templates/staff/create-project.html` - Template for staff/create-project page.
- `capstone/templates/staff/create-quiz-question.html` - Template for staff/get-create-quiz-question page.
- `capstone/templates/staff/staff/edit-question.html` - Template for staff/edit-question page.
- `capstone/templates/staff/staff/projects.html` - Template for staff/projects page.
- `capstone/templates/staff/staff/single-project.html` - Template for staff/get-project page.
- `capstone/templates/staff/staff/update-pdf-file.html` - Template for staff/update-pdf-file page.
- `capstone/templates/staff/forms.py` - A file that defines the ProjectForm and QuestionForm form for the staff app.
- `capstone/templates/staff/models.py` - A file that defines: Project, Like and Question model for the staff app.
- `capstone/templates/staff/utils.py` - A file that defines helper functions for the staff app.
- `capstone/templates/staff/views.py` - A file that defines functions that takes http requests and returns http response, like HTML documents or json.

# How to run your applications.
Check 127.0.0.1:8000 or localhost:8000

-Register as a teacher or student or login

-If you log in as a teacher, you can create projects and quizzes and publish them for students to use.
When you have created a project, you must publish it to make it available to students. The same applies to the quiz.
You can edit or delete the project.

-If you log in as a student, you can choose the project published by the teachers and see the learning content and the quiz if it has been published.
You can search for projects by keyword in the search field and you can view projects related to that word, you can view your submissions, you can play a quiz and submit it, and you can comment on the project.
When the user plays the quiz, then a set of 5 questions is made randomly and the options are arranged randomly, so if the teacher made more than 5 questions, the student will always or almost always get a different set of questions.


