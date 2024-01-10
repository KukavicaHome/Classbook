//Ova lista se napuni sa imenima sa servera kod ucitavanja stranice 
let all_names =[]
//kad se klikne na dugme Choose File za onchange i eveluate pdf funkcije
const choose_file_btn = document.getElementById("id_pdf");
const pdf_label_el = document.getElementById('pdf_label')
let selected ;
let file_name ;
 //--->Sa servera procitamo sva ProjectName pozivom funkcije projectName_validate(data_to_send, url);
 const pathname = window.location.pathname;
 // u slucaju da abdejtujemo dobijemo id za project iz pathname
const project_id = pathname.charAt(pathname.length - 2);
//
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
  console.log('create-edit-project');
  clear_file_btn.style.display = 'none'
 
  console.log('radi se o kreiranju projekt')
  //Na server posaljemo samo projectName , koji se u db evaulira na unique
  data_to_send = {"pk": 0};
  const url = '/staff/get-projectNames/'
  get_projectNames(data_to_send, url);
});

//provjeri jeli neki string broj
function is_project_Id_Number(n) { 
  return /^-?[\d.]+(?:e-?\d+)?$/.test(n); 
} 

//procita sva imena projekata sa servera za provjeru na client strani
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
          console.log("greska");
     }else{
      all_names = data['project_names']
      //console.log('u fetch, all_names:', all_names)
     }
   });
}

//funkcija evaluira dali je unos ProjectName pravilan
function evaluateProjectName(projectName){
  const izbor_projectName_alert = document.getElementById('izbor_projectName_alert');
  //jel ime duze od 100 znakova
  var is_projectName_toolong = true;
  if(projectName.length > 100){
    izbor_projectName_alert.innerHTML = `Project Name can have a maximum of 100 characters.`;
    is_projectName_toolong = false;
  }
  //jel ime jedinstveno
  var projectName_unique = true;
  all_names.forEach(element => {
    //console.log('element, len(element), projectName, len(projectName)', element,element.length, projectName, projectName.length)
    if (element.trim() === projectName){
      izbor_projectName_alert.innerHTML = `Such a Project Name already exists.`;
      projectName_unique = false;
    }
  });

  if(is_projectName_toolong === true && projectName_unique === true){
    return true;
  }else{
    return false;
  }
}

//kad se klikne na dugme Choose File
choose_file_btn.onchange = () =>{
  selected = choose_file_btn.files[0];
  file_name =  selected['name']
  pdf_label_el.innerHTML = file_name;
  clear_file_btn.style.display = "block";
}

//sakrije button nakon sto se izbor ocist
function sakri_clear_file_btn(){
  //console.log('U sakri_clear_file_btn')
  clear_file_btn.style.display = "none";
  pdf_label_el.innerHTML = "Choose file...";
  izbor_fajla_alert.innerHTML = "";
  //ponistimo selektovani fajl
  selected = undefined;
}

