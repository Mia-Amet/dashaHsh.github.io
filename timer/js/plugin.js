let numberFormat = new Intl.NumberFormat('en-En', {minimumIntegerDigits: 2, maximumFractionDigits: 0});

const timer = (function () {
    let countdown,
        timerDisplay,
        endTime,
        stopBtn,
        alarmSound;

    function init(settings) {
        timerDisplay = document.querySelector(settings.timerDisplaySelector);
        endTime = document.querySelector(settings.endTimeSelector);
        stopBtn = document.querySelector(settings.stopBtn);
        alarmSound = new Audio(settings.alarmSound);

        return this;
    }

    function start(seconds) {
        if ( isNaN(seconds) ) return new Error('Please provide number of minutes!');

        const now = Date.now();
        const then = now + seconds * 1000;

        displayTimeLeft(seconds);
        displayEndTime(then);

        stopBtn.style.display = 'block';
        if ( stopBtn.disabled ) {
            stopBtn.disabled = 'false';
            stopBtn.classList.add('active');
            stopBtn.classList.remove('inactive');
        }

        countdown = setInterval(() => {
            const secondsLeft = Math.round( (then - Date.now()) / 1000 );
            if (secondsLeft < 0) {
                clearInterval(countdown);
                stopBtn.setAttribute('disabled', 'true');
                stopBtn.classList.remove('active');
                stopBtn.classList.add('inactive');
                alarmSound.play();
                return;
            }

            displayTimeLeft(secondsLeft);
        }, 1000);

        return this;
    }

    function displayTimeLeft(seconds) {
        let days,
            hrs,
            sec = seconds % 60,
            min = Math.floor( seconds / 60 );

        if (min >= 60) {
            hrs = Math.floor( min / 60 );
            min %= 60;
        }

        if (hrs >= 24) {
            days = Math.floor( hrs / 24 );
            hrs %= 24;
        }

        let display = seconds < 3600 ? `${numberFormat.format(min)}:${numberFormat.format(sec)}`
                    : seconds < 86400 ? `${numberFormat.format(hrs)}:${numberFormat.format(min)}:${numberFormat.format(sec)}`
                    : `${numberFormat.format(days)}:${numberFormat.format(hrs)}:${numberFormat.format(min)}:${numberFormat.format(sec)}`;

        document.title = timerDisplay.textContent = display;
    }

    function displayEndTime(timestamp) {
        const end = new Date(timestamp);
        const hrsDifference = ( end - Date.now() ) / 3600000;

        endTime.textContent = hrsDifference < 24 ? `Will end at ${end.toLocaleTimeString()}`
                            : `Will end at ${end.toLocaleDateString('en-GB', {weekday: 'long'})} ${end.toLocaleTimeString()}`;
    }

    function stop() {
        clearInterval(countdown);
        displayTimeLeft(0);
        endTime.textContent = 'Timer stopped';
        alarmSound.pause();
        alarmSound.currentTime = 0;

        return this;
    }

    return {
        init,
        start,
        stop
    }
})();

const buttons = document.querySelectorAll('[data-time]');
const form = document.forms['customForm'];
const displayBlock = document.querySelector('.display');

timer.init({
    timerDisplaySelector: '.display__time-left',
    endTimeSelector : '.display__end-time',
    stopBtn: '.timer__stop-btn',
    alarmSound: 'audio/bell.mp3'
});

// Start timer on click
function startTimer(e) {
    timer.stop();
    const seconds = Number( this.dataset.time );
    timer.start(seconds);
    displayBlock.lastElementChild.classList.remove('inactive');
    displayBlock.lastElementChild.classList.add('active');
}

buttons.forEach( btn => btn.addEventListener('click', startTimer) );

form.addEventListener('submit', (e) => {
    e.preventDefault();
    timer.stop();

    let value = form.elements['minutes'].value;
    if ( isNaN(value) ) {
        e.preventDefault();
        return new Error('Please provide number of minutes');
    }

    timer.start( value * 60 );
});

displayBlock.addEventListener('click', e => {
    if ( e.target.classList.contains('timer__stop-btn') ) {
        e.preventDefault();
        timer.stop();
        e.target.classList.remove('active');
        e.target.classList.add('inactive');
    }
});
