document.addEventListener('DOMContentLoaded', function(){
    sessionStorage.setItem('mode', 'test');
    const mode = sessionStorage.getItem('mode');

    const answers = document.querySelectorAll('.answers-item');
    const nb_answers = answers.length;

    const questions = document.querySelectorAll('.question');
    const nb_questions = questions.length;


    // valide ou pas quand on clique sur une question
    answers.forEach(answer => {
        answer.addEventListener('click', function(){
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

function validate(){
    sessionStorage.setItem("mode", "validate")
    const answers = document.querySelectorAll('.answers-item');
    answers.forEach(answer => {
        if (answer.classList.contains("selected")) {
            // séléctionné et correct
            if(answer.classList.contains('correct')){
                answer.style.backgroundColor = '#D6F1DF';
            } 
            // séléctionné et pas correct
            else {
                answer.style.backgroundColor = '#ff6767';
            }
        }
        else if(answer.classList.contains("correct")){
            answer.style.backgroundColor = '#caf1ff';
        }
    });
}

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

    // passe en mode réponses
    if(mode == 'test'){
        sessionStorage.setItem('mode', 'réponses');
        btn.innerHTML = "Répondre aux QCM";
        answers.forEach(answer => {
            answer.style.backgroundColor = '#FFF';
            answer.classList.remove('selected');
        });
        corrects.forEach((elm) => {
            elm.style.backgroundColor = '#D6F1DF';
        });

        button_validate.style.opacity = '0';
    }
    // passe en mode test
    else{
        sessionStorage.setItem('mode', 'test');
        btn.innerHTML = "Voir les réponses";
        answers.forEach(answer => {
            answer.style.backgroundColor = '#FFF';
            answer.classList.remove('selected');
        });
        corrects.forEach((elm) => {
            elm.style.backgroundColor = '#FFF';
        });

        button_validate.style.opacity = '1';
    }
}