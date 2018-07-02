// Init Materialize JS features
M.AutoInit();
// Init http
const http = new Http();
// Init UI
const ui = new UI();
// Init store
const store = new Store();
// Api key
const apiKey = "33858751ffbd4de4b076c07311c9a318";
// Data for selects
const countries = [
    {
        name: 'Ukraine',
        value: 'ua'
    },
    {
        name: 'United States',
        value: 'us'
    },
    {
        name: 'Great Britain',
        value: 'gb'
    },
    {
        name: 'Russia',
        value: 'ru'
    }
],
    categories = ['Business', 'Entertainment', 'Health', 'Science', 'Sports', 'Technology'],
    sources = ['ABC News', 'BBC News', 'BBC Sport', 'Bloomberg', 'Business Insider', 'CNN', 'Crypto Coins News',
    'Engadget', 'Financial Post', 'Fox News', 'Fox Sport', 'Google News', 'MTV News', 'National Geographic',
    'New York Magazine', 'TechCrunch', 'The New York Times', 'The Verge', 'The Wall Street Journal', 'Wired'];

// Init elements
const searchForm = document.forms["search-form"],
    selectCountry = document.getElementById("country"),
    selectCategory = document.getElementById("category"),
    selectSource = document.getElementById("source"),
    selectFavourites = document.getElementById("favourites"),
    toggleBtn = document.getElementById("toggleBtn"),
    removeBtn = document.getElementById('removeBtn'),
    searchInput = document.getElementById("search"),
    categoriesModified = categories.map(category => modify(category)),
    sourcesModified = sources.map(source => modify(source));

// All events
document.addEventListener("DOMContentLoaded", onContentLoad);

countries.forEach(country => ui.addOption(country, selectCountry));
categoriesModified.forEach(category => ui.addOption(category, selectCategory));
sourcesModified.forEach(source => ui.addOption(source, selectSource));

selectCountry.addEventListener("change", onChangeCountry);
selectCategory.addEventListener("change", onChangeCountry);
selectSource.addEventListener("change", onChangeSource);
selectFavourites.addEventListener("change", onChangeSource);

searchForm.addEventListener("submit", onSearch);
toggleBtn.addEventListener("click", onToggleBtn);
removeBtn.addEventListener("click", onRemoveBtn);

// Event handlers
function onContentLoad(e) {
    initFormSelects();
    const favourites = store.getFavourites();

    if (favourites.length) {
        selectFavourites.removeAttribute('disabled');
        favourites.forEach(item => ui.addOption(item, selectFavourites));
    }
}

function onChangeCountry(e) {
    ui.showLoader();

    const select = e.target.closest('select');
    if (!selectCountry.value) return ui.showInfo("Quite impossible of course! First you should pick a country");

    showNews(`https://newsapi.org/v2/top-headlines?country=${selectCountry.value}&category=${selectCategory.value}&apiKey=${apiKey}`, select);
}

function onChangeSource(e) {
    ui.showLoader();

    const select = e.target.closest('select');
    showNews(`https://newsapi.org/v2/top-headlines?sources=${select.value}&apiKey=${apiKey}`, select);

    if (this === selectSource) {
        toggleBtn.classList.remove('hidden');
    } else {
        removeBtn.classList.remove('hidden');
    }

    toggleIcon(e);
}

function onToggleBtn(e) {
    const favourites = store.getFavourites(),
        text = selectSource.selectedOptions[0].textContent;

    if (favourites.every(item => item.value !== selectSource.value)) {
        store.addFavourite(text, selectSource.value);
        if (selectFavourites.disabled) selectFavourites.removeAttribute('disabled');
    } else {
        store.removeFavourite(selectSource.value);
        if (selectFavourites.value === selectSource.value) removeBtn.classList.add('hidden');
    }

    manageFavourites();
    initFormSelects();
    toggleIcon(e);
}

function onRemoveBtn(e) {
    store.removeFavourite(selectFavourites.value);

    manageFavourites();
    initFormSelects();
    toggleIcon(e);

    removeBtn.classList.add('hidden');
}

function manageFavourites() {
    const favourites = store.getFavourites();

    selectFavourites.textContent = '';
    selectFavourites.insertAdjacentHTML('afterbegin', `<option value="" disabled selected>Choose from your list</option>`);
    favourites.forEach(item => ui.addOption(item, selectFavourites));

    if (!favourites.length) selectFavourites.setAttribute('disabled', 'disabled');
}

function toggleIcon(e) {
    const favourites = store.getFavourites(),
        icon = toggleBtn.children[0];

    icon.textContent = favourites.some(item => item.value === selectSource.value) ? 'favorite' : 'favorite_border';
    icon.title = e.target.textContent === 'favorite' ? 'Remove source from favourites' : 'Add source to favourites';
}

function showNews(url, elem) {
    http.get(url, function (err, res) {
        if (!err) {
            console.log();
            // JSON to object
            const response = JSON.parse(res);
            if (!response) return ui.showInfo(`To be more precise there is no news about this "${elem.value}" at all.`);
            newsMarkUp(response);
        } else {
            // error
            ui.showError(err);
        }
    });
}

function newsMarkUp(response) {
    // Clear container
    ui.clearContainer();
    // articles to markup
    response.articles.forEach(news => ui.addNews(news));
}

function onSearch(e) {
    // Request news by search value
    http.get(`https://newsapi.org/v2/everything?q=${searchInput.value}&apiKey=${apiKey}`, function (err, res) {
        if (err) return ui.showError(err);
        const response = JSON.parse(res);
        if (response.totalResults) {
            newsMarkUp(response);
        } else {
            ui.showInfo(`To be more precise there is no news about this "${searchInput.value}" at all.`);
        }
    });
    e.preventDefault();
}

function modify(str) {
    return {
        name: str,
        value: str.toLowerCase().split(' ').join('-')
    }
}

function initFormSelects() {
    $(document).ready(function(){
        $('select').formSelect();
    });
}
