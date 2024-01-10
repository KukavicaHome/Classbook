
///Ovaj arr se napuni sa imenima sa servera kod ucitavanja stranice 
let all_names =[]

document.addEventListener('DOMContentLoaded', function(){
    console.log('Mysite registration');
    const url_users = 'get-users';
    all_names = get_users_Names(url_users)
    //console.log('u Mysite, all_names:', all_names)
});

const input_username_el = document.getElementById('input_username');
const input_email_el = document.getElementById('input_email');
const input_password_el = document.getElementById('input_password');
const input_confirmation_el = document.getElementById('input_confirmation');
//otkl;nimo pocetni razmak u unosu-kurzor na pocetak
input_username_el.addEventListener('input', () => {
  input_username_el.value = input_username_el.value ? input_username_el.value.trimStart() : '' 
})

input_email_el.addEventListener('input', () => {
  input_email_el.value = input_email_el.value ? input_email_el.value.trimStart() : '' 
})
input_password_el.addEventListener('input', () => {
  input_password_el.value = input_password_el.value ? input_password_el.value.trimStart() : '' 
})
input_username_el.addEventListener('input', () => {
  input_confirmation_el.value = input_confirmation_el.value ? input_confirmation_el.value.trimStart() : '' 
})

 //procita sva imena projekata sa servera
 async function get_users_Names(url_users) {
  const response = await fetch(url_users, {
     method: "GET",
     headers: {
       //"X-CSRFToken": getCookie("csrftoken"),
       "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value,
       'Content-Type': 'application/json',
        'Accept': 'application/json',
     },
   })
   .then(response => response.json())
   .then(data => {
     if (data.success === "no"){
          console.log('error');
     }else{
      all_names = data['all_users'];
      //console.log('u Mysite, all_names:', all_names)
     }
   });
}

function validate_Email(email){
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}
function evaluate_Form(form_data){
  console.log("u evaluate_Form")
  //evaluacija username
  let is_form_correct = true;
  all_names.forEach(element => {
    if (element === form_data['username'].trim()){
        console.log("u forEach")
        document.getElementById('izbor_username').innerHTML = 'Such a username already exists.';
        is_form_correct = false;
      }
  });
  const validateEmail = validate_Email(form_data['email'].trim());
  if(validateEmail === false ){
      document.getElementById('izbor_email').innerHTML = 'The email does not have the correct form.';
      is_form_correct = false;
    }
  const password =form_data['password']
  const confirmation = form_data['confirmation']
  console.log('password, confirmation', password, confirmation)
    //evluate confirmation
  if (password != confirmation){
      document.getElementById('izbor_confirmation').innerHTML = 'Confirmation is not correct. It is not the same as password.';
      is_form_correct = false;
    }
  const status = form_data.status;
  console.log('status', status)
  if (status != 'student' && status != 'teacher' ){
    document.getElementById('izbor_status').innerHTML = "Don't try to cause confusion.";
    is_form_correct = false;
  }
  return is_form_correct;

  //evaulacija emaila
}

//listener na submit
const register_form_el = document.querySelector('.register_form');
register_form_el.addEventListener('submit', (e) => {
  //ocisti obavjesti
  document.getElementById('izbor_username').innerHTML = '';
  document.getElementById('izbor_email').innerHTML = ''
  document.getElementById('izbor_confirmation').innerHTML = '';
  //The Object.fromEntries() method takes a list of key-value pairs 
  //and returns a new object whose properties are given by those entries 
  const form_data = Object.fromEntries(new FormData(e.target).entries());
  
  //console.log(form_data )
  //div za message
  const message_el = document.querySelector(".message");
  //console.log("form_data.is_staff", form_data.status);
 
  let is_form_OK = evaluate_Form(form_data)
  //console.log("is_form_OK", is_form_OK);
  
  if (is_form_OK === false){
    // ne mozemo da saljemo, popravimo unos
    e.preventDefault()
    e.stopPropagation()
  } 
   //alert('U submit syudent-teacher')
});


async function sendFormData(form_data, url, message_el) {
    const response = await fetch(url, {
       method: "POST",
       headers: {
         //"X-CSRFToken": getCookie("csrftoken"),
         "X-CSRFToken": form_data.csrfmiddlewaretoken
       },
       body: JSON.stringify({
            'confirmation': form_data.confirmation.trim(),
            "email": form_data.email.trim(),
            "password": form_data.password.trim(),
            "username": form_data.username.trim()
       }),
     })
     .then(response => response.json())
     .then(data => {
 
       console.log("data.is_teacher", data.is_teacher);
       if (data.success === "no"){
            message_el.innerHTML = data.message;
       }else{
          if(data.is_teacher === "yes"){
            //alert("ide staff/projects:");
            window.location.href = "staff/projects";
          }else {
            //alert("ide u class/projects:");
            window.location.href = "class/projects";
          }    
       }
     });
 }

function cancel_Registeer_Login(){
  const origin = window.location.origin;
  //console.log(new_href)
  window.location.href = origin;
}
 