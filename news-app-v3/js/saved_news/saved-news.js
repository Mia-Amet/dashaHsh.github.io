// Init Materialize JS features
M.AutoInit();
// Api key
const key = "33858751ffbd4de4b076c07311c9a318";

const App = (function () {
    let ui, auth, savedNews, favorites, newsStore, favoritesStore, apiKey, logoutBtn, userBtn, newsContainer;

    // Check auth state
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            window.location = 'authentication.html';
        } else {
            const email = `
        <span>${user.email}</span>
        `;
            userBtn.insertAdjacentHTML("beforeend", email);
            userBtn.style.opacity = '0.7';
        }
    });

    function init(key) {
        // Init modules
        ui = new UI();
        auth = new Auth();
        savedNews = new DataBase('saved-news');
        favorites = new DataBase('favourite-sources');
        newsStore = NewsStore.getInstance();
        favoritesStore = FavoritesStore.getInstance();
        // Api key
        apiKey = key;
        // Init elements
        logoutBtn = document.getElementById("logout");
        userBtn = document.getElementById("profile");
        newsContainer = document.querySelector(".news-container");

        setIvents();
    }

    function setIvents() {
        document.addEventListener("DOMContentLoaded", onLoad);
        logoutBtn.addEventListener("click", onLogout);
        newsContainer.addEventListener("click", deleteArticle);
    }

    function toast() {
        M.toast({html: `Article successfully deleted!`});
    }

    function showNews(url, str) {
        http.get(url)
            .then(res => {
                if (!res.totalResults) return ui.showInfo(`To be more precise there is no news about this "${str}" at all.`);
                return res.articles;
            })
            .then(news => {
                ui.clearContainer();

                if (!news) return ui.showInfo(`To be more precise there is no news about this "${str}" at all.`);

                news.forEach((news, index) => ui.addNews(news, index));
                newsStore.setNews(news);
            })
            .catch(err => {
                ui.showError({
                    text: err.message.split(',')[1],
                    status: err.message.split(',')[0]
                });
            });
    }

    //Event handlers
    function onLoad(e) {
        savedNews.getCollection()
            .then(news => {
                news.forEach((doc) => {
                    ui.addSavedNews(doc.data(), doc.id);
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    function onLogout(e) {
        auth.logout()
            .then(() => window.location = 'login.html')
            .catch(err => console.log(err));
    }

    function deleteArticle(e) {
        if (e.target.closest('button').classList.contains('bookmark-delete')) {
            const id = (e.target.closest('button')).dataset.id;


            savedNews.deleteFromCollection(id)
                .then(res => {
                    console.log(res);
                    toast();
                    setTimeout(() => window.location.reload(true), 2000);
                })
                .catch(err => console.log(err));
        }
    }

    return {
        init
    }

})();

App.init(key);