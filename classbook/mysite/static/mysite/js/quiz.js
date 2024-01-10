//varijabla za grupu buttona
let correctAnswer;
//varijabla url za quiz.json
const get_json = '/get_json';
const submit = '/quiz'
// varijabla za folder za slike
//let pict_folder;
//varijabla za taimer
let timeValue = 30;
let counter;
let optionClicked;
let time;
//variabla za broj pitanja
let br_pitanja = 5;
//varijabla za rezultat igre
const game = {
    score: 0,
    counter: 0
}
//varijabla za 5 pitanja izbranih randomli iz niza koji se dobije sa fetch()
let rundom5Questions;
const score = document.querySelector("#score")
//selecting all required elements
//block begin
const begin = document.querySelector("#begin");
const start_button = document.querySelector("#start_button");
const vrijeme_pitanja = document.querySelector("#vrijeme_pitanja")
vrijeme_pitanja.innerHTML = timeValue   //dinamicki vrijeme za jedno pitanje
//block play
const play = document.querySelector("#igra");
const timeCount = document.querySelector(".timer_sec");
const option_list = document.querySelector('.option_list');
const output_que = document.querySelector('#question');
const nmb_of_question = document.querySelector('#nmb_of_question');
const broj_pitanja = document.querySelector(".br_pitanja")
const br_svih_pitanja = document.querySelector("#br_svih_pitanja");
const next_finish_btn = document.querySelector('#next_finish_button');
const loading_image = document.querySelector("#loading_image");
//block finish
const finish = document.querySelector("#finish");
const restart = document.querySelector('.restart');
const submit_btn = document.querySelector('.submit');
//const quiz_name = document.querySelector("#quiz_name")
const pic_holder = document.querySelector('.picture');

let data;
let project_id;
/*Kad se page lodira pocne Quiz*/
//samo kad se lodira
document.addEventListener('DOMContentLoaded', function () {
    //podatci za kviz u js obliku

    //nakon sto lodira json pocne prikaz ui-a
    begin.style.display = 'block';  //prikaze pocetak
    //pozovemo funkciju koja ce lodirati quiz_info kao json sa servera
    const pathname = window.location.pathname;
    var url_str = window.location.pathname; // za http://127.0.0.1:8000/staff/get-project/10/ imamo ['', 'staff', 'get-project', '10', '']
    var arr = url_str.split('/');
    //console.log('arr', arr)
    // u slucaju da abdejtujemo dobijemo id za project iz pathname
    project_id = arr[2]
    const origin = window.location.origin;
    const url = '/get-quiz/' + project_id + '/';
    //console.log('url_str,url:, pathname', url_str, url, pathname)
    data = fetch_Data(url);
    //console.log('quiz data, origin', data)
});//kraj onload

