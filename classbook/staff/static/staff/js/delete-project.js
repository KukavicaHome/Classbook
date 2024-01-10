 
 
async function deleteProject(project_id){
    const operation = "Delete";
        //brisemo project asihrono
        url = '/staff/delete-project/';
        fetch(url, {
            method: 'POST',
            headers: {
                "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                'pk': project_id,
           }),
        }
        )
        .then(response => response.json())
        .then(result => {
            if (result.success === "yes"){
                let new_href = "/staff/projects/" ;
                console.log('result.success,new_href', result.success, )
                //console.log(new_href)
                window.location.href = new_href;
            }else{
                console.log('result.success:', result.success)
                let new_href = "/staff/projects/" ;
                //console.log(new_href)
                window.location.href = new_href;
            }
        })
    
}