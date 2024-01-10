const input_username_el = document.getElementById('id_username');
 
const input_password_el = document.getElementById('id_password');

input_username_el.addEventListener('input', () => {
  input_username_el.value = input_username_el.value ? input_username_el.value.trimStart() : '' 
})

input_password_el.addEventListener('input', () => {
  input_password_el.value = input_password_el.value ? input_password_el.value.trimStart() : '' 
})

document.addEventListener('DOMContentLoaded', function(){
    console.log('Login');
    input_username_el.innerHTML = '';
    input_password_el.innerHTML = '';
});

//listening to submit
document.getElementById('submit_login').addEventListener('submit', (e) => {
  e.preventDefault()
  input_username_el.innerHTML = '';
  input_password_el.innerHTML = ''
  //e.preventDefault()
  //The Object.fromEntries() method takes a list of key-value pairs 
  //and returns a new object whose properties are given by those entries 
  const form_data = Object.fromEntries(new FormData(e.target).entries());
  const is_loginForm_OK = evaluate_login_Form(form_data);
  console.log('is_loginForm_OK',is_loginForm_OK)
  alert('U Submit')
  if(is_loginForm_OK === false){
    // ne mozemo da saljemo, popravimo unos
    e.preventDefault()
    e.stopPropagation()
  }
});

function evaluate_login_Form(form_data){
  username = form_data['username'];
  password = form_data['password'];
  if(username === ''){
    input_username_el.innerHTML = 'This field must be filled.';
    return false;
  }
  if(password ===''){
    input_password_el.innerHTML = 'This field must be filled.';
    return false;
  }
  return true;
}

function cancel_Registeer_Login(){
  const origin = window.location.origin;
  //console.log(new_href)
  window.location.href = origin;
}