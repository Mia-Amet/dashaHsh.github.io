let numberFormat = new Intl.NumberFormat('en-En', {minimumIntegerDigits: 2, maximumFractionDigits: 0});

const Player = function () {
    let player, video, toggle, toggleIcon, stop, volumeBtn, volumeRange,volumeIcon, volumeWrap,
        progressBar, progress, skipBtns, timeFactor, timeNow, timeFull, overlay, mouseDown = false;

    function init(playerSelector) {
        player = document.querySelector(playerSelector);
        video = player.querySelector('video');
        toggle = player.querySelector('.toggle');
        toggleIcon = toggle.querySelector('.fas');
        stop = player.querySelector('.stop');
        volumeBtn = player.querySelector('.volume_btn');
        volumeRange = player.querySelector('.player__slider');
        volumeIcon = player.querySelector('[data-toggle]');
        volumeWrap = player.querySelector('#volume_wrapper');
        progressBar = player.querySelector('.progress__filled');
        progress = player.querySelector('.progress');
        skipBtns = document.querySelectorAll('[data-skip]');
        timeFactor = player.querySelector('.time-factor');
        timeNow = timeFactor.querySelector('.time_played');
        timeFull = timeFactor.querySelector('.time_all');
        overlay = player.querySelector('.video_overlay');

        setIvents();
        return this;
    }

    function setIvents() {


        toggle.addEventListener('click', togglePlay);
        video.addEventListener('click', togglePlay);
        overlay.addEventListener('click', togglePlay);
        video.addEventListener('timeupdate', handleProgress);
        video.addEventListener('loadeddata', handleProgress);
        stop.addEventListener('click', stopVideo);

        volumeWrap.addEventListener('mouseenter', slideUp);
        volumeWrap.addEventListener('mouseleave', slideDown);
        volumeBtn.addEventListener('mouseenter', slideUp);
        volumeBtn.addEventListener('mouseleave', slideDown);
        volumeRange.addEventListener('change', handleRangeUpdate);
        volumeIcon.addEventListener('click', toggleVolumeValue);

        skipBtns.forEach( btn => btn.addEventListener('click', skip) );

        progress.addEventListener('click', scrub);
        progress.addEventListener('mousemove', () => mouseDown && scrub);
        progress.addEventListener('mousedown', () => mouseDown = true);
        progress.addEventListener('mouseup', () => mouseDown = false);

        progressBar.addEventListener('mousemove', progressMove);
        progress.addEventListener('mousemove', progressMove);

        video.addEventListener('loadeddata', getFullTime);
        video.addEventListener('timeupdate', handleTimePlayed);
    }

    function getVideo() {
        return video;
    }

    function playVideo() {
        video.play();
        return this;
    }

    function togglePlay(e) {
        const method = checkVideo() ? 'play' : 'pause';
        video[method](); // video.play() || video.pause()
        iconChange('fa-play', 'fa-pause', checkVideo, toggleIcon);
        toggleOverlay(e);
    }

    function stopVideo() {
        mouseDown = false;
        video.load();
        return this;
    }

    function toggleOverlay(e) {
        overlay.style.display = checkVideo() ? 'block' : 'none';
    }

    function slideUp(e) {
        volumeRange.style.right = `85px`;
        timeFactor.style.left = `-130px`;
    }

    function slideDown(e) {
        volumeRange.style.right = `-100px`;
        timeFactor.style.left = `0px`;
    }

    function handleRangeUpdate(e) {
        video[e.target.name] = e.target.value;
        iconChange('fa-volume-up', 'fa-volume-off', checkVolumeValue, volumeIcon);
    }

    function toggleVolumeValue(e) {
        volumeRange.value = volumeRange.value > 0 ? 0 : 1;
        video[volumeRange.name] = volumeRange.value;
        iconChange('fa-volume-up', 'fa-volume-off', checkVolumeValue, volumeIcon);
    }

    function checkVolumeValue() {
        return +volumeRange.value;
    }

    function checkVideo() {
        return video.paused;
    }

    function iconChange(a, b, func, elem) {
        const result = func();
        const remove = result ? b : a;
        const add = result ? a : b;

        elem.classList.remove(remove);
        elem.classList.add(add);
    }

    function handleProgress(e) {
        const percent = (video.currentTime / video.duration) * 100;
        progressBar.style.flexBasis = `${percent}%`;
    }

    function handleTimePlayed(e) {
        const playedTime = timeToFormat(video.currentTime);
        timeNow.textContent = playedTime;
    }

    function getFullTime(e) {
        const fullTime = timeToFormat(video.duration);
        timeFull.textContent = fullTime;
    }

    function timeToFormat(sec) {
        let hours,
        minutes = numberFormat.format(Math.floor(sec / 60)),
        seconds = numberFormat.format(sec % 60);

        if (sec >= 3600) {
            hours = numberFormat.format(Math.floor(minutes / 60));
            minutes %= 60;
            return `${hours}: ${minutes}: ${seconds}`;
        }

        return `${minutes}: ${seconds}`;
    }

    function skip(e) {
        video.currentTime += +e.target.dataset.skip;
    }

    function scrub(e) {
        video.currentTime = (e.offsetX / progress.offsetWidth) * video.duration;
    }

    function progressMove(e) {
        if (mouseDown) {
            let timeStop = (e.offsetX / progress.offsetWidth) * video.duration;
            progressBar.style.flexBasis = `${(timeStop / video.duration) * 100}%`;
        }
    }

    return {
        getVideo,
        playVideo,
        stopVideo,
        init
    };
};

let player1 = Player().init('.player');



