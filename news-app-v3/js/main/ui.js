class UI {
    constructor() {
        this.container = document.querySelector(".news-container .container .row");
    }

    addOption({name, value}, elem) {
        const option = new Option(name, value);
        elem.options.add(option);
    }

    addNews(article, index) {
        const img = this.getImgUrl(article),
            description = this.getDescription(article),
            timeAgo = this.getTime(article);

        const btn = article.id ? this.getBtn('saved', article.id) : this.getBtn('add', index);

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

    addSavedNews(article, id) {
        const img = this.getImgUrl(article),
            description = this.getDescription(article),
            timeAgo = this.getTime(article);

        const btn = this.getBtn('delete', id);

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

    getBtn(keyword, int) {
        switch (keyword) {
            case 'add':
                return `
                <button type="button" data-index="${int}" class="btn-flat bookmark">
                    <i class="material-icons left">bookmark</i>
                    <span>Save article</span>
                </button>
                `;
            case 'saved':
                return `
                <button type="button" data-id="${int}" class="btn-flat bookmark-saved" disabled="disabled">
                    <i class="material-icons left">bookmark</i>
                    <span>Saved</span>
                </button>
                `;
            case 'delete':
                return `
                <button type="button" data-id="${int}" class="btn-flat bookmark-delete">
                    <i class="material-icons left">delete</i>
                    <span>Remove from saved</span>
                </button>
                `;
        }
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
        let min = Math.floor(difference);

        if (difference < 1) return 'right now';

        if (difference >= 60) {
            let hours = Math.floor(difference / 60);
            let min = Math.floor(difference % 60);

            if (hours < 2) {
                if (!min) {
                    return '1 hour ago';
                } else {
                    return `1 hour ${min} min ago`;
                }
            } else {
                if (!min) {
                    return `${hours} hours ago`;
                } else {
                    return `${hours} hours ${min} min ago`;
                }
            }
        }

        if (difference >= 1440) {
            let days = Math.floor(difference / 1440);

            if (days < 2) {
                return 'day ago';
            } else {
                return `${days} days ago`;
            }
        }

        if (difference >= 10080) {
            return article.publishedAt;
        }

        return `${min} min ago`;
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