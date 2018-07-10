// Init Auth
const auth = new Auth();
// Init UI
const ui = new UI();

// Init Elements
const form = document.forms['login-form'];
const email = form.elements['email'];
const password = form.elements['password'];
const signUp = document.getElementById('signUpBtn');

// Check auth state
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user);
        window.location = 'index.html';
    }
});

form.addEventListener('submit', onLogin);
email.addEventListener('focusin', onFocusInput);
password.addEventListener('focusin', onFocusInput);
signUp.addEventListener('click', toSignUp);

function onLogin(e) {
    e.preventDefault();

    if (email.value && password.value) {
        auth.login(email.value, password.value)
            .then(() => {
                window.location = 'index.html';
            })
            .catch(err => {
                ui.showError(err);
            });
    } else {
        ui.validate(email);
        ui.validate(password);
    }
}

function onFocusInput(e) {
    const label = this.closest('.input-field').lastElementChild;

    if (label.classList.contains('invalid')) {
        this.style.borderBottom = '1px solid #26a69a';
        label.classList.remove('invalid');
        label.textContent = `${this.id}`;
    }
}

function toSignUp() {
    window.location = 'sign_up.html';
}

