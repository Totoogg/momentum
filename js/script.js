import playList from './playList.js';

const time = document.querySelector('.time');
const date = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const name = document.querySelector('.name');
const body = document.querySelector('body');
const sliderNext = document.querySelector('.slide-next');
const sliderPrev = document.querySelector('.slide-prev');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');
const changeQuote = document.querySelector('.change-quote');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const play = document.querySelector('.play');
const playNextAudio = document.querySelector('.play-next');
const playPrevAudio = document.querySelector('.play-prev');
const playListContainer = document.querySelector('.play-list');


let randomNum = getRandomNum();
let isPlay = false;
let playNum = 0;

const audio = new Audio();

playList.forEach(el => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = `${el.title}`;
    playListContainer.append(li);
})



function showDate() {
    let reallyDate = new Date();
    let options = {weekday: 'long', month: 'long', day: 'numeric'}; 
    date.textContent = reallyDate.toLocaleDateString('en-US', options);
}

function showTime() {
    let reallyTime = new Date();
    time.textContent = reallyTime.toLocaleTimeString();
    showDate();
    showGreeting();
    setTimeout(showTime, 1000);
}

function getTimeOfDay() {
    let dateHours = new Date();
    let hours = dateHours.getHours();

    if (hours >= 0 && hours < 6) {
        return 'night';
    } else if (hours > 6 && hours < 12) {
        return 'morning';
    } else if (hours > 12 && hours < 18) {
        return 'day';
    } else {
        return 'evening';
    }
}

function showGreeting() {
    let hours = getTimeOfDay();
    greeting.textContent = `Good ${hours} `;
}

function setLocalStorage() {
    localStorage.setItem('name', name.value);
}

function getLocalStorage() {
    if (localStorage.getItem('name')) {
        name.value = localStorage.getItem('name');
    }
}

function getRandomNum() {
    return Math.floor(Math.random() * 21 + 1);
}

function setBg() {
    const img = new Image();
    let timeOfDay = getTimeOfDay();
    let bgNum = `${randomNum}`.padStart(2, 0);
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    img.onload = () => {
        body.style.backgroundImage = `url(https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg)`;
    };
}

function getSliderNext() {
    if (randomNum === 20) {
        randomNum = 1;
    } else {
        ++randomNum;
    }
    setBg();
}

function getSliderPrev() {
    if (randomNum === 1) {
        randomNum = 20;
    } else {
        --randomNum;
    }
    setBg();
}

async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=b29dd3ddd200eaf36840a09d42ca43a9&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp}°C`;
    weatherDescription.textContent = data.weather[0].description;
}

async function getQuotes() {
    const quotes = `/js/data.json`;
    const res = await fetch(quotes);
    const data = await res.json(); 
    let random = Math.floor(Math.random() * data.length);

    quote.textContent = data[random].text;
    author.textContent = data[random].author;
}

function playAudio() {
    audio.src = playList[playNum].src;
    if (!isPlay) {
        audio.currentTime = 0;
        audio.play();
        isPlay = true;
    } else {
        audio.pause();
        isPlay = false;
    }
    toggleBtn();
}

function toggleBtn() {
    if (!isPlay) {
        play.classList.remove('pause');
    } else {
        play.classList.add('pause');
    }
}

function playNext() {
    playNum++;
    isPlay = false;

    if ((playList.length) === playNum) {
        playNum = 0;
    }
   
    playAudio();
}

function playPrev() {
    playNum--;
    isPlay = false;

    if (0 === playNum) {
        playNum = playList.length;
    }

    playAudio();
}

sliderNext.addEventListener('click', getSliderNext);
sliderPrev.addEventListener('click', getSliderPrev);

city.addEventListener('change', getWeather);

changeQuote.addEventListener('click', getQuotes);

play.addEventListener('click', playAudio);
playNextAudio.addEventListener('click', playNext);
playPrevAudio.addEventListener('click', playPrev);

showTime();
setBg();
getWeather();
getQuotes();

window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);