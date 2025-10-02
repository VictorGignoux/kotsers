document.addEventListener('DOMContentLoaded', function(){
    sessionStorage.setItem('mode', 'test');

    answers = document.querySelectorAll('.answers-item');
    const nb_answers = answers.length;

    // select an answer in testing
    answers.forEach(answer => {
        answer.addEventListener('click', function(){
            const mode = sessionStorage.getItem('mode');
            if(mode === "test"){
                if(answer.classList.contains("selected")){
                    answer.classList.remove('selected');
                    answer.style.backgroundColor = '#FFFFFF';
                } else {
                    answer.classList.add('selected');
                    answer.style.backgroundColor = '#DDDDDD';
                }
            }
        });
    });
});

// validate answers and calcualte score for each section
function validate(randomizer=false){
    
    let total_score = 0;
    let total_answers = 0;

    // calculate score
    let sections;
    if(randomizer){
        sections = [document.getElementById("randomizer-question")];
    }
    else{
        sections = document.querySelectorAll(".section");
    }

    sections.forEach(section => {
        let questions;
        if(randomizer){
            questions = sections;
        }
        else{
            questions = section.querySelectorAll(".question");
        }
        let score = 0;
        const MAXSCORE = questions.length;
        total_answers += MAXSCORE;
        questions.forEach(question => {
            let isCorrect = true;
            const answers = question.querySelectorAll(".answers-item");
            if(answers.length == 0){
                // -------------------- TODO manage input questions -----------------------
                isCorrect = false;
            }
            // validate answer
            answers.forEach(answer => {
                if (answer.classList.contains("selected")) {
                    // selected and correct
                    if(answer.classList.contains('correct')){
                        answer.style.backgroundColor = '#D6F1DF';
                    } 
                    // selected but not correct
                    else {
                        answer.style.backgroundColor = '#ff6767';
                        isCorrect = false;
                    }
                }
                // missed answer
                else if(answer.classList.contains("correct")){
                    answer.style.backgroundColor = '#caf1ff';
                    isCorrect = false;
                }
            });
            // increase score if correct
            if(isCorrect){
                score++;
            }
        });
        if(!randomizer){
            const title_score = section.querySelector(".title-score");
            title_score.innerHTML = score + "/" + MAXSCORE;
            total_score += score;
        }
    });

    if(!randomizer){
        const total_score_span = document.getElementById("total-score");
        total_score_span.innerHTML = total_score + "/" + total_answers;
    }
    else{
        const randomizer_validate = document.getElementById("randomizer-validate");
        randomizer_validate.style.display = 'none';
        const randomizer_next = document.getElementById("randomizer-next");
        randomizer_next.style.display = 'flex';
    }
}

// slide to the selected section
function goto(id){

    if(id === "top"){
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    else{
        const section = document.getElementById(id);

        const position = section.offsetTop;

        window.scrollTo({
            top: position - 30,
            behavior: 'smooth'
        });
    }
}

function changeMode(){
    const mode = sessionStorage.getItem('mode');
    const btn = document.getElementById("mode");
    const corrects = document.querySelectorAll('.correct');
    const answers = document.querySelectorAll('.answers-item');
    const button_validate = document.getElementById("validate");
    const button_reset = document.getElementById("reset");
    const randomizer = document.getElementById('random');

    // passe en mode réponses
    if(mode == 'test'){
        sessionStorage.setItem('mode', 'réponses');
        btn.innerHTML = "Répondre au QCM";

        // show corrects answers
        answers.forEach(answer => {
            answer.style.backgroundColor = '#FFF';
            answer.classList.remove('selected');
        });
        corrects.forEach((elm) => {
            elm.style.backgroundColor = '#D6F1DF';
        });

        // hide validate button
        button_validate.style.opacity = '0';
        button_reset.style.opacity = '0';
        randomizer.style.opacity = '0';
    }
    // passe en mode test
    else{
        sessionStorage.setItem('mode', 'test');
        btn.innerHTML = "Voir les réponses";

        // remove selected answers
        answers.forEach(answer => {
            answer.style.backgroundColor = '#FFF';
            answer.classList.remove('selected');
        });
        corrects.forEach((elm) => {
            elm.style.backgroundColor = '#FFF';
        });

        // show validate button
        button_validate.style.opacity = '1';
        button_reset.style.opacity = '1';
        randomizer.style.opacity = '1';
    }
}

// restart the QCM
function reset() {
    const answers = document.querySelectorAll(".answers-item");
    answers.forEach(answer => {
        answer.style.backgroundColor = "#FFFFFF";
        answer.classList.remove("selected");
    });
    sessionStorage.setItem("mode", "test");
}

function getAnswers() {
    // get input parts
    const input = document.getElementById("answerer-input");
    const input_parts = input.value.toLowerCase().split(" ");

    // stop if input is empty
    if(input_parts[0] === ""){
        return
    }

    const questions = document.querySelectorAll(".question");

    const answerer_answers = document.getElementById("answerer-answers");
    answerer_answers.innerHTML = "";
    let current_score = 0;

    questions.forEach(question => {
        const title = question.querySelector(".question-title");
        const title_parts = title.innerHTML.toLowerCase().split(" ");

        let score = compare(title_parts, input_parts);

        if(score > current_score){
            current_score = score;
            answerer_answers.innerHTML = "";
        }

        if(score === current_score){

            // get answers
            const answers = question.querySelectorAll(".correct")

            // create box
            const answerer_item = document.createElement("div");
            answerer_item.classList.add("answerer-item")

            // add question title
            answerer_item.append(title.innerHTML)

            // add space
            let space = document.createElement('div');
            space.classList.add('space');
            answerer_item.append(space);

            // add answers
            answers.forEach(answer => {
                let elm = document.createElement("p");
                elm.innerHTML = answer.innerHTML;
                answerer_item.append(elm);
            });

            answerer_answers.append(answerer_item);
        }
    });
}

function compare(title, input){

    let match = 0;

    input.forEach(item => {
        if(title.includes(item)){
            match++;
        }
    });

    return match;
}

function randomizer(close_or_open){
    const randomizer = document.getElementById("randomizer");

    if(close_or_open === "open"){
        randomizer.style.display = "flex";
        randomizer_add_question();
        const randomizer_validate = document.getElementById("randomizer-validate");
        randomizer_validate.style.display = 'flex';
        const randomizer_next = document.getElementById("randomizer-next");
        randomizer_next.style.display = 'none';
        reset();
    } 
    else {
        randomizer.style.display = "none";
    }
}

function randomInt(min, max) {
  const range = max - min + 1;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return min + (array[0] % range);
}

function randomizer_add_question(){
    const randomizer_question = document.getElementById("randomizer-question");
    const questions = document.querySelectorAll(".question");
    let rand = randomInt(0, questions.length);

    const randomizer_validate = document.getElementById("randomizer-validate");
    randomizer_validate.style.display = 'flex';
    const randomizer_next = document.getElementById("randomizer-next");
    randomizer_next.style.display = 'none';

    randomizer_question.innerHTML = questions[rand].innerHTML;

    randomizer_question.querySelectorAll(".answers-item").forEach(answer => {
        answer.addEventListener('click', function(){
            const mode = sessionStorage.getItem('mode');
            if(mode === "test"){
                if(answer.classList.contains("selected")){
                    answer.classList.remove('selected');
                    answer.style.backgroundColor = '#FFFFFF';
                } else {
                    answer.classList.add('selected');
                    answer.style.backgroundColor = '#DDDDDD';
                }
            }
        });
    });
}