let workTime = 25 * 60;
let breakTime = 5 * 60;
let longBreakTime = 15 * 60;
let cycles = 0;
let timer;
let isRunning = false;
let isWork = true;
let timeLeft = workTime;

const timerlabel = document.getElementById('timer-label');
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const shortBreakBtn = document.getElementById('short-break-label');
const longBreakBtn = document.getElementById('long-break-label');

function updateDisplay() {
    const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const sec = String(timeLeft % 60).padStart(2, '0');
    timerDisplay.textContent = `${min}:${sec}`;
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timer);
            isRunning = false;
            startBtn.textContent = 'Start';
            if (isWork) {
                cycles++;
                isWork = false;
                timeLeft = (cycles % 4 === 0) ? longBreakTime : breakTime;
            } else {
                isWork = true;
                timeLeft = workTime;
            }
            updateDisplay();
            startTimer();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = 'Resume';
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isWork = true;
    timeLeft = timeLeft;
    startBtn.textContent = 'Start';
    updateDisplay();
}
function pomodoro() {
    clearInterval(timer);
    isRunning = false;
    isWork = true;
    timeLeft = workTime;
    startBtn.textContent = 'Start';
    updateDisplay();
}
function shortbreak() {
    clearInterval(timer);
    isRunning = false;
    isWork = false;
    timeLeft = breakTime;
    startBtn.textContent = 'Start';
    updateDisplay();
}
function longbreak() {
    clearInterval(timer);
    isRunning = false;
    isWork = false;
    timeLeft = longBreakTime;
    startBtn.textContent = 'Start';
    updateDisplay();
}
startBtn.addEventListener('click', function (){
    if(!isRunning){
        startBtn.textContent = 'Pause';
        startTimer();
    } else {
        pauseTimer();
    }
});


shortBreakBtn.addEventListener('click', shortbreak);
longBreakBtn.addEventListener('click', longbreak);
timerlabel.addEventListener('click' , pomodoro);
const clicksound = document.getElementById("click-sound")
startBtn.addEventListener('click', () => {
    clicksound.currentTime = 0;
    clicksound.play();
});


updateDisplay();