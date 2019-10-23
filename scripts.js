const startGame = document.querySelector('.start');
const login = document.querySelector('#login');
const form = document.querySelector('form');
const modal = document.getElementById('simpleModal');
const modalBtn = document.getElementById('modalBtn');
const closeBtn = document.getElementsByClassName('closeBtn')[0];
const game = document.getElementById('game');

const cards = document.querySelectorAll('.card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let turns = 0;
let score = 0;

const soundForCardFlip = new Audio('assets/sound/flipsound.mp3');
const soundForCardsMatch = new Audio('assets/sound/correctflip.mp3');
const soundForNoMatchingCard = new Audio('assets/sound/badflip.mp3');

let ingameMusic = new Audio('assets/sound/in-game.mp3');
var bgMusic = new Audio ('assets/sound/gotbgmusic.mp3');
let losingSound = new Audio('assets/sound/losingsound.mp3');
let winningSound = new Audio('assets/sound/winsound.mp3');
let youWon = document.getElementById('youWon');
let playBtn = document.getElementById('playAgain');
let display = document.getElementById("time-remaining").textContent;
let timeLimit = 60;
let interval;



soundForCardsMatch.volume = 0.3;
soundForNoMatchingCard.volume = 0.3;
soundForCardFlip.volume = 0.3;


bgMusic.volume = 0.05;
bgMusic.loop = true;
bgMusic.autoplay = true;
ingameMusic.loop = true;
    
    
   
    
    
    
    
    document.getElementById("iconYes").addEventListener("click", function off(){
        document.getElementById("iconYes").style.display = "none";
        document.getElementById("iconNo").style.display = "inline";
        bgMusic.volume = 0;
        ingameMusic.volume = 0;
      });

    document.getElementById("iconNo").addEventListener("click", function on(){
        document.getElementById("iconNo").style.display = "none";
        document.getElementById("iconYes").style.display = "inline";
        bgMusic.volume = 0.1;
        ingameMusic.volume = 0.1;
        bgMusic.autoplay = true;
      });
      
      
      
      
      
function openModal(){
    closeBtn.addEventListener('click',closeModal);
    window.addEventListener('click', closeOutside);
    modal.style.display = 'block';
    clearInterval(timer);
    bgMusic.pause();
    ingameMusic.pause();
    
}
function closeModal(){
    modal.style.display = 'none';
    bgMusic.play();
}
function closeOutside(e){
    if(e.target == modal){
        modal.style.display = 'none';
        bgMusic.play();
    }
}
startGame.addEventListener('click', hide);
login.addEventListener('submit', e => {
    ingameMusic.play();
    bgMusic.pause();
    e.preventDefault();
    hide();    
});

function hide(){
    if(form.userid.value.length !== 0){
        document.getElementById("login").className = "hide";
        username = document.getElementById('username').value;
        document.getElementById('player').innerHTML = 'For the Westeros ' + username + '!';
    }else{
        openModal();
        clearInterval(timer);
    }
}

function flipCard() {
    if (lockBoard) return;
    soundForCardFlip.play();
    if (this === firstCard) return;
    this.classList.add('flip');
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.picture === secondCard.dataset.picture;
    if (isMatch) {
        soundForCardsMatch.play();
        score += 2;
        turning();
        disableCards();
    }

    else {
        turning();
        unflipCards();
        soundForNoMatchingCard.play();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
    levels();
}


function levels(){
    if(score === 10 || score === 28) {
        document.getElementById("game").style.display = "block";
        clearInterval(timer);
        playBtn.addEventListener('click', () => {
            document.getElementById("youWon").style.display = "none";    
        });
    } 
    if (score === 10){
        turns = 0;
        document.getElementById("game").style.display = "none";
        document.getElementById("youWon").style.display = "block";
        
        
        ingameMusic.volume = 0;
        winningSound.play();
    }
}



function turning() {
    if(turns < 29){
        turns ++;
    }
    
    else{
        document.getElementById("gameover").style.display = "block";
        ingameMusic.volume = 0;
        losingSound.play();
    }

    document.getElementById('turns').innerText = 'Turns: ' + turns;
    lockBoard = true;
}


function unflipCards() {
    
    var unflipping = setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1100);
}


function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

(function shuffle() {
        cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 24);
        card.style.order = randomPos;
    });
})();

cards.forEach(card => card.addEventListener('click', flipCard));



let timer;

function countDown(i, callback) {
        timer = setInterval(function() {
        document.getElementById("time-remaining").innerHTML = "Time: " + i;
        i-- || (clearInterval(timer), callback());
    }, 1000);
}

$("#modalBtn").on("click", function(){
    countDown(60, function(){
        document.getElementById("gameover").style.display = "block";
        ingameMusic.volume = 0;
        losingSound.play();
        
    });
});


$("#playAgain").click(function(){
    // clearInterval(timer);
    document.getElementById("time-remaining").innerHTML = "Time: " + 100;
    countDown(99, function(){
        document.getElementById("gameover").style.display = "block";
    });
});


//losing
document.getElementById("tryAgain").addEventListener("click", function(){
    document.location.reload();
});

//winning
document.getElementById("playAgain").addEventListener("click", function(){
   document.location.reload();
});
