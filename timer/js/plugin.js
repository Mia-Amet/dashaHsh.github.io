const numberFormat = new Intl.NumberFormat('en-En', {minimumIntegerDigits: 2, maximumFractionDigits: 0});

const buttons = document.querySelectorAll('[data-time]'),
    form = document.forms['customForm'];

const timer = (function () {
    let countdown, timerDisplay, endTime, alarmSound, btnsBottomContainer, btnsBottom, countSeconds;

    function init(settings) {
        timerDisplay = document.querySelector(settings.timerDisplaySelector);
        endTime = document.querySelector(settings.endTimeSelector);
        btnsBottomContainer = document.querySelector(settings.btnsContainerSelector);
        btnsBottom = document.querySelectorAll(settings.btnsSelector);
        alarmSound = new Audio(settings.alarmSound);
        countSeconds = 0;

        btnsBottomContainer.addEventListener('click', e => {
            if (e.target.classList.contains('stop')) timer.stop();
            if (e.target.classList.contains('pause')) timer.togglePause(e.target);
        });

        return this;
    }

    function start(seconds) {
        if (isNaN(seconds)) return new Error('Please provide number of minutes!');
        if (countdown) stop();

        const now = Date.now();
        const then = now + seconds * 1000;

        displayTimeLeft(seconds);
        displayEndTime(then);

        if (btnsBottomContainer.classList.contains('invisible')) btnsBottomContainer.classList.remove('invisible');

        btnsBottom.forEach(btn => {
            btn.removeAttribute('disabled');
            btn.classList.remove('disabled');
        });

        countdown = setInterval(() => {
            const secondsLeft = Math.round((then - Date.now()) / 1000);

            if (secondsLeft <= 0) {
                alarmSound.play();
                stop();
                endTime.textContent = 'Timer ended';

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
            min = Math.floor(seconds / 60);

        if (min >= 60) {
            hrs = Math.floor(min / 60);
            min %= 60;
        }

        if (hrs >= 24) {
            days = Math.floor(hrs / 24);
            hrs %= 24;
        }

        let display = seconds < 3600 ? `${numberFormat.format(min)}:${numberFormat.format(sec)}`
                    : seconds < 86400 ? `${numberFormat.format(hrs)}:${numberFormat.format(min)}:${numberFormat.format(sec)}`
                    : `${numberFormat.format(days)}:${numberFormat.format(hrs)}:${numberFormat.format(min)}:${numberFormat.format(sec)}`;

        document.title = timerDisplay.textContent = display;
    }

    function displayEndTime(timestamp) {
        const end = new Date(timestamp);
        const hrsDifference = (end - Date.now()) / 3600000;

        endTime.textContent = hrsDifference < 24 ? `Will end at ${end.toLocaleTimeString()}`
            : `Will end at ${end.toLocaleDateString('en-GB', 
                {weekday: 'long'})}, ${end.toLocaleDateString('en-GB',
                {day: 'numeric'})}th of ${end.toLocaleDateString('en-GB',
                {month: 'long', year: 'numeric'})}, ${end.toLocaleTimeString('en-GB', 
                {hour: 'numeric', minute: 'numeric', second: 'numeric'})}`;
    }

    function stop(e) {
        clearInterval(countdown);
        displayTimeLeft(0);

        endTime.textContent = 'Timer stopped';

        btnsBottom.forEach(btn => {
            btn.disabled = 'true';
            btn.classList.add('disabled');
        });

        alarmSound.pause();
        alarmSound.currentTime = 0;

        return this;
    }

    function togglePause(elem) {
        if (countdown) {
            clearInterval(countdown);
            countdown = 0;

            const data = timerDisplay.textContent.split(':').reverse();
            console.log(data);
            countSeconds += +data[0] + (60 * +data[1]);

            if (data.length > 2) {
                const min = data.length === 3 ? 60 * +data[2] : (60 * +data[2]) + (1440 * +data[3]);
                countSeconds += min * 60;
            }

            elem.textContent = 'Resume';
            elem.blur();
        } else {
            start(countSeconds);
            countSeconds = 0;
            elem.textContent = 'Pause';
            elem.blur();
        }

        return this;
    }

    return {
        init,
        start,
        stop,
        togglePause,
    }
})();

timer.init({
    timerDisplaySelector: '.display__time-left',
    endTimeSelector : '.display__end-time',
    btnsContainerSelector: '.timer__buttons',
    btnsSelector: '.timer__btn',
    alarmSound: 'audio/bell.mp3'
});

// Start timer on click
function startTimer(e) {
    const seconds = Number(this.dataset.time);
    timer.start(seconds);
}

buttons.forEach(btn => btn.addEventListener('click', startTimer));

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = form.elements['minutes'].value;

    if (isNaN(value)) {
        timer.togglePause(document.querySelector('.pause'));
        alert('Please provide number of minutes');
    }

    timer.start(value * 60);
});

