function Question(text = 'Default', answer = 'True', wrong = 'False') {
    let optionsArray = [answer, wrong];

    function randomiseOrder() {
        return optionsArray.sort( (a, b) => a.split('').reverse() > b[2] );
    }

    this.text = text;
    this.options = randomiseOrder();
    this.answer = `${this.options.indexOf(answer)}`;
}

const question1 = new Question('Which device do we use to look at the stars?', 'Telescope', 'Monocle');
const question2 = new Question('Which device was invented by Henry Mill?', 'Typewriter', 'Toaster');
const question3 = new Question('What is the lightest existing metal?', 'Aluminium', 'Copper');
const question4 = new Question('Who discovered one of the first antibiotics: penicillin?', 'Alexander Fleming', 'Alan Shepard');
const question5 = new Question('Which planet is nearest the sun?', 'Mercury', 'Jupiter');

const Quiz = (function () {
    let userAnswer, userScore, questions, isStopped, messages, resumed;

    function init(...args) {
        questions = [];
        isStopped = false;
        messages = {
            success: 'Правильный ответ!',
            fail: 'Вы проиграли! Начинаем заново!',
            score: `Ваш результат`,
            congrats: 'Поздравляем! Вы прошли игру!',
            stop: 'Вы остановили игру!',
            error: 'Продолжить невозможно! Вы не ответили ни на один вопрос!',
            divider: '----------------'
        };

        args.forEach( question => questions.push(question) );
        return this;
    }
    
    function start() {
        userScore = 0;
        questions.forEach((question) => !isStopped && ask(question));
    }

    function resume() {
        isStopped = false;
        resumed = questions.slice(userScore);
        resumed.forEach((question) => !isStopped && ask(question));
    }

    function ask(question) {
        questionTemplate(question);
        userAnswer = prompt('Введите номер ответа', '');

        switch (userAnswer) {
            case `${question.answer}`:
                userScore++;
                generateMessage('success');

                if (userScore === questions.length) {
                    generateMessage();
                    isStopped = !isStopped;
                }
                break;

            case 'stop':
                generateMessage(userAnswer);
                isStopped = !isStopped;
                break;

            case '':
            default:
                generateMessage('fail');
                start();
        }
    }

    function questionTemplate(question) {
        console.log(question.text);
        question.options.forEach( (option, index) => console.log(`${index}: ${option}`) );
    }

    function generateMessage(value) {
        switch (value) {
            case 'success':
                console.log(`${messages.success}\n${messages.score}: ${userScore}\n${messages.divider}`);
                break;

            case 'fail':
                console.log(`${messages.fail}\n${messages.divider}`);
                break;

            case 'stop':
                console.log(messages.stop);
                break;

            default:
                console.log(messages.congrats);
        }
    }

    return {
        init,
        start,
        resume
    }
})();


Quiz
    .init(question1, question2, question3, question4, question5)
    .start();
