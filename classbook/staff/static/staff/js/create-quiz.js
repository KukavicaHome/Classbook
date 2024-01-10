let project_id;
let pathname;
 
document.addEventListener('DOMContentLoaded', function () {
  console.log('U create-quiz');
  //--->Sa servera procitamo sva ProjectName pozivom funkcije projectName_validate(data_to_send, url);
  pathname = window.location.pathname;
  var url_str = window.location.pathname; // za http://127.0.0.1:8000/staff/get-project/10/ imamo ['', 'staff', 'get-project', '10', '']
  var arr = url_str.split('/');
  //console.log('arr', arr)
  // u slucaju da abdejtujemo dobijemo id za project iz pathname
  project_id = arr[3]
  //console.log(' pathname,project_id:', pathname, parseInt(project_id))
  const data_to_send = { "pk": parseInt(project_id) };
  //console.log('data_to_send:', data_to_send)
});
 
function create_message(message) {
  var div = document.createElement('div');
  console.log()
  div.setAttribute('class', 'alert fixed-top mb-0 rounded-0 alert-success alert-dismissible');
  div.setAttribute('role', 'alert');
  div.setAttribute('data-alert', 'success dismissible');
  div.setAttribute('data-hash', 'f5fa231a8b697cc591f0d91b0b1ea768');

  var p = document.createElement('p');

  p.textContent = message;
  if (message != 'Publish was successful!'
      && message != 'Unpublish was successful!') {
      p.setAttribute('style', 'color: red');
  }
  div.appendChild(p);
  var button = document.createElement('button');
  button.setAttribute('class', 'btn-close');
  button.setAttribute('type', 'button');
  button.setAttribute('data-bs-dismiss', 'alert');
  button.setAttribute('aria-label', 'Close');
  div.appendChild(button)


  //console.log("div,message, message_div",div, message, message_div);
  document.getElementById('poruka').appendChild(div);

}//kraj create_message()

function evaluateForm(form_data){
  const alert_message = 'The number of characters must be greater than 0 and less than 150.';
  let evaluate_fild ;
  if(form_data['question'].length == 0 ||  form_data['question'].length > 150){
    document.getElementById('question_alert').innerHTML = alert_message;
    evaluate_fild = false;
  }
  if(form_data['answer'].length == 0 ||  form_data['answer'].length > 150){
    document.getElementById('answer_alert').innerHTML = alert_message;
    evaluate_fild = false;
  }
  if(form_data['option_1'].length == 0 ||  form_data['option_1'].length > 150){
    document.getElementById('option_1_alert').innerHTML = alert_message;
    evaluate_fild = false;
  }
  if(form_data['option_2'].length == 0 ||  form_data['option_2'].length > 150){
    document.getElementById('option_2_alert').innerHTML = alert_message;
    evaluate_fild = false;
  }
  if(form_data['option_3'].length == 0 ||  form_data['option_3'].length > 150){
    document.getElementById('option_3_alert').innerHTML = alert_message;
    evaluate_fild = false;
  } 
  return evaluate_fild;
}

form.addEventListener('submit', (e) => {
  //alert('U Submit')
  //izbrisemo poruke za alert
  document.getElementById('question_alert').innerHTML = '';
  document.getElementById('answer_alert').innerHTML = '';
  document.getElementById('option_1_alert').innerHTML = '';
  document.getElementById('option_2_alert').innerHTML = '';
  document.getElementById('option_3_alert').innerHTML = '';

  const form_data = Object.fromEntries(new FormData(e.target).entries());
  console.log('form_data za poslati, form_data[question]', form_data, form_data['question'])

  const evaluate_form = evaluateForm(form_data);
  if(evaluate_form === false){
    e.preventDefault()
    e.stopPropagation()
  }
//alert('U Submit quiz questio')
})

function goHome() {
  const origin = window.location.origin;
  let new_href = origin + "/staff/get-project/" + project_id + "/";
  window.location.href = new_href;
}

 
function create_quiz_question(){
  console.log('U create_quiz_question')
  const question_form_div = document.getElementById('question-form-div');
  question_form_div.style.display = 'block';
  //sakrijemo pitanja
  document.getElementById('questions_div').style.display = 'none';
}
//lodiramo page za editovati
function edtiQuestion(id, quiz_nmb){
  const origin = window.location.origin;
  const url = '/staff/edit-question/' + project_id + '/' + id + '/' + quiz_nmb + '/';
  let new_href = origin + url;
  //console.log(new_href)
  window.location.href = new_href;
}


function cancel_Edit_Question(){
  console.log('U cancel_Edit_Question,')
  //prikazemo pitanja
  document.getElementById('questions_div').style.display = 'block';
  //sakrijemo edit form
  document.getElementById('question_form_edit').style.display = 'none';

}

//sakrije modal nakon sto se klikne na button delete
function hide_post_Modal(id) {
  ///modal 
  const modal = document.getElementById(`modal_delete_post_${id}`);
  //sakrijemo modal: https://stackoverflow.com/questions/46577690/hide-bootstrap-modal-using-pure-javascript-on-click
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  modal.setAttribute('style', 'display: none');

  // get modal backdrops , bez ovog ostane tamno
  const modalsBackdrops = document.getElementsByClassName('modal-backdrop');

  // remove every modal backdrop
  for (let i = 0; i < modalsBackdrops.length; i++) {
      document.body.removeChild(modalsBackdrops[i]);
  }
}

function delete_Question(question_id){
  //
  const url = '/staff/delete-question/' + project_id + '/' + question_id + '/';
  console.log('U cancel_Edit_Question, url, question_id', url, question_id);
  delete_Question_on_Server(url, question_id);
}

//procita sva imena projekata sa servera
async function delete_Question_on_Server(url, id) {
   console.log('delete_Question_on_Server, id za question', id)
 
  const response = await fetch(url, {
     method: "GET",
     headers: {
       //"X-CSRFToken": getCookie("csrftoken"),
       "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value,
       'Content-Type': 'application/json',
      'Accept': 'application/json',
     } 
   })
   .then(response => response.json())
   .then(data => {
     if (data.success === "no"){
        console.log('greska')
        //sakkrije modal
        hide_post_Modal(id);
     }else{
      //ponovo relodiramo stranicu
      window.location.href = pathname;
     }
   });
  }

  //cancel_Submit_Question kod editovanja
function cancel_Submit_Question(){
  console.log('u cancel_Submit_Question, project_id', project_id)
  const origin = window.location.origin;
  const url = '/staff/get-create-quiz-question/' + project_id + '/' ;
  let new_href = origin + url;
  //console.log(new_href)
  window.location.href = new_href;
}

 function playQuiz(){
  const origin = window.location.origin;
  let new_href = origin + "/play-quiz/" + project_id + "/";
  //console.log(new_href)
  window.location.href = new_href;
}


 
