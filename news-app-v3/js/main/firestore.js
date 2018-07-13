const FirestoreInit = (function () {
    let instance;

    // Initialize Firebase
    let config = {
        apiKey: "AIzaSyBzQy_hQRNiZ5typgz23-1d1RwZnzAGnp0",
        authDomain: "news-app-ab643.firebaseapp.com",
        databaseURL: "https://news-app-ab643.firebaseio.com",
        projectId: "news-app-ab643",
        storageBucket: "news-app-ab643.appspot.com",
        messagingSenderId: "767379270164"
    };
    firebase.initializeApp(config);

    // Init DataBase
    let db = firebase.firestore();
    const settings = {timestampsInSnapshots: true};
    db.settings(settings);
    
    function getDb() {
        return db;
    }
    
    function createInstance() {
        return {
            getDb
        }
    }

    return {
        getInstance() {
            return instance || (instance = createInstance());
        }
    }
})();
