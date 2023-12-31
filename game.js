const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('scoreText');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

//Helper function to decode HTML entities
function decodeHtml(html) {
  var txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

//Promise to get the questions from json file
fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
  .then(res => {
    return res.json();
  })
  .then(loadedQuestions => {
    console.log(loadedQuestions.results);
    //use map to fetch API data
    questions = loadedQuestions.results.map(loadedQuestion => {
      const formattedQuestion = {
        question: decodeHtml(loadedQuestion.question)
      };

      const answerChoices = loadedQuestion.incorrect_answers.map(answer => decodeHtml(answer));
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1, //Correct the index when splicing
        0, 
        decodeHtml(loadedQuestion.correct_answer)
      );
      //Iterate through the answer choices, get each choice and their index
      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      return formattedQuestion;
    });
    startGame();
  })
  .catch(err => {
    console.error(err);
  });

//CONSTANTS 
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

let startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  console.log(availableQuestions);
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

let getNewQuestion = () => {
  if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
    localStorage.setItem('mostRecentScore', score);
    //go to the end page 
    return window.location.assign("/end.html");
  }
  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  //Update the progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach(choice => {
    const number = choice.dataset['number'];
    choice.innerText = currentQuestion['choice' + number];
  });

  availableQuestions.splice(questionIndex, 1);
  console.log(availableQuestions);
  acceptingAnswers = true;
};

choices.forEach(choice => {
  choice.addEventListener('click', e => {
    if(!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset['number'];

    let classToApply = "incorrect";
      if(selectedAnswer == currentQuestion.answer) {
        classToApply = "correct";
      }
      if(classToApply === "correct") {
        incrementScore(CORRECT_BONUS);
      }

    //Adding a class to the answer
    selectedChoice.parentElement.classList.add(classToApply);
    //Use set timout to give a bit of a delay to remove the class

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

let incrementScore = num => {
  score += num;
  scoreText.innerText = score;
}

