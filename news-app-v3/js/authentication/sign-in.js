class SignInPage {
    constructor() {
        this.html = `
        <form name="signin-form">
            <div class="card-content">
                <div class="container">
                
                    <div class="card-heading">
                        <span class="brand-logo left">NewsApp</span>
                        <span class="card-title left">/</span>
                        <span class="card-title left">Sign In</span>
                    </div>
                    
                    <div class="row">
                        <div class="input-field col s12">
                            <input id="email" type="text" name="email" autocomplete="off">
                            <label for="email">Email</label>
                        </div>
                        
                        <div class="input-field col s12">
                            <input id="password" type="password" name="password" autocomplete="new-password">
                            <label for="password">Password</label>
                        </div>
                        
                        <a class="btn-flat trouble-link" id="helpBtn">Trouble signing in?</a>
                    </div>
                
                </div>
            </div>
            
            <div class="card-action">
                <div class="container btns-wrapper">
                    <button class="btn waves-effect waves-light" type="submit" name="action" id="signInBtnPrimary">
                        <span>Sign In</span>
                        <i class="material-icons right">arrow_forward</i>
                    </button>
                    
                    <div>
                        <span class="action-text">Don't have an account?</span>
                        <button class="btn-flat waves-effect waves-teal" type="button" data-toggle="signUp" name="toggleBtn" id="signUpBtnSecondary">
                            <span>Sign Up</span>
                            <i class="material-icons left">create</i>
                        </button>
                    </div>
                </div>
            </div>
        </form>                                                            
        `;
    }

    getForm() {
        return document.forms['signin-form'];
    }

    getEmail() {
        return this.getForm().elements['email'];
    }

    getPassword() {
        return this.getForm().elements['password'];
    }
}