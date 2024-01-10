let project_id;

//samo kad se lodira
document.addEventListener('DOMContentLoaded', function(){
    console.log(' U class/current-project,bbb');
    const pathname = window.location.pathname;
    var url_str = window.location.pathname; // za http://127.0.0.1:8000/staff/get-project/10/ imamo ['', 'staff', 'get-project', '10', '']
    var arr = url_str.split('/');
    //console.log('arr', arr)
    // u slucaju da abdejtujemo dobijemo id za project iz pathname
    project_id = arr[3]
    const iframe_el = parent.document.getElementsByTagName('iframe');
    console.log('iframe_el',iframe_el)
  });


function likeHandler(id){
    let br_like_el_id = `br_lajkova_${id}`;
    const br_like_el = document.getElementById(br_like_el_id);
    var br_like = parseInt(br_like_el.innerText);
    console.log("Broj likova", br_like);

    //button koji je kliknut
    const like_btn =  document.getElementById(id);
    like_btn.disabled = true;
    console.log("like_btn.disabled", like_btn.disabled)
    //span za broj likova
    

    console.log("boja srca:", like_btn.style.color)
    // promjenimo stanje u db u zavisnosti jel dodajemo ol brisemo
    // kad dobijemo odgovor zamjenimo ikone za  i  
    if (like_btn.style.color === "red"){ //remove like
        fetch(`/class/remove_like/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        }
        )
        .then(response => response.json())
        .then(result => {
            //promjenimo boju srca u crno
            like_btn.style.color = "black";
            //smanjimo broj likova
            br_like_el.innerHTML = parseInt(br_like) - 1;
            console.log("resul nakon disliked, broj likova",result.message, br_like_el.innerHTML);
            like_btn.disabled = false;
           console.log("like_btn.disabled", like_btn.disabled)
        })
    }else{
        fetch(`/class/add_like/${id}`, {//dodaj lile
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })
        .then(response => response.json())
        .then(result => {
            console.log("result",result.message)
            //promjenimo boju srca u crveno
            like_btn.style.color = "red";
            //smanjimo broj likova
            br_like_el.innerHTML = parseInt(br_like) + 1;
            console.log("resul nakon liked, broj likova",result.message, br_like_el.innerHTML);
            like_btn.disabled = false;
            console.log("like_btn.disabled", like_btn.disabled);
        })
    }
    
}
 
function createQuestion(){
    const origin = window.location.origin;
    let new_href = origin + "/class/all-project-comments/" + project_id;
    //console.log(new_href)
    window.location.href = new_href;
}

function playQuiz(){
    const origin = window.location.origin;
    let new_href = origin + "/play-quiz/" + project_id + "/";
    //console.log(new_href)
    window.location.href = new_href;
  }