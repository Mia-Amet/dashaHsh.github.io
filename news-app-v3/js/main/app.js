// Init Materialize JS features
// M.AutoInit();
// Api key
const key = "33858751ffbd4de4b076c07311c9a318";

const App = (function () {
    // Required data
    const countryData = [{'Ukraine': 'ua'}, {'United States': 'us'}, {'Great Britain': 'gb'}, {'Russia': 'ru'}];
    const categoryData = ['Business', 'Entertainment', 'Health', 'Science', 'Sports', 'Technology'];
    const sourceData = ['ABC News', 'BBC News', 'BBC Sport', 'Bloomberg', 'Business Insider', 'CNN', 'Crypto Coins News',
            'Engadget', 'Financial Post', 'Fox News', 'Fox Sport', 'Google News', 'MTV News', 'National Geographic',
            'New York Magazine', 'TechCrunch', 'The New York Times', 'The Verge', 'The Wall Street Journal', 'Wired'];

    let http, ui, store, auth, savedNews, favorites, newsStore, favoritesStore, apiKey, countries, categories, sources, searchForm, countrySelect,
        categorySelect, sourceSelect, favouriteSelect, logoutBtn, userBtn, searchInput, newsContainer, favoritesNow, toSaved;

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
        http = new HttpNew();
        ui = new UI();
        store = new Store();
        auth = new Auth();
        savedNews = new DataBase('saved-news');
        favorites = new DataBase('favourite-sources');
        newsStore = NewsStore.getInstance();
        favoritesStore = FavoritesStore.getInstance();
        // Init data
        apiKey = key;
        countries = formatData(countryData);
        categories = formatData(categoryData);
        sources = formatData(sourceData);
        favoritesNow = [];
        // Init elements
        searchForm = document.forms["search-form"];
        countrySelect = document.getElementById("country");
        categorySelect = document.getElementById("category");
        sourceSelect = document.getElementById("source");
        favouriteSelect = document.getElementById("favourites");
        logoutBtn = document.getElementById("logout");
        userBtn = document.getElementById("profile");
        searchInput = document.getElementById("search");
        newsContainer = document.querySelector(".news-container");
        toSaved = document.getElementById("saved");

        setIvents();
    }

    function setIvents() {
        document.addEventListener("DOMContentLoaded", onContentLoad);
        searchForm.addEventListener("submit", onSearch);

        countries.forEach(country => ui.addOption(country, countrySelect));
        categories.forEach(category => ui.addOption(category, categorySelect));
        sources.forEach(source => ui.addOption(source, sourceSelect));

        countrySelect.addEventListener("change", onChangeCountry);
        categorySelect.addEventListener("change", onChangeCountry);
        sourceSelect.addEventListener("change", onChangeSource);
        favouriteSelect.addEventListener("change", onChangeSource);

        logoutBtn.addEventListener("click", onLogout);
        toSaved.addEventListener("click", e => {
            window.location = 'saved-news.html';
            e.preventDefault();
        });
        document.forms['sources-form'].addEventListener("click", saveFavourite);
        newsContainer.addEventListener("click", saveArticle);
    }

    function formatData(array) {
        if (array.every(item => typeof item === 'string')) return array.map(toFormatStr);
        return array.map(toFormatObj);
    }

    function toFormatStr(str) {
        return {
            name: str,
            value: str.toLowerCase().split(' ').join('-')
        }
    }

    function toFormatObj(obj) {
        for (let key in obj) {
            return {
                name: key,
                value: obj[key]
            }
        }
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

                savedNews.getCollection()
                    .then(saved => {
                        if (saved.size) {
                            saved.forEach(doc => {
                                const article = doc.data();

                                news.forEach((item) => {
                                    if (item.title === article.title) item.id = doc.id;
                                });
                            });
                        }

                        news.forEach((news, index) => ui.addNews(news, index));
                        newsStore.setNews(news);
                    });
            })
            .catch(err => {
                ui.showError({
                    text: err.message.split(',')[1],
                    status: err.message.split(',')[0]
                });
            });
    }

    function toggleFavouriteIcon(str) {
        if (!favoritesNow || favoritesNow.indexOf(str) === -1) {
            return 'favorite_border';
        } else {
            return 'favorite';
        }
    }

    function initFormSelects() {
        $(document).ready(function(){
            $('select').formSelect();
        });
    }

    function toast(title) {
        const name = title.length >= 20 ? title.slice(0, 20) + '...' : title.slice();

        M.toast({html: `Article "${name}" saved!`});
    }

    //Event handlers
    function onContentLoad(e) {
        M.AutoInit();

        initFormSelects();
    }

    function onChangeCountry(e) {
        ui.showLoader();
        if (!countrySelect.value) return ui.showInfo("Quite impossible of course! First you should pick a country");

        showNews(`https://newsapi.org/v2/top-headlines?country=${countrySelect.value}&category=${categorySelect.value}&apiKey=${apiKey}`,
            e.target.closest('select'));
    }

    function onChangeSource(e) {
        ui.showLoader();

        const select = e.target.closest('select');
        showNews(`https://newsapi.org/v2/top-headlines?sources=${select.value}&apiKey=${apiKey}`, select);

        if (select === sourceSelect) {
            const btn = document.getElementById('addBtn') || document.getElementById('deleteBtn');
            btn.classList.remove('hidden');
            document.querySelector('.favourite-icon').textContent = toggleFavouriteIcon(sourceSelect.value);
        } else {
            document.getElementById('removeBtn').classList.remove('hidden');
        }
    }

    function onSearch(e) {
        showNews(`https://newsapi.org/v2/everything?q=${searchInput.value}&apiKey=${apiKey}`, searchInput);
        e.preventDefault();
    }

    function onLogout(e) {
        auth.logout()
            .then(() => window.location = 'login.html')
            .catch(err => console.log(err));
    }

    function saveArticle(e) {
        if (e.target.closest('button').classList.contains('bookmark')) {
            const index = (e.target.closest('button')).dataset.index,
                article = newsStore.getNews()[index],
                btn = e.target.closest('button');

            savedNews.addToCollection(article)
                .then(res => {
                    console.log(res);
                    toast(article.title);

                    btn.classList.remove('bookmark');
                    btn.classList.add('bookmark-saved');
                    btn.setAttribute('disabled', 'disabled');

                    btn.querySelector('span').textContent = 'Saved';
                })
                .catch(err => console.log(err));
        }
    }

    function saveFavourite(e) {
        if (e.target.closest('button').id === 'addBtn') {
            const index = (sourceSelect.selectedIndex - 1),
                source = favoritesStore.getSources()[index];

            favoritesNow.push(source.value);

            document.querySelector('.favourite-icon').textContent = toggleFavouriteIcon(sourceSelect.value);

            favorites.addToCollection(source)
                .then(res => console.log(res))
                .catch(err => console.log(err));

            e.target.closest('button').id = 'deleteBtn'
            //     favoritesNow = favoritesNow.filter(item => item !== source.value);
        }
    }

    return {
        init
    }

})();

App.init(key);