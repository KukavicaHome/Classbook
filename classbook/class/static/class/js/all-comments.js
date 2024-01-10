let prject_id;
document.addEventListener('DOMContentLoaded', function () {
    console.log('U all-comments')
    const pathname = window.location.pathname;
    var url_str = window.location.pathname; // za http://127.0.0.1:8000/staff/get-project/10/ imamo ['', 'staff', 'get-project', '10', '']
    var arr = url_str.split('/');
    //console.log('arr', arr)
    // u slucaju da abdejtujemo dobijemo id za project iz pathname
    project_id = arr[3]
});

//otkl;nimo pocetni razmak u unosu
const comment_textarea_el = document.getElementById('comment_textarea');
comment_textarea_el.addEventListener('input', () => {
    console.log('U comment_textarea_el')
    comment_textarea_el.value = comment_textarea_el.value ? comment_textarea_el.value.trimStart() : ''
})

function getCookie(name) {
    const value = `: ${document.cookie}`;
    const parts = value.split(`: ${name}=`);
    if (parts.length == 2) {
        return parts.pop().split(':').shift();
    }

}

function hide_post_Modal(id) {
    ///modal 
    const modal = document.getElementById(`modal_edit_post_${id}`);
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

//korigira vrjednost za textaria nakon sto je klikmut close
function correct_Value(id) {
    const modal_textAreaValue_el = document.getElementById(`text-aria_${id}`);
    //div saa kommentarom za comment koji se edituje
    const content_el = document.getElementById(`content_${id}`);
    //Original comment
    const comment = content_el.innerHTML;
    //console.log('U correct_Value, comment', comment)
    //promjenimo cijeli element u modal-body
    const modal_body_el = document.getElementById(`modal-body-${id}`);
    modal_body_el.innerHTML = `'<textarea name="content" id="text-aria_{{ comment.id }}" cols="50"rows="3"> ${comment}</textarea>'`;
}
//Posaalje na server editovan comment
async function edit_Comment(id) {
    comment_id = id;
    document.getElementById(`comment_alert_${id}`).innerHTML = '';
    console.log('U edit_Comment(),id,', id)
    const modal_textAreaValue_el = document.getElementById(`text-aria_${id}`);
    // textAreaValue za modal i vrijednos promjene ako je
    const _textAreaValue = modal_textAreaValue_el.value;
    console.log("content, id", _textAreaValue, id);
    var textAreaValue;
    if (_textAreaValue.length > 0) {
        textAreaValue = _textAreaValue.trim();
    }

    //div saa kommentarom za post koji se edituje
    const content_el = document.getElementById(`content_${id}`);

    ///modal 
    //const modal = document.getElementById(`modal_edit_post_${id}`);
    //Ako je znakova vise od 200 ili nuula --> ponovi unos
    if (textAreaValue.length > 200) {
        document.getElementById(`comment_alert_${id}`).innerHTML = 'Your comment has more then 200 characters.';
        return;
    } else if (textAreaValue.length == 0) {
        document.getElementById(`comment_alert_${id}`).innerHTML = 'Your comment has no characters.';
        return;
    }
    //setting the csrf token on a request to django.

    url = '/class/edit-comment/' + id;
    fetch(url, {
        method: 'POST',
        headers: {
            "X-CSRFToken": getCookie("csrftoken"),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ content: textAreaValue })
    }
    )
        .then(response => response.json())
        .then(result => {
            if (result.susses == 'yes') {
                console.log("content", textAreaValue);
                content_el.innerHTML = textAreaValue;
                modal_textAreaValue_el.innerHTML = textAreaValue;
                //sakri modale
                hide_post_Modal(id);
            } else {
                console.log('Updejtovanje komentara neuspjesno');
                hide_post_Modal(id);
            }

        })
}   //kraj save_changesHandler



function evaluateContent(comment) {
    if (comment.length > 200) {
        document.getElementById('comment_alert').innerHTML = 'Your comment has more then 200 characters.';
        return false;
    } else if (comment.length == 0) {
        document.getElementById('comment_alert').innerHTML = 'Your comment has no characters.';
        return false;
    } else {
        return true;
    }
}

//posalje comment na server
form.addEventListener('submit', (e) => {
    document.getElementById('comment_alert').innerHTML = '';
    const form_data = Object.fromEntries(new FormData(e.target).entries());
    //console.log('form_data za poslati', form_data)
    //alert('U Submit')
    //console.log("U Submit, e:",e)
    const content = form_data['content'];
    if (content.length > 0) {
        content = content.trim();
    }

    const evaluate_content = evaluateContent(content);
    console.log('content', content)

    if (evaluate_content === false) {
        e.preventDefault();
        e.stopPropagation();
    }
    //alert('U Submit')
})

//sakrije delete modal
function hide_delete_Modal(id) {
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

//Brise kooment na serveru
async function delete_Comment(id, prject_id) {
    document.getElementById('comment_alert').innerHTML = '';
    console.log('U delete comment')
    //hide_delete_Modal(id)
    //brisemo project asihrono
    url = '/class/delete-comment/' + id;
    fetch(url, {
        method: 'GET',
        headers: {
            "X-CSRFToken": getCookie("csrftoken"),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    }
    )
    .then(response => response.json())
    .then(result => {
        if (result.success === "yes") {
            const comment_div_el = document.getElementById(`comment-div-${id}`);
            const origin = window.location.origin;
            const new_href = origin + "/class/all-project-comments/" + prject_id;;
            //console.log(new_href)
            window.location.href = new_href;
            comment_div_el.style.display = 'none';
            
        } else {//sa servera dobije obavjest
            console.log('result.success:', result.success)
            const origin = window.location.origin;
            const new_href = origin + "/class/all-project-comments/" + prject_id;;
            //console.log(new_href)
            window.location.href = new_href;
        }
    })        
}

function go_to_Project() {
    const origin = window.location.origin;
    let new_href = origin + "/class/project/" + project_id ;
    window.location.href = new_href;
  }

