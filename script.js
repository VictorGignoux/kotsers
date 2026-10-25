let allQuestions = []; // All the questions
let randomizerScore; // The current score of the user
let totalQuestions; // The total number of questions
let nbQuestionsAnswered; // The number of questions answered by the user

const randomizerModules = [
    { name: "Module 1 : Votre première application Android", sections: [1, 2, 3] },
    { name: "Module 2 : Créer l'interface utilisateur d'une application", sections: [4, 5, 6] },
    { name: "Module 3 : Afficher des listes et utiliser Material Design", sections: [7, 8, 9] },
    { name: "Module 4 : Navigation et architecture des applications", sections: [10, 11, 12] },
    { name: "Module 5 : Se connecter à internet", sections: [13, 14] },
    { name: "Module 6 : Persistance des données", sections: [15, 16, 17] },
    { name: "Module 7 : WorkManager", sections: [18] }
];

document.addEventListener('DOMContentLoaded', function(){
    document.addEventListener('click', () => {
        if (randomInt(1,1000) === 1){
            freakyInteraction();
        }
    })
    if (document.cookie==="seenIt=true"){
        const buttonContainer = document.getElementById("spooky-button-container")
        buttonContainer.remove();
    }
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
            questions = section.querySelectorAll(".question");
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
                isCorrect = true;
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
                        if(randomizer){
                            // random pipe
                            let pipe = document.getElementById("pipe");
                            if(randomInt(0, 10) === 5)
                                pipe.play();
                        }
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
                if (randomizer===true)
                    randomizerScore++
                else
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

function randomizer(open){
    const randomizer = document.getElementById("randomizer");
    if(open===true){
        randomizer.style.display = "flex";
        showRandomizerSettings();
    } 
    else {
        // Clears the displayed values if randomizer is closed and opened again
        document.getElementById('randomizer-score').innerHTML=""
        document.getElementById("randomizer-remaining").innerHTML=""
        document.getElementById("randomizer-question").innerHTML=""
        document.getElementById("randomizer-question").style.display = "none";
        document.getElementById("randomizer-settings").style.display = "flex";

        randomizer.style.display = "none";

    }
}

function showRandomizerSettings(){
    const themes = document.getElementById("randomizer-themes");
    const sections = document.querySelectorAll(".section");
    const randomizerValidate = document.getElementById("randomizer-validate");
    const randomizerNext = document.getElementById("randomizer-next");

    themes.innerHTML = "";
    const sectionData = Array.from(sections).map(section => {
        const title = section.querySelector(".section-title");
        return title ? { id: title.id, name: title.textContent } : null;
    }).filter(Boolean);

    randomizerModules.forEach(moduleData => {
        const module = document.createElement("fieldset");
        module.className = "randomizer-module";
        module.innerHTML = `
            <legend>
                <label>
                    <input type="checkbox" class="randomizer-module-checkbox" checked>
                    ${moduleData.name}
                </label>
            </legend>
        `;

        const moduleThemes = document.createElement("div");
        moduleThemes.className = "randomizer-module-themes";
        moduleData.sections.forEach(sectionNumber => {
            const theme = sectionData[sectionNumber - 1];
            if (!theme) {
                return;
            }

            const label = document.createElement("label");
            label.className = "randomizer-theme";
            label.innerHTML = `
                <input type="checkbox" class="randomizer-theme-checkbox" value="${theme.id}" checked>
                <span>${theme.name}</span>
            `;
            moduleThemes.append(label);
        });
        module.append(moduleThemes);
        themes.append(module);

        const moduleCheckbox = module.querySelector(".randomizer-module-checkbox");
        let moduleWasIndeterminate = false;
        moduleCheckbox.addEventListener("mousedown", event => {
            moduleWasIndeterminate = moduleCheckbox.indeterminate;
            if (!moduleWasIndeterminate) {
                return;
            }

            event.preventDefault();
            moduleCheckbox.checked = false;
            moduleCheckbox.indeterminate = false;
            module.querySelectorAll(".randomizer-theme-checkbox").forEach(theme => {
                theme.checked = false;
            });
        });
        moduleCheckbox.addEventListener("click", event => {
            if (!moduleWasIndeterminate) {
                return;
            }
            event.preventDefault();
            moduleWasIndeterminate = false;
        });
        moduleCheckbox.addEventListener("change", () => {
            module.querySelectorAll(".randomizer-theme-checkbox").forEach(theme => {
                theme.checked = moduleCheckbox.checked;
            });
        });
        moduleThemes.addEventListener("change", event => {
            if (!event.target.classList.contains("randomizer-theme-checkbox")) {
                return;
            }
            const moduleThemesCheckboxes = module.querySelectorAll(".randomizer-theme-checkbox");
            const selectedThemes = module.querySelectorAll(".randomizer-theme-checkbox:checked");
            moduleCheckbox.checked = selectedThemes.length === moduleThemesCheckboxes.length;
            moduleCheckbox.indeterminate = selectedThemes.length > 0 &&
                selectedThemes.length < moduleThemesCheckboxes.length;
        });
    });

    document.getElementById("randomizer-settings-error").textContent = "";
    document.getElementById("randomizer-settings").style.display = "flex";
    document.getElementById("randomizer-question").style.display = "none";
    randomizerValidate.style.display = "none";
    randomizerNext.style.display = "none";
}

function selectRandomizerThemes(selected){
    document.querySelectorAll("#randomizer-themes input").forEach(theme => {
        theme.checked = selected;
        theme.indeterminate = false;
    });
}

function startRandomizer(){
    const selectedThemes = new Set(
        Array.from(document.querySelectorAll("#randomizer-themes .randomizer-theme-checkbox:checked"))
            .map(theme => theme.value)
    );

    if (selectedThemes.size === 0) {
        document.getElementById("randomizer-settings-error").textContent =
            "Sélectionnez au moins un thème pour commencer.";
        return;
    }

    allQuestions = Array.from(document.querySelectorAll(".section"))
        .filter(section => {
            const title = section.querySelector(".section-title");
            return title && selectedThemes.has(title.id);
        })
        .flatMap(section => Array.from(section.querySelectorAll(".question")));
    randomizerScore = 0;
    totalQuestions = allQuestions.length;
    nbQuestionsAnswered = 0;

    document.getElementById("randomizer-settings").style.display = "none";
    document.getElementById("randomizer-question").style.display = "block";
    document.getElementById("randomizer-validate").style.display = 'flex';
    document.getElementById("randomizer-next").style.display = 'none';
    reset();
    randomizer_add_question();
}

function randomInt(min, max) {
  const range = max - min + 1;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return min + (array[0] % range);
}

function randomizer_add_question(){
    const randomizer_next = document.getElementById("randomizer-next")
    const randomizer_question = document.getElementById("randomizer-question");
    const randomize_score = document.getElementById("randomizer-score");
    const randomize_remaining = document.getElementById("randomizer-remaining");

    if (nbQuestionsAnswered !== 0)
        randomize_score.innerHTML = `${randomizerScore}/${nbQuestionsAnswered} - ${(randomizerScore/nbQuestionsAnswered*100).toFixed(1)}%`

    if (allQuestions.length !== 0){
        randomize_remaining.innerHTML = `Plus que ${allQuestions.length} questions`
        nbQuestionsAnswered++
        let rand = randomInt(0, allQuestions.length - 1);
        const randomizer_validate = document.getElementById("randomizer-validate");
        randomizer_validate.style.display = 'flex';
        randomizer_next.style.display = 'none';

        randomizer_question.innerHTML = `<div class="question">${allQuestions[rand].innerHTML}</div>`;
        allQuestions.splice(rand, 1);

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
    else
    {
        randomizer_question.innerHTML =
            `
                <div id="randomizer-no-questions">
                    <h2>Plus de question!</h2>
                    <h3>Votre score est de ${randomizerScore}/${nbQuestionsAnswered}</h3>
                    <h3>Cela fait un taux de bonne réponse de ${(randomizerScore/nbQuestionsAnswered*100).toFixed(1)}%</h3>
                </div>
            `
        randomize_remaining.innerHTML="";
        randomize_score.innerHTML="";
        randomizer_next.style.display = 'none';
    }
}
function freakyButtonInteraction(){
    const buttonContainer = document.getElementById("spooky-button-container")
    freakyInteraction();
    setTimeout(() => {
        goto("top")
        buttonContainer.remove();
    }, 3500);

    document.cookie = "seenIt=true";
    console.log(document.cookie);

}
function freakyInteraction(){
    const img = document.getElementById("freaky-image");
    const audio = document.getElementById("spooky-audio");

    img.style.animation = "appearIn 5s";
    audio.play()
    img.addEventListener("animationend", () => {
        img.style.animation = "disappear 5s";
        img.addEventListener("animationend", () => {
            img.style.animation = "";
            audio.pause();
        })
    })
}