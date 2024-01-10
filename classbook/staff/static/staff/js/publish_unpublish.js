 
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

//
function publish_unpulish_Project(value) {
    const message_class_name = 'message';
    //console.log("value:", value)
    //dobijemo element na kog smo kliknuli
    const el_id = "publish_" + value;
    console.log('el_id', el_id)
    var pubish_el = document.getElementById(el_id);
    console.log('pubish_el', pubish_el.style.color)
    //nedamo dvoklik
    pubish_el.disabled = true;
    let operation = pubish_el.innerText;


    url = '/staff/publish-unpublish-project/' + value + '/';
    //fetch npr : /staff/publish-project/1
    fetch(url, {
        method: 'POST',
        headers: {
            "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            'value': operation,
        }),
    }
    )
        .then(response => response.json())
        .then(result => {
            if (result.success === "unpublished") {//ako je bio zahtjev za unpublish
                //promjenimo vrijednosti za tag za 2 buutona
                //console.log(btn_array[0].style.color);
                const pathname = window.location.pathname;
                window.location.href = pathname;
        
                pubish_el.disabled = false;
            } else if (result.success === "published") {
                console.log('jeste published')
                const pathname = window.location.pathname;
                window.location.href = pathname;
       
                //dozvolimo opet klik
                pubish_el.disabled = false;
            } else {
                pubish_el.disabled = false;
                //greska
            }
        });
}

function publish_unpulish_Quiz(project_id){
    const message_class_name = 'message';
    //console.log("value:", value)
    //dobijemo element na kog smo kliknuli
    const el_id = "publish_quiz_" + project_id;
    console.log('el_id', el_id)
    var pubish_el = document.getElementById(el_id);
    console.log('pubish_el', pubish_el.style.color)
    //nedamo dvoklik
    pubish_el.disabled = true;
    let operation = pubish_el.innerText;


    url = '/staff/publish-unpublish-quiz/' + project_id + '/';
    fetch(url, {
        method: 'GET',
        headers: {
            "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    }
    )
        .then(response => response.json())
        .then(result => {
            if (result.success === "unpublished") {//ako je bio zahtjev za unpublish
                //promjenimo vrijednosti za tag za 2 buutona
                //console.log(btn_array[0].style.color);
                console.log('jeste unpublished Qiuuiz')
                const pathname = window.location.pathname;
                window.location.href = pathname;
                pubish_el.disabled = false;
            } else if (result.success === "published") {
                console.log('jeste published Qiuuiz')
                //dozvolimo opet klik
                const pathname = window.location.pathname;
                window.location.href = pathname;
                //dozvolimo opet klik
                pubish_el.disabled = false;
            } else {
                //ako je avtomatski unbublish sakrijemo Quiz Unpublish
                pubish_el.style.display = 'none';
                const message = result.message;
                create_message(message)
            }
        });
}