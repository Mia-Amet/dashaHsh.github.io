const App = (function () {
    // Required data
    const countryData = [{'Ukraine': 'ua'}, {'United States': 'us'}, {'Great Britain': 'gb'}, {'Russia': 'ru'}];
    const categoryData = ['Business', 'Entertainment', 'Health', 'Science', 'Sports', 'Technology'];
    const sourceData = ['ABC News', 'BBC News', 'BBC Sport', 'Bloomberg', 'Business Insider', 'CNN', 'Crypto Coins News',
            'Engadget', 'Financial Post', 'Fox News', 'Google News', 'MTV News', 'National Geographic',
            'New York Magazine', 'TechCrunch', 'The New York Times', 'The Verge', 'The Wall Street Journal', 'Wired'];

    let http, ui, auth, savedNews, favoriteSources, newsStore, apiKey, countries, categories, sources, searchForm, sourceForm, countrySelect,
        categorySelect, sourceSelect, favoritesSelect, logoutBtn, userBtn, searchInput, newsContainer, toSaved, toasts;

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
        http = new HttpNew();
        ui = new UI();
        auth = new Auth();
        savedNews = new DataBase('saved-news');
        favoriteSources = new DataBase('favourite-sources');
        newsStore = NewsStore.getInstance();
        // Init data
        apiKey = "dfccbef1d7264b1ba2815be91c96c336";
        countries = formatData(countryData);
        categories = formatData(categoryData);
        sources = formatData(sourceData);
        toasts = [
            {remove: 'news', text: 'Article removed'},
            {remove: 'source', text: 'Source removed'},
            {add: 'news', text: 'Article saved'},
            {add: 'source', text: 'Source added'}
            ];
        // Init elements
        sourceForm = document.forms["sources-form"];
        searchForm = document.forms["search-form"];
        countrySelect = document.getElementById("country");
        categorySelect = document.getElementById("category");
        sourceSelect = document.getElementById("source");
        favoritesSelect = document.getElementById("favourites");
        logoutBtn = document.getElementById("logout");
        userBtn = document.getElementById("profile");
        searchInput = document.getElementById("search");
        newsContainer = document.querySelector(".news-container");
        toSaved = document.getElementById("saved");

        setIvents();
    }

    function setIvents() {
        window.addEventListener("load", onContentLoad);
        searchForm.addEventListener("submit", onSearch);

        countries.forEach(country => ui.addOption(country, countrySelect));
        categories.forEach(category => ui.addOption(category, categorySelect));
        sources.forEach(source => ui.addOption(source, sourceSelect));


        countrySelect.addEventListener("change", onChangeCountry);
        categorySelect.addEventListener("change", onChangeCountry);
        sourceSelect.addEventListener("change", onChangeSource);
        favoritesSelect.addEventListener("change", onChangeSource);

        logoutBtn.addEventListener("click", onLogout);
        toSaved.addEventListener("click", e => {
            window.location = 'saved-news.html';
            e.preventDefault();
        });
        sourceForm.firstElementChild.addEventListener("click", addFavorite);
        sourceForm.firstElementChild.addEventListener("click", removeFavorite);
        sourceForm.lastElementChild.addEventListener("click", removeFavorite);
        newsContainer.addEventListener("click", saveArticle);
        newsContainer.addEventListener("click", closeErrCard);
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
                newsStore.setNews(news);

                news.forEach((article, index) => {
                    savedNews.queryDocument('title', article.title)
                        .then(saved => {
                            if (saved.size) {
                                ui.addSavedNews(saved.docs[0].data());
                            } else {
                                ui.addNews(article, index);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                });
            })
            .catch(err => {
                ui.showError({
                    text: err.message.split(',')[1],
                    status: err.message.split(',')[0]
                });
            });
    }

    function checkFavorites() {
        const options = Array.prototype.slice.call(sourceSelect.options);

        options.forEach(option => {
            favoriteSources.queryDocument('name', option.textContent)
                .then(items => {
                    option.dataset.id = items.size ? items.docs[0].id : '';
                })
                .catch(err => console.log(err));
        });

        initFormSelects();
    }

    function initFormSelects() {
        $(document).ready(function(){
            $('select').formSelect();
        });
    }

    //Event handlers
    function onContentLoad(e) {
        M.AutoInit();
        ui.clearOptions(favoritesSelect);

        favoriteSources.getCollection()
            .then(items => {
                if (items.size) {
                    favoritesSelect.removeAttribute('disabled');

                    items.forEach(doc => {
                        const option = doc.data();
                        option.id = doc.id;
                        ui.addOption(option, favoritesSelect);
                    });

                    initFormSelects();
                }
            })
            .catch(err => console.log(err));

        checkFavorites();
    }

    function onChangeCountry(e) {
        ui.showLoader();
        if (!countrySelect.value) return ui.showInfo("Please, specify your request: first pick a country");

        showNews(`https://newsapi.org/v2/top-headlines?country=${countrySelect.value}&category=${categorySelect.value}&apiKey=${apiKey}`,
            e.target.closest('select'));
    }

    function onChangeSource(e) {
        const select = e.target.closest('select'),
            btn = select === sourceSelect ? document.getElementById('toggleBtn') : document.getElementById('removeBtn');

        ui.showLoader();
        showNews(`https://newsapi.org/v2/top-headlines?sources=${select.value}&apiKey=${apiKey}`, select);
        btn.classList.remove('hidden');

        if (select === sourceSelect) {
            const currentOption = select.options.item(select.selectedIndex);

            checkFavorites();

            btn.firstElementChild.textContent = currentOption.dataset.id ? 'favorite' : 'favorite_border';
            btn.dataset.action = currentOption.dataset.id ? 'delete' : 'add';
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
                    article.id = res.id;

                    ui.showToast(toasts[2]);

                    btn.classList.remove('bookmark');
                    btn.classList.add('bookmark-saved');
                    btn.setAttribute('disabled', 'disabled');

                    btn.querySelector('span').textContent = 'Saved';
                })
                .catch(err => console.log(err));
        }
    }

    function addFavorite(e) {
        if (e.target.classList.contains('material-icons') && e.target.closest('button').dataset.action === 'add') {
            const btn = e.target.closest('button'),
                currentOption = sourceSelect.options.item(sourceSelect.selectedIndex),
                item = sources[sourceSelect.selectedIndex - 1];

            favoriteSources.addToCollection(item)
                .then(docRef => {
                    item.id = docRef.id;
                    currentOption.dataset.id = docRef.id;

                    ui.showToast(toasts[3]);

                    btn.dataset.action = 'delete';
                    e.target.textContent = 'favorite';

                    favoritesSelect.removeAttribute('disabled');
                    ui.addOption(item, favoritesSelect);

                    initFormSelects();
                })
                .catch(err => console.log(err));
        }
    }

    function removeFavorite(e) {
        if (e.target.classList.contains('material-icons') && e.target.closest('button').dataset.action === 'delete') {
            const btn = e.target.closest('button'),
                select = btn.id === 'toggleBtn' ? sourceSelect : favoritesSelect,
                currentOption = select.options.item(select.selectedIndex);

            favoriteSources.deleteFromCollection(currentOption.dataset.id)
                .then(() => {
                    ui.showToast(toasts[1]);
                    checkFavorites();

                    if (btn.id === 'toggleBtn') {
                        btn.dataset.action = 'add';
                        e.target.textContent = 'favorite_border';
                    } else if (sourceSelect.value === select.value) {
                        document.getElementById('toggleBtn').dataset.action = 'add';
                        document.getElementById('toggleBtn').firstElementChild.textContent = 'favorite_border';
                    }

                    initFormSelects();

                    favoriteSources.getCollection()
                        .then(favorites => {
                            ui.clearOptions(favoritesSelect);

                            if (!favorites.size) {
                                favoritesSelect.disabled = 'disabled';
                            } else {
                                favorites.forEach(doc => {
                                    let option = doc.data();
                                    option.id = doc.id;

                                    ui.addOption(option, favoritesSelect);
                                })
                            }

                            if (!document.getElementById('removeBtn').classList.contains('hidden')) {
                                document.getElementById('removeBtn').classList.add('hidden');
                            }

                            initFormSelects();
                        })
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
        }
    }

    function closeErrCard(e) {
        if (e.target.classList.contains('myCloseClass')) {
            const card = e.target.closest('.col.s12');
            UI.fade(card);
        }
    }

    return {
        init
    }

})();

App.init();