//lodiramo json(quiz_info) sa servera
async function fetch_Data(url) {
    //fetch npr : /staff/publish-project/1
    fetch(url, {
        method: 'GET',
        headers: {
            "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    }
    ).then(response => response.json())
        .then(result => {
            if (result) {
                //console.log('u fetch_Data', result.list_dict)
                data = result.list_dict;
                //console.log('data(0)', data[0])
            } else {
                // ako je  greska
                window.location.href = "/greska?problem=Premali broj pitanja za kviz.&location='files_managing.py, get_dict_list()'";
            }

        });
}

//funkcija za novi pocetak Quiz-a kad se klikne na restart
startQuiz = function () {
    play.style.display = 'none';    //sakrije paly blok na pocetku
    finish.style.display = 'none';  //sakrije finish blok na pocetku
}

//----------------------->Funkcije za igranje Quiza
start_button.addEventListener('click', function () {

    begin.style.display = 'none';   //sakrije begin blok 
    play.style.display = 'block';   //prikaze play block
    next_finish_btn.style.display = 'none'; //sakrijemo finish buuton u bloku play
    //objekt za igranje quiza izvucemo iz data kojesmo dobili sa servera
    let quiz = data;
    rundom5Questions = []   //za ponovnu igru izpraznim niz ojekata
    // napunimo niz rundom5Questions sa 5 objekata
    randomArrOf5Objects(quiz)
    // kreiramo novi objekt koji ukljucuje i podatke za score i counter
    //za submission
    const temp = {
        total: rundom5Questions.length,    //ukupan broj pitanja
        q: rundom5Questions,
        score: 0,
        counter: 0
    };

    createQuestion(temp);   //ne treba nam globalno object za data
});

//kreiramo questions dinamicki- za vrijemedok korisnik napreduje u igri
function createQuestion(temp) {
    //klikom na next se predze na sledece pitanje
    next_finish_btn.onclick = () => {
        createQuestion(temp);   //kreira nove opcije
    }
    //procitamo i odstranimo prvi clan(objekt) iz niza: data.q tj temp.q
    const question = temp.q.shift();
    game.counter++; //povecamo counter clan u objektu game za 1
    nmb_of_question.innerHTML = game.counter;   //prikazemo vrijednost   
    broj_pitanja.innerHTML = br_pitanja;
    next_finish_btn.style.display = 'none';    //sakrijemo next_btn
    outputQuestion(question);
}

//funkcija za prikaz pitanja
function outputQuestion(question) {
    //prikaz pitanja
    output_que.textContent = question.question + '?';
    //output option array
    let arr = [];
    //napunimo arr sa question.opt nizom
    for (let i = 0; i < question.opt.length; i++) {
        arr.push(question.opt[i])
    }
    //dodamo i odgovor u option array
    arr.push(question.answer);
    //rendemiziranje niza opcija
    arr.sort(() => {
        return (Math.random() - 0.5);
    });
    //vidimo koliko je child u parent
    let numb = option_list.childElementCount;
    //odstranimo predhodne opcije child
    if (numb >= 0) {
        option_list.innerHTML = '';
        //Nakon sto se postave opcije i slike podesimo timer
        timeCount.style.display = 'block'; //prikaze block za vrijeme
        //timeText.classList.remove('time_off');  //odstrani klasu za prikaz crveno
        //timeText.textContent = "Preostalo Vrijeme";
        clearTimeout(counter)//ako juzer prebrzo klika
        timeCount.textContent = timeValue; //zbog boljeg utiska za usera  
    }
    //tacan odgovor
    correctAnswer = question.answer;
    //sad kreiramo svaki button kao opciju
    arr.forEach(e => {
        //ispraznimo mjesto za sliku

        optionClicked = false;
        const optemp = pageEles(option_list, 'p', e, 'btns');//button za opciju
        optemp.style.display = 'block';
    })
    startTimer(timeValue);
}

//funkcija za page elemente za dodati u main
//funkcija za page elemente za dodati u main
//parametri su : parent , tip(t), sadrzaj(html) i class za element(c)
function pageEles(parent, t, html, c) {
    const ele = document.createElement(t);  //kreira el t
    ele.textContent = html;   //sadrzaj elementa
    ele.classList.add(c);   //dodamo vrijednost class-e u element
    if (c === 'btns') {
        ele.setAttribute("onclick", "optionSelected(this)");
    }
    //umetnemo element na stranicu
    return parent.appendChild(ele);
}

//klikom na Replay Quiz , ponovi se Quiz
restart.onclick = function () {
    option_list.innerHTML = '';
    finish.style.display = 'none';  //sakrije finish blok na pocetku
    begin.style.display = 'block';   //prikaze begin blok 
    //updejtujemo object game
    game.score = 0;
    game.counter = 0;
    next_finish_btn.textContent = 'Next question'
    startQuiz();
}
 
//submission(predaja) rezultata quiza
submit_btn.onclick = function () {
    const url = "/class/submit-quiz/" + project_id + "/";
    //fetch npr : /staff/publish-project/1
    fetch(url, {
        method: 'POST',
        headers: {
            "X-CSRFToken": document.getElementsByName('csrfmiddlewaretoken')[0].value,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            'score': game.score,  //dodajemo podatke
            'max_score': game.counter,//dodamo jos jedan podatak za poslati
        }),
    }
    )
        .then(response => response.json())
        .then(result => {
            if (result.success === "yes") {//ako je bio zahtjev za unpublish
                const origin = window.location.origin;
                console.log('predaje kviza uspjela');
                window.location.href = origin + '/class/submissions';
            } else {
                console.log('greska kod predaje kviza');
                //greska
                alert('Submissen is not succeeded')
            }
        });
}



// creating the new tags for icons
let tickIconTag = '<span class="icon tick"><i class="fas fa-check"></i></span>';
let crossIconTag = '<n class="icon cross"><i class="fas fa-times"></i></span>';

//Option selected
function optionSelected(answer) {
    optionClicked = true;
    let userAns = answer.textContent; //getting user selected option
    if (correctAnswer == userAns) {
        game.score++;   //povecamo rezultat  
        //----score.textContent = game.score;  //prikazemo score   
        //promjeni boju izabrani tacan button
        answer.classList.add('correct');
    }
    else {
        //promjeni boju izabrani tacan button
        answer.classList.add('incorrect');
        //answer.textContent = answer.textContent + ' is your answer';
        //doda cross icon na netacno izabrani odgovor
        answer.insertAdjacentHTML("beforeend", crossIconTag);
    }
    const option_list = document.querySelector('.option_list');
    //deselektujemo 
    const temps = option_list.querySelectorAll('.btns');
    temps.forEach(el => {
        el.classList.add('disabled'); //onemoguci klikanje
        //pronadze button sa tacnim odgovorom i ofarba u zeleno
        if (correctAnswer == el.textContent) {
            //promjeni boju za izabrani tacan button 
            correctEl = el;
            el.classList.add('correct');
            //el.textContent = el.textContent + ' is correct answer';
            //doda tick icon na tacno izabrani odgovor
            el.insertAdjacentHTML("beforeend", tickIconTag);
        }
    })
    //nakon sto je kliknut corektan odgovor, prikaze se next button
    next_finish_Button();
}

//funkcija za prikaz rezultata
function displayResult() {
    //provjerimo jeli korisnik student ili teacher
    const is_student = document.getElementById('is_student').innerText;
    if (is_student != 'True') {
        //ako nije student ne moze predati rezultat
        submit_btn.style.display = 'none';
    }
    score.innerHTML = game.score;  //prikazemo score  
    br_svih_pitanja.innerHTML = br_pitanja;
    play.style.display = 'none';
    finish.style.display = 'block';
    finish.classList.add('centered');   //dodamo vrijednost class-e u element
}

//funkcija za prikaz timer-a
function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time; //changing the value of timeCount with time value
        time--; //decrement the time value
        if (time < 9) { //if timer is less than 9
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero; //add a 0 before time value
        }
        if (time < 1) { //if timer is less than 0

            clearInterval(counter); //clear counter

            const allOptions = option_list.children.length; //getting all option items

            const temps = option_list.querySelectorAll('.btns');
            temps.forEach(el => {
                el.classList.add('disabled'); //onemoguci klikanje
            })
            clearTimeout(counter);//zaustavi vrijeme
            //prikaz ili next ili finish buttona
            next_finish_Button();
        }
        if (optionClicked == true) {//ako je kliknuta opcija
            clearTimeout(counter);//zaustavi vrijeme
        }
    }
}

