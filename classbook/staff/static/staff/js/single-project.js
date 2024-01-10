
///Ova lista se napuni sa imenima sa servera kod ucitavanja stranice 
let all_names =[]
//kad se klikne na dugme Choose File za onchange i eveluate pdf funkcije
 
var project_id;
let file_name ;
let field_name = '';
//
const navigation_buttons = document.getElementById('navigation-buttons');
const clear_file_btn = document.getElementById('clear_file');
const id_projectName_el = document.getElementById('id_projectName');
const id_video_el = document.getElementById('id_video');
const id_description_el = document.getElementById('id_description');

//otkl;nimo pocetni razmak u unosu
id_projectName_el.addEventListener('input', () => {
  id_projectName_el.value = id_projectName_el.value ? id_projectName_el.value.trimStart() : '' 
})

id_video_el.addEventListener('input', () => {
  id_video_el.value = id_video_el.value ? id_video_el.value.trimStart() : '' 
})

id_description_el.addEventListener('input', () => {
  id_description_el.value = id_description_el.value ? id_description_el.value.trimStart() : '' 
})
//samo kad se lodira
document.addEventListener('DOMContentLoaded', function(){
    console.log('single-project');
    //--->Sa servera procitamo sva ProjectName pozivom funkcije projectName_validate(data_to_send, url);
    const pathname = window.location.pathname;
    var url_str = window.location.pathname; // za http://127.0.0.1:8000/staff/get-project/10/ imamo ['', 'staff', 'get-project', '10', '']
    var arr = url_str.split('/');
    //console.log('arr', arr)
    // u slucaju da abdejtujemo dobijemo id za project iz pathname
    project_id = arr[3]
    //console.log('radi se o updejtovanju projekta, pathname,project_id:',pathname, parseInt(project_id))
    const data_to_send = { "pk": parseInt(project_id)};
    //console.log('data_to_send:',data_to_send)
    const url = '/staff/get-projectNames/'
    get_projectNames(data_to_send, url);
    const video_url = 'http://www.youtube.com/embed/******'


    const iframe_el = document.querySelector(`iframe[src="${video_url}"`);

    //const iframe_el = parent.document.getElementsByTagName('iframe');
    console.log('iframe_el',iframe_el)
  
  });
   
//provjeri jeli neki string broj
function is_projectIdNumber(n) { 
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n); 
  } 
  
  //procita sva imena projekata sa servera
  async function get_projectNames(data_to_send, url) {
    const response = await fetch(url, {
       method: "POST",
       headers: {
         //"X-CSRFToken": getCookie("csrftoken"),
         "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value,
         'Content-Type': 'application/json',
          'Accept': 'application/json',
       },
       body: JSON.stringify(data_to_send),
     })
     .then(response => response.json())
     .then(data => {
       // extract the decoded value from the data sent back from the view
       // display it by targeting the element in your html that you want
       // to display it
       if (data.success === "no"){
            console.log('error');
       }else{
        all_names = data['project_names']
        //console.log('u fetch, all_names:', all_names)
       }
     });
  }
  
  //funkcija evaluira dali je unos ProjectName pravilan
  function evaluate_projectName(){
    var projectName = id_projectName_el.value;
    console.log('projectName.length',projectName.length)
    projectName= projectName.trim();
    console.log('projectName.length',projectName.length)
    const izbor_projectName_alert = document.getElementById('izbor_projectName_alert');
    console.log('u evaluate_projectName projectName:',projectName)
    //jel ime duze od 100 znakova
    var is_projectName_toolong = false ;
    if(projectName.length > 100){
      izbor_projectName_alert.innerHTML = `Project Name can have a maximum of 100 characters.`;
      is_projectName_toolong = true;
    } 
    //jel ime jedinstveno
    var projectName_unique = true;;
    all_names.forEach(element => {
      console.log('element, projectName',element, projectName.length)
      if (element === projectName){
        projectName_unique = false;
        izbor_projectName_alert.innerHTML = `Such a Project Name already exists.`;
        
      } 
    });
    console.log('is_projectName_toolong, projectName_unique',is_projectName_toolong, projectName_unique)
    //alert("u evalute name")
    if(is_projectName_toolong === false && projectName_unique === true){
      return true;
    }else{
      return false;
    }
  }
  
