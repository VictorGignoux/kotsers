document.addEventListener('DOMContentLoaded', function(){
    sessionStorage.setItem('mode', 'test');

    const answers = document.querySelectorAll('.answers-item');
    const nb_answers = answers.length;

    const questions = document.querySelectorAll('.question');
    const nb_questions = questions.length;

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
function validate(){
    sessionStorage.setItem("mode", "validate")
    const answers = document.querySelectorAll('.answers-item');

    let total_score = 0;
    let total_answers = 0;

    // calculate score
    const sections = document.querySelectorAll(".section");
    sections.forEach(section => {
        const questions = section.querySelectorAll(".question");
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
        const title_score = section.querySelector(".title-score");
        if(title_score == null){
            console.log(section);
        }
        title_score.innerHTML = score + "/" + MAXSCORE;
        total_score += score;
    });

    const total_score_span = document.getElementById("total-score");
    total_score_span.innerHTML = total_score + "/" + total_answers;
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

    // passe en mode réponses
    if(mode == 'test' || mode == 'validate'){
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
    const input_parts = input.value.split(" ");

    const questions = document.querySelectorAll(".question");

    const answerer_answers = document.getElementById("answerer-answers");
    answerer_answers.innerHTML = "";
    
    questions.forEach(question => {
        const title = question.querySelector(".question-title");
        const title_parts = title.innerHTML.split(" ");

        if(compare(title_parts, input_parts)){

            console.log(title)

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

    let match = false;
    let i = 0;
    while(match == false && i < input.length){
        if(title.includes(input[i])){
            return true
        }
        i++;
    }

    return false;
}