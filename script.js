document.addEventListener('DOMContentLoaded', function(){
    sessionStorage.setItem('mode', 'test');
    const mode = sessionStorage.getItem('mode');

    const answers = document.querySelectorAll('.answers-item');

    answers.forEach(answer => {
        answer.addEventListener('click', function(){
            if(mode === "test"){
                answer.classList.add('selected');
                if (answer.classList.contains('correct')) {
                    answer.style.backgroundColor = '#D6F1DF';
                }
                else{
                    answer.style.backgroundColor = '#ff6767';
                }
            }
        });
    });
});

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

    if(mode === 'test'){
        sessionStorage.setItem('mode', 'réponses');
        btn.innerHTML = "Répondre aux QCM";
        answers.forEach(answer => {
            answer.style.backgroundColor = '#FFF';
            answer.classList.remove('selected');
        });
        corrects.forEach((elm) => {
            elm.style.backgroundColor = '#D6F1DF';
        });
    }
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
    }
}