function evaluate_video(){
    const izbor_videa_alert = document.getElementById('izbor_videa_alert');
    var url = id_video_el.value.trim();
    //console.log("url",url)
    //alert('projectName',url)
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if(url[0] != 'https://www.youtube.com/watch?'){
      izbor_videa_alert.innerText = 'Please choose a correct YouTube url!';
      return false;
    }
    //console.log('url,url[0], url[1],url[2], url[2].length', url,url[0], url[1],url[2],url[2].length);
    var regExsp = /[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]/;
    var match = url[2].match(regExsp);
    //console.log('match', match)
    if (url[0] === 'https://www.youtube.com/watch?' && url[1] === 'v=' && match != null){
      return true;
    }else{
      //console.log('u evaluateVideo, izbor_videa_alert', false, izbor_videa_alert )
      izbor_videa_alert.innerText = 'Please choose a correct YouTube url!';
      return false;
    }
    //return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
   }
  
  //ocisti sve puruke s js
  function clear_client_error_messages(){
    const arr_of_client_warnings = document.getElementsByClassName('invalid-feedback-client');
    console.log('arr_of_client_warnings',  arr_of_client_warnings)
    for(element of arr_of_client_warnings){
      console.log('element.innerHTM',  element.innerHTML)
      element.innerHTML = '';
    }
    //alert("u clear_client_error_messages()")
  }
  
  function evaluate_description(){
    const description = id_description_el.innerHTML.trim();
    if(description.length > 500){
      document.getElementById('izbor_descriptio_alert').innerHTML = 'Your description has too many characters.';
      return false;
    }else{
      return true;
    }
  }

//Edituje project na serveru
async function send_new_data(my_body) {
  const url = '/staff/update-project-field/' + project_id + '/';
  const response = await fetch(url, {
     method: "POST",
     headers: {
       //"X-CSRFToken": getCookie("csrftoken"),
       "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value,
       'Content-Type': 'application/json, multipart/form-data',
      'Accept': 'application/json, multipart/form-data',
     },
     body: my_body,
   })
   .then(response => response.json())
   .then(data => {
     // extract the decoded value from the data sent back from the view
     // display it by targeting the element in your html that you want
     // to display it
     if (data.success === "no"){
      console.log("error")
      create_message("Editing was not successful!");
     }else{
       //console.log('data', data)
       const origin = window.location.origin;
       let new_href = origin + "/staff/get-project/" + project_id + "/";
       //console.log(new_href)
       window.location.href = new_href;
     }
   });
}
 
function update_projectField(){
  clear_client_error_messages();
  console.log('u updateProject')
  //console.log(`'${field_name}'`)
  var is_valid;
  if(field_name === 'projectName'){
    is_valid = evaluate_projectName();
  }else if(field_name === 'description'){
    is_valid = evaluate_description();
  }else if(field_name === 'video'){
    is_valid = evaluate_video();
  } 
  console.log('is_valid', is_valid)
  //objekt za poslati ako je input validan
  const input_el_id = 'id_' + field_name;
  const input_el = document.getElementById(input_el_id);
  const data_to_send = {};
  data_to_send[field_name] = input_el.value.trim();
  if(is_valid === true){
    const my_body = JSON.stringify(data_to_send);
    send_new_data(my_body);
  } 
}
 
//kad kliknemo na button da editujemo neko polje
function edit_form_field(value){
   //inicijaliziramo globalnu variablu
  console.log('u edit_form_field, value:',value)
  field_name = value;
  if(field_name === 'pdf'){
    const origin = window.location.origin;
    let new_href = origin + "/staff/update-pdf-file/" + project_id + "/";
    window.location.href = new_href;
  }else{
    //sakrijemo dugmad 
    navigation_buttons.style.display = 'none';
    //sakrijemo project_div
    const project_div_el = document.getElementById('project_div');
    project_div_el.style.display = 'none';
    const value_el = document.getElementById(value + '-edit');
    //console.log('el',value_el)
    value_el.style.display = 'block';
  }
}
//
function cancelSubmit(){
  //prikazemo project_div i sakrijemo form
  //console.log('u cancelSubmit, field_name', field_name)
  const project_div_el = document.getElementById('project_div');
  project_div_el.style.display = 'block';
  const value_el = document.getElementById(field_name + '-edit');
  //console.log('el',value_el)
  value_el.style.display = 'none';
  navigation_buttons.style.display = 'block';
}
  //relodira glvnu stranicu
function goHome(){
  const origin = window.location.origin;
  let new_href = origin + "/staff/projects";
  //console.log(new_href)
  window.location.href = new_href;

}


function createQuiz(){
  const origin = window.location.origin;
  let new_href = origin + "/staff/get-create-quiz-question/" + project_id + "/";
  window.location.href = new_href;
}
function create_message(message) {
  var div = document.createElement('div');
  console.log()
  div.setAttribute('class', 'alert fixed-top mb-0 rounded-0 alert-success alert-dismissible');
  div.setAttribute('role', 'alert');
  div.setAttribute('data-alert', 'success dismissible');
  div.setAttribute('data-hash', 'f5fa231a8b697cc591f0d91b0b1ea768');

  var p = document.createElement('p');
  p.textContent = message;
  p.setAttribute('style', 'color: brown');
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

function playQuiz(){
  const origin = window.location.origin;
  let new_href = origin + "/play-quiz/" + project_id + "/";
  //console.log(new_href)
  window.location.href = new_href;
}

 
