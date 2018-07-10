class Auth {
    login(email, password) {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    register(email, password) {
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    }

    logout() {
        return firebase.auth().signOut();
    }
}