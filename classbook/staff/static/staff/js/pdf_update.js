//kad se klikne na dugme Choose File za onchange i eveluate pdf funkcije
const choose_file_btn = document.getElementById("id_pdf");
const pdf_label_el = document.getElementById('pdf_label')
const delite_file_el = document.getElementById('delite_file');
const form = document.getElementById("form");
let selected ;
let file_name ;
let field_name = '';
let project_id;
//samo kad se lodira


document.addEventListener('DOMContentLoaded', function(){
    console.log('update-pdf-file');
    //--->Sa servera procitamo sva ProjectName pozivom funkcije projectName_validate(data_to_send, url);
    const pathname = window.location.pathname;
    const url_str = window.location.pathname; // za http://127.0.0.1:8000/staff/get-project/10/ imamo ['', 'staff', 'get-project', '10', '']
    const arr = url_str.split('/');
    //console.log('arr', arr)
    // u slucaju da abdejtujemo dobijemo id za project iz pathname
    project_id = arr[3]
    project_id = parseInt(project_id);
    //console.log('radi se o updejtovanju projekta, pathname,project_id:',pathname, project_id)
    if(delite_file_el != undefined){
      deletPDF = delite_file_el.onclick;
    }
  });

  
  form.addEventListener('submit', (e) =>{
    //alert('U Submit')
    const form_data = Object.fromEntries(new FormData(e.target).entries());
    //console.log('form_data za poslati', form_data)
 
    const evaluate_PDF = evaluate_pdf();
    console.log('evaluate_PDF, file_name', evaluate_PDF,file_name )
  
    if (evaluate_PDF === false ){
        // ne mozemo da saljemo, popravimo unos
        e.preventDefault()
        e.stopPropagation()
      }
    //alert('U Submit')
  })
 
 /*fukcij e koje obradzuju unos form i submit button*/
  //unos pdf fajla
  function evaluate_pdf(){
    izbor_fajla_alert.innerHTML = "";
    // maksimalna velicina fajla u bitovima
    const max_size = 1048576;
    //provjeri jel izabran fajl za poslati
    if(selected === undefined) {
        izbor_fajla_alert.innerHTML = `You must choose a pdf file!!`;
        return false 
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

  //kad se klikne na dugme Choose File
choose_file_btn.onchange = () =>{
    izbor_fajla_alert.innerHTML = '';
    console.log('Klikno na choose')
    selected = choose_file_btn.files[0];
    file_name =  selected['name']
    pdf_label_el.innerHTML = file_name;
    if(delite_file_el != undefined){
      delite_file_el.style.display = "none";
    }
    
  }

  //izbrise pdf file na serveru
function deletePDF() {
  console.log('u deletePDF')

    var data_to_send = {"pk": project_id};
    console.log('radi se o updejtovanju projekta')
    delete_PDF(data_to_send);
  } 

  //relodira glvnu stranicu
function cancel(){
    const origin = window.location.origin;
    console.log('project_id',project_id)
    let new_href = origin + "/staff/get-project/" + project_id + "/";
    //console.log(new_href)
    window.location.href = new_href;
    //alert('u cancel')
  }

function goHome(){
  cancel();
}

//Ova funkcija brise na serveru project ili ako je kliknut kancel prikaze originas
async function delete_PDF(data_to_send){
    const message_class_name = 'message';
    const origin_page = document.getElementById(origin);
        const operation = "Delete pdf file";
        //brisemo project asihrono
        url = "/staff/delete-file/";
        fetch(url, {
            method: 'POST',
            headers: {
                "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data_to_send),
        }
        )
        .then(response => response.json())
        .then(result => {
            if (result.success === "yes"){
              let new_href =  '/staff/get-project/' + project_id + '/';
              //console.log(new_href)
              window.location.href = new_href;
             }else{
              console.log("error")
              let new_href =  '/staff/get-project/' + project_id + '/';
              //console.log(new_href)
              window.location.href = new_href;
            }
        })
  }