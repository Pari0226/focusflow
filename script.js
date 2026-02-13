const todayKey = new Date().toDateString();
let focusData = JSON.parse(localStorage.getItem("focusData")) || {};

const FULL_DASH = 691;

let focusTime = 25 * 60;
let breakTime = 5 * 60;

let timeLeft = focusTime;
let totalTime = focusTime;

let isRunning = false;
let isFocus = true;
let timer;
let sessions = 0;

/* display */

function updateDisplay() {
    let m = Math.floor(timeLeft/60);
    let s = timeLeft%60;

    document.getElementById("minutes").textContent = String(m).padStart(2,'0');
    document.getElementById("seconds").textContent = String(s).padStart(2,'0');

    let progress = FULL_DASH - (timeLeft/totalTime)*FULL_DASH;
    document.getElementById("progressRing").style.strokeDashoffset = progress;

    const t = document.querySelector(".time");
    t.classList.remove("tick");
    void t.offsetWidth;
    t.classList.add("tick");
}

/* controls */

function startTimer(){
    if(isRunning) return;
    isRunning=true;

    document.querySelector(".app").classList.add("running");

    timer=setInterval(()=>{
        timeLeft--;
        updateDisplay();
        if(timeLeft<=0) switchMode();
    },1000);
}

function pauseTimer(){
    clearInterval(timer);
    isRunning=false;
    document.querySelector(".app").classList.remove("running");
}

function resetTimer(){
    pauseTimer();
    timeLeft=totalTime;
    updateDisplay();
}

/* mode switching */

function switchMode(){
    clearInterval(timer);
    isRunning=false;
    document.querySelector(".app").classList.remove("running");

    if(isFocus){
        sessions++;
        document.getElementById("sessionCount").textContent=sessions;

        focusData[todayKey]=(focusData[todayKey]||0)+Math.floor(focusTime/60);
        localStorage.setItem("focusData",JSON.stringify(focusData));
        updateTodayStats();

        timeLeft=breakTime;
        totalTime=breakTime;
        document.getElementById("mode").textContent="BREAK ☕";
        document.getElementById("progressRing").style.stroke="#38bdf8";
    }else{
        timeLeft=focusTime;
        totalTime=focusTime;
        document.getElementById("mode").textContent="FOCUS 🎯";
        document.getElementById("progressRing").style.stroke="#22c55e";
    }

    isFocus=!isFocus;
    updateDisplay();

    document.querySelector(".app").classList.add("pulse");
    setTimeout(()=>document.querySelector(".app").classList.remove("pulse"),700);

    new Audio("https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg").play();
}

/* stats */

function updateTodayStats(){
    let minutes=focusData[todayKey]||0;
    document.getElementById("todayFocus").textContent=minutes;
}

/* init */

updateDisplay();
updateTodayStats();
