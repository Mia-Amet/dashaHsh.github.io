// Init Auth
const auth = new Auth();
// Init UI
const ui = new UI();

// Init pages
const signInPage = new SignInPage(),
    signUpPage = new SignUpPage();


// Events
window.addEventListener('load', onLoad);
document.addEventListener('click', onClick);


// Event handlers
function onLoad(e) {
    ui.loadPage(signInPage.html);

    // Check auth state
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.location = 'index.html';
        }
    });

    const form = signInPage.getForm(),
        email = signInPage.getEmail(),
        password = signInPage.getPassword();

    form.addEventListener('submit', onSubmit);
    email.addEventListener('focusin', onFocusInput);
    password.addEventListener('focusin', onFocusInput);
}

function onFocusInput(e) {
    const label = this.closest('.input-field').lastElementChild;

    if (label.classList.contains('invalid')) {
        this.style.borderBottom = '1px solid #26a69a';

        label.classList.remove('invalid');
        label.textContent = `${this.id[0].toUpperCase()}${this.id.slice(1)}`;
    }
}

function onSubmit(e) {
    e.preventDefault();

    if (email.value && password.value) {
        if (this.name === 'signup-form') {
            auth.register(email.value, password.value)
                .then(() => {
                    window.location = 'index.html';
                })
                .catch(err => {
                    ui.showError(err);
                });
        } else {
            auth.login(email.value, password.value)
                .then(() => {
                    window.location = 'index.html';
                })
                .catch(err => {
                    ui.showError(err);
                });
        }
    } else {
        ui.validate(email);
        ui.validate(password);
    }
}

function onClick(e) {
    if (e.target.closest('button').name === 'toggleBtn') {
        const page = e.target.closest('button').dataset.toggle === 'signIn' ? signInPage : signUpPage;

        ui.loadPage(page.html);

        const form = page.getForm(),
            email = page.getEmail(),
            password = page.getPassword();

        form.addEventListener('submit', onSubmit);
        email.addEventListener('focusin', onFocusInput);
        password.addEventListener('focusin', onFocusInput);
    }
}




