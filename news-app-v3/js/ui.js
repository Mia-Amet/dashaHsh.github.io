class UI {
    constructor() {
        this.container = document.querySelector(".news-container .container .row");
        this.toggleBtn = document.getElementById("toggleBtn");
    }

    addOption(object, elem) {
        let option = new Option(object.name, object.value);
        if (object.id) option.dataset.id = object.id;

        elem.options.add(option);
    }

    clearOptions(elem) {
        elem.innerHTML = `
        <option value="" selected="selected" disabled="disabled">Choose from your list</option>
        `;
    }

    addNews(article, index) {
        const img = this.getImgUrl(article),
            description = this.getDescription(article),
            timeAgo = this.getTime(article);

        const template = `
        <div class="col s6">
            <div class="card news left-align">
                <div class="card-image waves-effect waves-block waves-light">
                    <img class="activator" src="${img}">
                </div>
                <div class="card-content">
                    <div class="card-info">
                        <div>
                            <span class="truncate card-title activator grey-text text-darken-4">${article.title}</span>
                        </div>
                        <div class="time">
                            <i class="tiny material-icons time-icon">schedule</i>
                            <span class="time-ago">${timeAgo}</span>
                        </div>
                    </div>
                    <div class="card-icon-activator">
                        <i class="activator material-icons right">more_vert</i>
                    </div>
                </div>
                <div class="card-reveal">
                    <div class="card-reveal-content">
                        <div class="card-info">
                            <div>
                                <span class="card-title activator grey-text text-darken-4">${article.title}</span>
                            </div>
                            <div class="time">
                                <i class="tiny material-icons time-icon">schedule</i>
                                <span class="time-ago">${timeAgo}</span>
                            </div>
                        </div>
                        <div class="card-icon-activator card-title">
                            <i class="activator material-icons right">close</i>
                        </div>
                    </div>
                    <div class="card-description">
                        <p>${description}</p>
                    </div>
                </div>
                <div class="card-content-last">
                    <div class="card-action">
                        <p class="source"><a class="source-link" href="${article.url}">${article.source.name}</a></p>
                        <button type="button" data-index="${index}" class="btn-flat bookmark">
                            <i class="material-icons left">bookmark</i>
                            <span>Save article</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;

        this.container.insertAdjacentHTML("beforeend", template);
    }

    addSavedNews(article) {
        const img = this.getImgUrl(article),
            description = this.getDescription(article),
            timeAgo = this.getTime(article);

        const savedBtnMarkup = `
                <button type="button" data-id="${article.id}" class="btn-flat bookmark-saved" disabled="disabled">
                    <i class="material-icons left">bookmark</i>
                    <span>Saved</span>
                </button>
                `;

        const deleteBtnMarkup = `
                <button type="button" data-id="${article.id}" class="btn-flat bookmark-delete">
                    <i class="material-icons left">delete</i>
                    <span>Remove from saved</span>
                </button>
                `;

        const main = "http://localhost/News/news-app_3.0/index.html" || "https://dashahsh.github.io/news-app-v3/index.html";
        const btn = window.location.href === main ? savedBtnMarkup : deleteBtnMarkup;

        const template = `
        <div class="col s6">
            <div class="card news left-align">
                <div class="card-image waves-effect waves-block waves-light">
                    <img class="activator" src="${img}">
                </div>
                <div class="card-content">
                    <div class="card-info">
                        <div>
                            <span class="truncate card-title activator grey-text text-darken-4">${article.title}</span>
                        </div>
                        <div class="time">
                            <i class="tiny material-icons time-icon">schedule</i>
                            <span class="time-ago">${timeAgo}</span>
                        </div>
                    </div>
                    <div class="card-icon-activator">
                        <i class="activator material-icons right">more_vert</i>
                    </div>
                </div>
                <div class="card-reveal">
                    <div class="card-reveal-content">
                        <div class="card-info">
                            <div>
                                <span class="card-title activator grey-text text-darken-4">${article.title}</span>
                            </div>
                            <div class="time">
                                <i class="tiny material-icons time-icon">schedule</i>
                                <span class="time-ago">${timeAgo}</span>
                            </div>
                        </div>
                        <div class="card-icon-activator card-title">
                            <i class="activator material-icons right">close</i>
                        </div>
                    </div>
                    <div class="card-description">
                        <p>${description}</p>
                    </div>
                </div>
                <div class="card-content-last">
                    <div class="card-action">
                        <p class="source"><a class="source-link" href="${article.url}">${article.source.name}</a></p>
                        ${btn}
                    </div>
                </div>
            </div>
        </div>
        `;

        this.container.insertAdjacentHTML("beforeend", template);
    }

    getImgUrl(article) {
        return article.urlToImage || 'https://www.providermatching.com/wp-content/uploads/2018/06/news.jpg';
    }

    getDescription(article) {
        return article.description || '';
    }

    getTime(article) {
        const date = Date.parse(article.publishedAt);
        const difference = (Date.now() - date) / 60000;
        let days, hours, min = Math.floor(difference);

        if (min >= 60 && min < 120) {
            hours = 1;
            min = min % 60;
        } else if (min >= 120) {
            hours = Math.floor(min / 60);
            min = min % 60;

            if (hours >= 24 && hours < 48) {
                days = 1;
            } else if (hours >= 48) {
                days = Math.floor(hours / 24);
            }
        }

        if (days) {
            return days < 2 ? `One day ago`
                : days <= 30 ? `${days} days ago` : `Over a month ago`;
        } else if (hours) {
            if (!min) {
                return hours > 1 ? `${hours} hours ago` : `One hour ago`;
            } else {
                return hours > 1 ? `${hours} hours ${min} min ago` : `One hour ${min} ago`;
            }
        } else {
            return min > 1 ? `${min} min ago` : `right now`;
        }
    }

    clearContainer() {
        this.container.innerHTML = "";
    }

    showLoader() {
        this.clearContainer();

        const template = `
            <div class="preloader-wrapper big active">
              <div class="spinner-layer spinner-blue">
                <div class="circle-clipper left">
                  <div class="circle"></div>
                </div>
                <div class="gap-patch">
                  <div class="circle"></div>
                </div>
                <div class="circle-clipper right">
                  <div class="circle"></div>
                </div>
              </div>
            </div>
        `;

        this.container.insertAdjacentHTML("beforeend", template);
    }

    showInfo(msg) {
        this.clearContainer();

        const template = `
        <div class="col s12">
          <div class="card horizontal teal lighten-4 err-card">
            <div class="card-image">
              <img class="err-img" src="img/farnsworth.png">
            </div>
            <div class="card-content">
              <span class="card-title">Bad news everyone!</span>
              <p>${msg}</p>
            </div>
          </div>
        </div>
        `;

        this.container.insertAdjacentHTML("beforeend", template);
    }

    showError(err) {
        this.clearContainer();
        let errText = `${err.text}, human. Long story short... Bite my shiny metal... you-know-what!`;

        const template = `
        <div class="col s12">
          <div class="card horizontal deep-orange lighten-4 err-card">
            <div class="card-image">
              <img class="err-img" src="img/bender.png">
            </div>
            <div class="card-content">
              <span class="card-title">Error ${err.status}!</span>
              <p>${errText}</p>
            </div>
          </div>
        </div>
        `;

        this.container.insertAdjacentHTML("beforeend", template);
    }
}