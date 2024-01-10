//selektujemo elemennt - sve btne na index.html
const choose_quiz = document.querySelectorAll(".btn");
//url za login 
const url_home = "/home";

window.onload = function(){
    //dodamo listener na svaki button choose_quiz
    choose_quiz.forEach(function (el) {
        el.addEventListener('click', function() {
            //procitamo value(ime) za selektovani kviz
            const quiz_name = el.value
           //kreiramo request objekt na end point
            const xhr = new XMLHttpRequest();
            //podatci poslati sa nase web stranice uz pomoc FormData objekta
            const formData = new FormData();
            //FormData.append():Appends a new value onto an existing key
            //inside a FormData object, or adds the key if it does not already exist.
            formData.append('quiz-name', quiz_name);    //dodajemo quiz_name
            
            //dodamo listener na povrat sa servera
            xhr.onload = () =>{
                text = xhr.responseText;
                console.log('text: ', text);
                const data = JSON.parse(text)
                //Provjerimo jel napravljen objekt quiz_info uspjesno na serveru
                if (data.game_started === 'yes'){      
                    //uspjesno napravljen i predzemo na quiz.html
                    //To get base url in javascript           
                    var url = "/quiz"
                    // Navigate to the Location.reload article by replacing this page
                    window.location.replace(url)
                } 
            }//kraj xhr.onload
            //inicijaliziramo na open kao POST na url_log = '/home' 
            //i posljemo quiz-name za kogase na '/home' napravi objekt
            xhr.open('POST', url_home); 
            //saljemom POST request sa formData sadrzajem tj sa imenom kviza
            xhr.send(formData);    
        });
    });
}

 