//helper function
function next_finish_Button() {
    if (game.counter < br_pitanja) {
        next_finish_btn.style.display = 'block';
    } else {
        next_finish_btn.style.display = 'block';  //prikazemo button za zavrsiti quiz
        next_finish_btn.textContent = 'Complete the Quiz';
        next_finish_btn.onclick = displayResult;  //dodamo listener na finish_button
    }
}

//Funkcija randomli kreira niz od 5 objekata
function randomArrOf5Objects(data) {
    //duzina niza objekat 
    const length_data = data.length;
    if(length_data < br_pitanja){
        br_pitanja = length_data
    }
    //kriramo niz niz slucajnih brojeva od 0 do (length_data - 1)
    var randomNumberArr = [];
    //Napunimo niz randomNumberArr sa 5 slucajnih brojeva 
    let i = 0;
    while (i < br_pitanja) {
        //number between min (included) and max = length_data(excluded):
        let randomNumber = Math.round(Math.random() * (length_data - 1));
        if (!randomNumberArr.includes(randomNumber)) {
            randomNumberArr.push(randomNumber);
            i++;
        }
    }

    //napunimo rundom5Questions niz sa objektima
    for (let i = 0; i < br_pitanja; i++) {
        let object = data[randomNumberArr[i]];
        rundom5Questions.push(object);
    }
}