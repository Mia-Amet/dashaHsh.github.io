// Init Materialize JS features
M.AutoInit();

const App = (function () {
    let ui, auth, savedNews, favorites, newsStore, apiKey, logoutBtn, userBtn, newsContainer, toasts;

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

    function init() {
        // Init modules
        ui = new UI();
        auth = new Auth();
        savedNews = new DataBase('saved-news');
        favorites = new DataBase('favourite-sources');
        newsStore = NewsStore.getInstance();
        // Api key
        apiKey = "dfccbef1d7264b1ba2815be91c96c336";
        // Init elements
        logoutBtn = document.getElementById("logout");
        userBtn = document.getElementById("profile");
        newsContainer = document.querySelector(".news-container");

        toasts = [
            {remove: 'news', text: 'Article removed'},
            {remove: 'source', text: 'Source removed'},
            {add: 'news', text: 'Article saved'},
            {add: 'source', text: 'Source added'}
        ];

        setIvents();
    }

    function setIvents() {
        document.addEventListener("DOMContentLoaded", onLoad);
        logoutBtn.addEventListener("click", onLogout);
        newsContainer.addEventListener("click", deleteArticle);
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
                let timeout = 0;

                news.forEach((doc) => {
                    let article = doc.data();
                    article.id = doc.id;

                    setTimeout(() => {
                        ui.addSavedNews(article);
                    }, timeout);

                    timeout += 300;
                });
            })
            .catch(err => console.log(err));
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
                    ui.showToast(toasts[0]);
                    setTimeout(() => window.location.reload(true), 2000);
                })
                .catch(err => console.log(err));
        }
    }

    return {
        init
    }

})();

App.init();