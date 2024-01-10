document.addEventListener('DOMContentLoaded', function(){
 
    console.log("U staff/projects" )
    
});
 
 
function dipslayProject(id){
    const origin = window.location.origin;
    let new_href = origin + "/staff/get-project/" + id + "/";
    console.log(new_href)
    window.location.href = new_href;
}
 
  function createProjectForm(){
    const origin = window.location.origin;
    let new_href = origin + "/staff/create-project/" ;
    console.log(new_href)
    window.location.href = new_href;
}