/*fukcij e koje obradzuju unos form i submit button*/
//unos pdf fajla
function evaluate_pdf(){
  izbor_fajla_alert.innerHTML = "";
  // maksimalna velicina fajla u bitovima
  const max_size = 1048576;
  //provjeri jel izabran fajl za poslati
  if(selected === undefined) {
    return true 
  }  
  //console.log('selected', selected)
  const size = selected.size;
  const ekstenzija = file_name.substring(file_name.length - 4); 
  //duzina pdf fajla ne smije biti veva od 50 znakova
  const duzina_imena = file_name.length;

  //console.log("ekstenzija", ekstenzija)
  //alert('U evaluate_pdf')
  //Please either submit a file or check the clear checkbox, not both.
  if (ekstenzija != ".pdf" && size > max_size && duzina_imena > 50){
    izbor_fajla_alert.innerHTML = `You must choose a pdf file, which is not larger than 1 MB!
                                    <br>Number of characters in the name must be less than 50!`;
    return false;
 
  }else if (ekstenzija != ".pdf" && size > max_size){
    izbor_fajla_alert.innerHTML = `You must choose a pdf file, which is not larger than 1 MB!`;
    return false;
  }else if (size > max_size && duzina_imena > 50){
    izbor_fajla_alert.innerHTML = `You must choose a pdf file, which is not larger than 1 MB!
                                      <br>Number of characters in the name must be less than 50!`;
    return false;
  }else if (ekstenzija != ".pdf" && duzina_imena > 50){
    izbor_fajla_alert.innerHTML = `You must choose a pdf file, and number of characters in the name must be less than 50!`;
    return false;
  } else if (ekstenzija != ".pdf"){
    izbor_fajla_alert.innerHTML = `You must choose a pdf file!!`;
    return false;
  }else if(size > max_size){
    izbor_fajla_alert.innerHTML = `Your selected file is larger than 1 MB!!`;
    return false;
  }else if (duzina_imena > 50){
    izbor_fajla_alert.innerHTML = `Number of characters in the file name must be less than 50!`;
    return false;
  }
  
  return true;
 }

 function evaluateVideo(video_url){
  const izbor_videa_alert = document.getElementById('izbor_videa_alert');
  var url = document.getElementById('id_video').value;
  video_url = video_url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if(video_url[0] != 'https://www.youtube.com/watch?'){
      izbor_videa_alert.innerText = 'Please choose a correct YouTube url!';
      return false;
    }
  //console.log('url,url[0], url[1],url[2], url[2].length', url,url[0], url[1],url[2],url[2].length);
  var regExsp = /[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]/;
  var match = video_url[2].match(regExsp);
  console.log('match', match)
  if (video_url[0] === 'https://www.youtube.com/watch?' && video_url[1] === 'v=' && match != null ){
    return true;
  }else{
    //console.log('u evaluateVideo, izbor_videa_alert', false, izbor_videa_alert )
    izbor_videa_alert.innerText = 'Please choose a correct YouTube url!';
    return false;
  }
  //return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
 }

//ocist poruke sA SERVERA
function clear_server_error_messages(){
  try {
    const arr_of_server_warnings = document.getElementsByClassName('invalid-server-feedback');
    const projectName = document.getElementById('id_projectName').value;
    //console.log('projectName', projectName)
    //console.log('arr_of_server_warnings, type', arr_of_server_warnings)
    for(element of arr_of_server_warnings){
      element.innerHTML = '';
    }
  } catch (error) {
    console.log('error:',error);
    // Expected output: ReferenceError: nonExistentFunction is not defined
    // (Note: the exact output may be browser-dependent)
  }
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

function evaluateDescription(description){
  if(description.length > 500){
    document.getElementById('izbor_descriptio_alert').innerHTML = 'Your description has too many characters.';
    return false;
  }else{
    return true;
  }
}
//listener na submit btn
document.querySelector('.create-update-project').addEventListener('submit', (e) => {
  //ocisti poruke ogreskama sa servera
  clear_server_error_messages();
  //ocisti poruke ogreskama sa js
  clear_client_error_messages()
  
  const form_data = Object.fromEntries(new FormData(e.target).entries());
  console.log('form_data za poslati, project_published', form_data, form_data['project_published'])
 
  //ovo treba evaulirati prije nego posaljemo serveru
  const evaluate_projectName =  evaluateProjectName(form_data['projectName'].trim());
  const evaluate_Description = evaluateDescription(form_data['description'].trim());
  const evaluate_Video = evaluateVideo(form_data['video'].trim());;
  const evaluate_PDF  = evaluate_pdf();

 
  console.log('evaluate_PDF, evaluate_projectName, evaluate_Video, evaluate_Description', evaluate_PDF,evaluate_projectName, evaluate_Video,evaluate_Description)
    //ovdj provjerimo jel sve true, tj da je sve ispravno uneseno, tj dali ima i jedna greska
  if (evaluate_PDF === false || evaluate_projectName === false || evaluate_Video === false || evaluate_Description === false){
      //console.log('evaluate_PDF, evaluate_projectName u if',evaluate_PDF,evaluate_projectName )
      // ne mozemo da saljemo, popravimo unos
      e.preventDefault()
      e.stopPropagation()
    }
    //alert('U Submit')
});

function cancelSubmit(){
  const origin = window.location.origin;
  let new_href ;
  if(is_project_Id_Number(project_id) === true){
    new_href = origin + "/staff/get-project/" + project_id + "/";
    //console.log(new_href)
    window.location.href = new_href;
  }else{
    new_href = origin + "/staff/projects/";
    //console.log(new_href)
    window.location.href = new_href;
  }
}

//relodira glvnu stranicu
function goHome(){
  const origin = window.location.origin;
  let new_href = origin + "/staff/projects";
  //console.log(new_href)
  window.location.href = new_href;

}

