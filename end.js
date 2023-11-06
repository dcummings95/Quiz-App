const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

const highScores = JSON.parse(localStorage.getItem("highscores")) || [];

const MAX_HIGH_SCORES = 5;
//console.log(highScores);

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
  saveScoreBtn.disabled = !username.value;
});

let saveHighScore = (e) => {
  console.log('Clicked the save btn');
  e.preventDefault();

  const score = {
    score: Math.floor(Math.random() * 100),
    name: username.value
  };
  //Add score, sort it, then splice to only be top 5
  highScores.push(score);
  highScores.sort( (a,b) => b.score - a.score);
  highScores.splice(5);
  //Save items into local storage
  localStorage.setItem("highscores", JSON.stringify(highScores));
  window.location.assign("/");
  //console.log(highScores);
};