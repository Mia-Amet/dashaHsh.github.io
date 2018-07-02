class UI {
  constructor() {
    this.container = document.querySelector(".news-container .container .row");
  }

  addOption({name, value}, elem) {
    const option = new Option(name, value);
    elem.options.add(option);
  }

  addNews(news) {
    const img = this.getImgUrl(news),
        description = this.getDescription(news),
        timeAgo = this.getTime(news);

    const template = `
      <div class="col s12 m6">
          <div class="card news left-align">
              <div class="card-image waves-effect waves-block waves-light">
                  <img class="activator" src="${img}">
              </div>
              <div class="card-content">
                  <span class="truncate col s11 card-title activator grey-text text-darken-4">${news.title}</span>
                  <span class="activator card-title col s1"><i class="material-icons right">more_vert</i></span>
                  <div class="section"></div>
                  <p class="col s6"><a class="source-link" href="${news.url}">${news.source.name}</a></p>
                  <p class="col s6 right-align time">
                    <i class="tiny material-icons time-icon">schedule</i>
                    <span class="time-ago">${timeAgo}</span>
                  </p>
              </div>
              <div class="card-reveal">
                  <span class="col s11 card-title grey-text text-darken-4">${news.title}</span>
                  <span class="col s1 card-title"><i class="material-icons right">close</i></span>
                  <p class="col s12 time">
                     <i class="tiny material-icons time-icon">schedule</i>
                     <span class="time-ago">${timeAgo}</span>
                  </p>
                  <p class="col s12">${description}</p>
                  <p class="col s12"><a class="source-link" href="${news.url}">${news.source.name}</a></p>
              </div>
          </div>
      </div>
    `;

    this.container.insertAdjacentHTML("beforeend", template);
  }

  getImgUrl(news) {
    if (news.urlToImage) return news.urlToImage;
    else return 'https://www.providermatching.com/wp-content/uploads/2018/06/news.jpg';
  }

  getDescription(news) {
    if (news.description) return news.description;
    else return '';
  }

  getTime(news) {
    const date = Date.parse(news.publishedAt),
        difference = (Date.now() - date) / 1000;
    let days, hrs,
        min = Math.floor(difference / 60),
        timeAgo = `${min} min ago`;

    if (min < 1) timeAgo = `right now`;

    if (min >= 60) {
      hrs = Math.floor(min / 60);
      min = min % 60;

      timeAgo = hrs < 2 ? `1 hour ${min} min ago`
          : hrs < 24 ? `${hrs} hrs ${min} min ago` : `day ago`;

      if (!min) timeAgo = hrs < 2 ? `1 hour ago`
          : hrs < 24 ? `${hrs} hrs ago` : `day ago`;
    }

      return timeAgo;
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
          <img class="err-img" src="farnsworth.png">
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
    // const errNumber = err.match(/\d/g).join('');
    let errText = `${err.text}, human. Long story short... Bite my shiny metall... you-know-what!`;

    const template = `
    <div class="col s12">
      <div class="card horizontal deep-orange lighten-4 err-card">
        <div class="card-image">
          <img class="err-img" src="bender.png">
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