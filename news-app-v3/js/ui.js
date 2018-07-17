class UI {
    constructor() {
        this.container = document.querySelector(".news-container .container .row");
        this.alertsContainer = document.querySelector('.alerts-wrapper');
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

        const card = document.createElement('div');
        card.classList.add('col', 's12');
        card.style.opacity = 0;
        card.style.position = 'relative';
        card.style.transition = '0.2s ease-out';

        const template = `
            <div class="card horizontal blue-grey lighten-4 err-card">
                <div class="svg">
                    <svg version="1.1" id="info_cloud" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="75px" y="75px"
                     viewBox="0 0 512 512" xml:space="preserve">
                        <path style="fill:#334F55;" d="M451.617,189.742c-5.358-44.596-43.467-78.808-88.95-78.808c-15.067,0-29.675,3.721-42.742,10.829
                            c-24.308-38.475-66.017-62.029-110.858-62.029c-58.358,0-109.642,39.454-126.525,96.604C34.392,167.425,0,210.292,0,260.267
                            c0,47.358,31.892,89.317,76.8,102.425c0.017,39.983,32.55,72.508,72.533,72.508c20.375,0,39.492-8.467,53.1-23.108
                            c20.15,25.35,50.558,40.175,83.433,40.175c41.65,0,79.683-24.667,96.942-62.117c7.367,1.583,14.908,2.383,22.525,2.383
                            c58.817,0,106.667-47.85,106.667-106.667C512,244.658,488.467,207.475,451.617,189.742z"/>
                        <path style="fill:#83A6E2;" d="M477.807,338.341l-2.015-13.607l-8.442,1.25c-5.517,0.817-10.917,1.325-16.042,1.508l-8.525,0.3
                            l0.608,17.058l8.533-0.308c5.75-0.2,11.775-0.767,17.925-1.675l5.14-0.761c-16.439,20.322-41.541,33.361-69.656,33.361
                            c-8.575,0-17.042-1.208-25.158-3.583c-4.3-1.267-8.817,1.017-10.392,5.192c-13.042,34.767-46.767,58.125-83.917,58.125
                            c-30.967,0-59.325-15.658-75.858-41.883c-1.542-2.45-4.233-3.95-7.133-3.983c-0.025,0-0.058,0-0.083,0
                            c-2.867,0-5.542,1.442-7.125,3.833c-10.308,15.633-27.625,24.967-46.333,24.967c-30.583,0-55.467-24.883-55.467-55.467
                            c0-1.908,0.092-3.8,0.283-5.658c0.433-4.317-2.433-8.275-6.675-9.192c-40.8-8.9-70.408-45.717-70.408-87.55
                            c0-43.517,31.042-80.617,73.808-88.217c3.3-0.583,5.95-3.05,6.775-6.3c13.308-52.371,59.117-88.95,111.417-88.95
                            c41.508,0,79.983,23.317,100.408,60.846c1.15,2.121,3.15,3.65,5.492,4.217c2.35,0.575,4.825,0.108,6.817-1.25
                            c12.067-8.25,26.2-12.613,40.883-12.613c38.242,0,70.042,29.867,72.392,67.992c0.2,3.229,2.208,6.071,5.192,7.333
                            c33.217,14.071,54.683,46.471,54.683,82.542C494.933,305.474,488.53,323.572,477.807,338.341z"/>
                        <g>
                            <rect x="187.733" y="315.733" style="fill:#334F55;" width="128" height="17.067"/>
                            <path style="fill:#334F55;" d="M341.333,238.933c-9.408,0-17.067,7.654-17.067,17.067c0,9.408,7.658,17.067,17.067,17.067
                                c9.408,0,17.067-7.658,17.067-17.067C358.4,246.588,350.742,238.933,341.333,238.933z"/>
                            <path style="fill:#334F55;" d="M213.333,256v-17.067H128V256h51.2c0,9.408,7.658,17.067,17.067,17.067S213.333,265.408,213.333,256
                                z"/>
                            <path style="fill:#334F55;" d="M374.917,287.108l-0.681-1.818c11.316-12.188,18.298-28.454,18.298-46.357
                                c0-37.642-30.625-68.267-68.267-68.267S256,201.292,256,238.933s30.625,68.267,68.267,68.267c13.328,0,25.737-3.898,36.258-10.529
                                c1.526,3.095,4.223,7.895,8.509,13.346l5.275,6.708l13.417-10.55l-5.275-6.708C377.217,292.808,375.033,287.417,374.917,287.108z"
                                />
                        </g>
                        <path style="fill:#C5D35E;" d="M273.067,238.933c0-28.233,22.967-51.2,51.2-51.2s51.2,22.967,51.2,51.2s-22.967,51.2-51.2,51.2
                            S273.067,267.167,273.067,238.933z"/>
                        <path style="fill:#334F55;" d="M405.842,318.567l-7.608-3.867l-7.733,15.217l7.608,3.867c5.458,2.775,11.333,5.05,17.442,6.758
                            l8.217,2.3l4.6-16.433l-8.217-2.3C415.117,322.7,410.3,320.833,405.842,318.567z"/>
                    </svg>
                    
                    <svg version="1.1" id="info_face" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="75px" y="75px"
	                viewBox="0 0 512 512" xml:space="preserve">
                        <path style="fill:#334F55;" d="M467.862,417.769V272.114c0-90.052-73.28-163.31-163.358-163.31h-53.506
                            c-0.565-4.966-0.51-14.023,4.101-19.767c3.573-4.457,9.815-6.716,18.556-6.716h8.828V64.666h-8.828
                            c-14.362,0-25.237,4.483-32.328,13.323c-2.95,3.677-4.879,7.747-6.131,11.804c-8.819-16.06-26.204-33.082-57.192-38.248
                            l-8.707-1.453l-2.905,17.414l8.707,1.453c35.43,5.904,45.915,29.203,48.901,39.845h-16.504c-90.078,0-163.358,73.259-163.358,163.31
                            v145.655H0v17.655h52.966h8.828h26.483v17.655c0,4.875,3.953,8.828,8.828,8.828h26.483h17.655h8.828h17.655h26.483
                            c4.875,0,8.828-3.953,8.828-8.828v-17.655h105.931v17.655c0,4.875,3.953,8.828,8.828,8.828h26.483h17.655h8.828h17.655h26.483
                            c4.875,0,8.828-3.953,8.828-8.828v-17.655h26.483h8.828H512v-17.655H467.862z"/>
                        <g>
                            <path style="fill:#D8D8D8;" d="M185.379,444.252h-17.655v-26.483h-17.655v26.483h-8.828v-26.483h-17.655v26.483h-17.655v-8.828
                                v-8.828c0-9.737,7.944-17.655,17.707-17.655h44.034c9.763,0,17.707,7.918,17.707,17.655v8.828L185.379,444.252L185.379,444.252z"/>
                            <path style="fill:#D8D8D8;" d="M406.069,444.252h-17.655v-26.483h-17.655v26.483h-8.828v-26.483h-17.655v26.483h-17.655v-8.828
                                v-8.828c0-9.737,7.944-17.655,17.707-17.655h44.034c9.763,0,17.707,7.918,17.707,17.655v8.828L406.069,444.252L406.069,444.252z"/>
                        </g>
                        <path style="fill:#C59A83;" d="M422.469,417.769c-3.954-15.185-17.677-26.483-34.107-26.483h-44.034
                            c-16.429,0-30.152,11.297-34.106,26.483H201.779c-3.954-15.185-17.677-26.483-34.107-26.483h-44.035
                            c-16.429,0-30.152,11.297-34.106,26.483H61.793V272.114c0-80.315,65.362-145.655,145.703-145.655h97.009
                            c80.341,0,145.703,65.34,145.703,145.655v145.655H422.469z"/>
                        <g>
                            <circle style="fill:#334F55;" cx="176.552" cy="303.003" r="17.655"/>
                            <circle style="fill:#334F55;" cx="335.448" cy="303.003" r="17.655"/>
                    </svg>
                </div>
                <div class="card-content">
                    <span class="card-title">Hmm... We have some issues</span>
                    <p>${msg}</p>
                </div>
                <button type="button" class="btn myCloseClass">Got it</button>
            </div>
        `;

        card.innerHTML = template;

        this.container.insertAdjacentElement("afterbegin", card);
        UI.bubble(card);
    }

    showError(err) {
        this.clearContainer();

        const card = document.createElement('div');
        card.classList.add('col', 's12');
        card.style.opacity = 0;
        card.style.position = 'relative';
        card.style.transition = '0.2s ease-out';

        const template = `
        <div class="card horizontal brown lighten-4 err-card">
            <div class="svg">
                <svg version="1.1" id="sad_face" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="75px" y="75px"
                        viewBox="0 0 512 512" xml:space="preserve">
                            <path style="fill:#334F55;" d="M467.579,401.567V256c0-89.997-73.24-163.211-163.263-163.211h-96.941
                            c-90.023,0-163.263,73.214-163.263,163.211v145.567H0v17.644h52.933h405.823H512v-17.644H467.579z"/>
                            <path style="fill:#C5D35E;" d="M61.756,401.567V256c0-80.266,65.323-145.567,145.619-145.567h96.941
                            c80.296,0,145.619,65.301,145.619,145.567v145.567H61.756z"/>
                            <g>
                                <path style="fill:#334F55;" d="M202.033,278.099l-88.222,8.822c-4.85,0.487-8.383,4.807-7.9,9.658
                                c0.457,4.549,4.29,7.944,8.77,7.944c0.293,0,0.586-0.013,0.887-0.043l88.222-8.822c4.85-0.487,8.383-4.807,7.9-9.658
                                C211.208,281.153,206.995,277.642,202.033,278.099z"/>
                                <path style="fill:#334F55;" d="M397.88,286.921l-88.222-8.822c-4.902-0.465-9.167,3.054-9.658,7.9
                                c-0.483,4.85,3.05,9.171,7.9,9.658l88.222,8.822c0.302,0.03,0.595,0.043,0.888,0.043c4.48,0,8.314-3.395,8.771-7.944
                                C406.262,291.728,402.73,287.408,397.88,286.921z"/>
                                <path style="fill:#334F55;" d="M260.17,304.522h-8.65c-17.076,0-30.964,13.854-30.964,30.878v22.056
                                c0,4.872,3.946,8.822,8.822,8.822h52.933c4.876,0,8.822-3.95,8.822-8.822V335.4C291.134,318.376,277.246,304.522,260.17,304.522z"/>
                            </g>
                            <path style="fill:#E4AD4B;" d="M273.489,348.634H238.2V335.4c0-7.297,5.979-13.233,13.32-13.233h8.65
                            c7.34,0,13.32,5.936,13.32,13.233L273.489,348.634L273.489,348.634z"/>
                        </svg>
                <svg version="1.1" id="sad_cloud" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="75px" y="75px"
                        viewBox="0 0 512 512" xml:space="preserve">
                            <path style="fill:#334F55;" d="M451.617,189.742c-5.358-44.596-43.467-78.808-88.95-78.808c-15.067,0-29.675,3.721-42.742,10.829
                                c-24.308-38.475-66.017-62.029-110.858-62.029c-58.358,0-109.642,39.454-126.525,96.604C34.392,167.425,0,210.292,0,260.267
                                c0,47.358,31.892,89.317,76.8,102.425c0.017,39.983,32.55,72.508,72.533,72.508c20.375,0,39.492-8.467,53.1-23.108
                                c20.15,25.35,50.558,40.175,83.433,40.175c41.65,0,79.683-24.667,96.942-62.117c7.367,1.583,14.908,2.383,22.525,2.383
                                c58.817,0,106.667-47.85,106.667-106.667C512,244.658,488.467,207.475,451.617,189.742z"/>
                            <path style="fill:#D8D8D8;" d="M405.333,375.467c-8.575,0-17.042-1.208-25.158-3.583c-4.3-1.267-8.817,1.017-10.392,5.192
                                c-13.042,34.767-46.767,58.125-83.917,58.125c-30.967,0-59.325-15.658-75.858-41.883c-1.542-2.45-4.233-3.95-7.133-3.983
                                c-0.025,0-0.058,0-0.083,0c-2.867,0-5.542,1.442-7.125,3.833c-10.308,15.633-27.625,24.967-46.333,24.967
                                c-30.583,0-55.467-24.883-55.467-55.467c0-1.908,0.092-3.8,0.283-5.658c0.433-4.317-2.433-8.275-6.675-9.192
                                c-40.8-8.9-70.408-45.717-70.408-87.55c0-43.517,31.042-80.617,73.808-88.217c3.3-0.583,5.95-3.05,6.775-6.3
                                c13.308-52.371,59.117-88.95,111.417-88.95c41.508,0,79.983,23.317,100.408,60.846c1.15,2.121,3.15,3.65,5.492,4.217
                                c2.35,0.575,4.825,0.108,6.817-1.25c12.067-8.25,26.2-12.613,40.883-12.613c38.242,0,70.042,29.867,72.392,67.992
                                c0.2,3.229,2.208,6.071,5.192,7.333c33.217,14.071,54.683,46.471,54.683,82.542C494.933,335.275,454.742,375.467,405.333,375.467z"
                                />
                            <g>
                                <path style="fill:#334F55;" d="M285.783,298.667h-8.367c-8.399,0-15.973,3.488-21.417,9.058c-5.443-5.57-13.018-9.058-21.417-9.058
                                    h-8.367c-16.516,0-29.95,13.4-29.95,29.867v12.8h17.067v-12.8c0-7.058,5.783-12.8,12.883-12.8h8.367
                                    c7.1,0,12.883,5.742,12.883,12.8V358.4h17.067v-29.867c0-7.058,5.783-12.8,12.883-12.8h8.367c7.1,0,12.883,5.742,12.883,12.8V358.4
                                    h17.067v-29.867C315.733,312.067,302.3,298.667,285.783,298.667z"/>
                                <path style="fill:#334F55;" d="M247.467,230.4c0-28.233-22.967-51.2-51.2-51.2s-51.2,22.967-51.2,51.2s22.967,51.2,51.2,51.2
                                    S247.467,258.633,247.467,230.4z"/>
                                <path style="fill:#334F55;" d="M315.733,179.2c-28.233,0-51.2,22.967-51.2,51.2s22.967,51.2,51.2,51.2s51.2-22.967,51.2-51.2
                                    S343.967,179.2,315.733,179.2z"/>
                            </g>
                            <g>
                                <path style="fill:#C5D35E;" d="M162.133,230.4c0-18.821,15.308-34.133,34.133-34.133S230.4,211.579,230.4,230.4
                                    s-15.308,34.133-34.133,34.133S162.133,249.221,162.133,230.4z"/>
                                <path style="fill:#C5D35E;" d="M315.733,264.533c-18.825,0-34.133-15.312-34.133-34.133s15.308-34.133,34.133-34.133
                                    c18.825,0,34.133,15.312,34.133,34.133S334.558,264.533,315.733,264.533z"/>
                            </g>
                            <g>
                                <path style="fill:#334F55;" d="M315.733,213.333c-9.408,0-17.067,7.654-17.067,17.067c0,9.412,7.658,17.067,17.067,17.067
                                    c9.408,0,17.067-7.654,17.067-17.067C332.8,220.988,325.142,213.333,315.733,213.333z"/>
                                <path style="fill:#334F55;" d="M213.333,230.4c0-9.412-7.658-17.067-17.067-17.067S179.2,220.988,179.2,230.4
                                    c0,9.412,7.658,17.067,17.067,17.067S213.333,239.813,213.333,230.4z"/>
                            </g>
                        </svg>
            </div>
            <div class="card-content">
                <span class="card-title">Uh-oh! Something went wrong</span>
                <p>Erroe ${err.status}! ${err.text}</p>
            </div>
            <button type="button" class="btn myCloseClass">Got it</button>
        </div>
        `;

        card.innerHTML = template;

        this.container.insertAdjacentElement("afterbegin", card);
        UI.bubble(card);
    }

    showToast(msg) {
        const alert = document.createElement('div');
        console.log(msg);

        alert.classList.add('alert', 'card', 'lighten-4', `${msg.add ? 'teal' : 'brown'}`);
        alert.innerHTML = `
        <p class="card-title">${msg.text}</p>
        `;
        alert.style.opacity = 0;
        alert.style.position = 'relative';
        alert.style.transition = '0.15s ease-out';
        alert.style.padding = '0 20px';
        alert.style.borderRadius = '3px';
        alert.style.display = 'flex';
        alert.style.alignItems = 'center';
        alert.style.justifyContent = 'space-between';

        const svg = msg.add ?
            `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="75px" height="75px"
         viewBox="0 0 512 512" xml:space="preserve">
            <path style="fill:#334F55;" d="M467.862,401.655V256c0-90.052-73.28-163.31-163.358-163.31h-97.009
                c-90.078,0-163.358,73.259-163.358,163.31v145.655H0v17.655h52.966h70.621h44.138h26.483h247.172h17.655H512v-17.655H467.862z"/>
            <path style="fill:#63CB6B;" d="M441.379,401.655H194.207h-26.483h-44.138H61.793V256c0-80.315,65.362-145.655,145.703-145.655
                h97.009c80.341,0,145.703,65.34,145.703,145.655v145.655H441.379z"/>
            <g>
                <path style="fill:#334F55;" d="M317.793,242.759c19.47,0,35.31-15.84,35.31-35.31v-8.828h-17.655v8.828
                    c0,9.737-7.918,17.655-17.655,17.655c-9.737,0-17.655-7.918-17.655-17.655v-8.828h-17.655v8.828
                    C282.483,226.918,298.323,242.759,317.793,242.759z"/>
                <path style="fill:#334F55;" d="M185.379,242.759c19.47,0,35.31-15.84,35.31-35.31v-8.828h-17.655v8.828
                    c0,9.737-7.918,17.655-17.655,17.655c-9.737,0-17.655-7.918-17.655-17.655v-8.828h-17.655v8.828
                    C150.069,226.918,165.909,242.759,185.379,242.759z"/>
                <path style="fill:#334F55;" d="M397.241,260.414H114.759c-4.875,0-8.828,3.953-8.828,8.828v30.897
                    c0,21.905,17.823,39.724,39.733,39.724h220.672c21.909,0,39.733-17.819,39.733-39.724v-30.897
                    C406.069,264.366,402.116,260.414,397.241,260.414z"/>
            </g>
            <g>
                <rect x="220.69" y="278.069" style="fill:#D8D8D8;" width="26.483" height="44.138"/>
                <rect x="176.552" y="278.069" style="fill:#D8D8D8;" width="26.483" height="44.138"/>
                <rect x="264.828" y="278.069" style="fill:#D8D8D8;" width="26.483" height="44.138"/>
                <rect x="308.966" y="278.069" style="fill:#D8D8D8;" width="26.483" height="44.138"/>
                <path style="fill:#D8D8D8;" d="M123.586,300.138v-22.069h35.31v44.138h-13.233C133.491,322.207,123.586,312.306,123.586,300.138z"
                    />
                <path style="fill:#D8D8D8;" d="M388.414,300.138c0,12.168-9.905,22.069-22.078,22.069h-13.233v-44.138h35.31V300.138z"/>
            </g>
            <path style="fill:#334F55;" d="M291.31,348.69H220.69c-4.875,0-8.828,3.953-8.828,8.828s3.953,8.828,8.828,8.828h70.621
                c4.875,0,8.828-3.953,8.828-8.828S296.185,348.69,291.31,348.69z"/>
        </svg>`
        : `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="75px" height="75px"
             viewBox="0 0 512 512" xml:space="preserve">
            <path style="fill:#334F55;" d="M451.617,189.742c-5.358-44.592-43.467-78.808-88.95-78.808c-15.075,0-29.683,3.717-42.742,10.825
                c-24.308-38.475-66.017-62.025-110.858-62.025c-58.358,0-109.642,39.458-126.525,96.608C34.392,167.433,0,210.3,0,260.267
                c0,47.358,31.892,89.317,76.8,102.425c0.017,39.983,32.55,72.508,72.533,72.508c20.375,0,39.492-8.467,53.1-23.108
                c20.15,25.35,50.558,40.175,83.433,40.175c41.65,0,79.683-24.667,96.942-62.117c7.367,1.583,14.908,2.383,22.525,2.383
                c58.817,0,106.667-47.85,106.667-106.667C512,244.658,488.467,207.475,451.617,189.742z"/>
            <path style="fill:#E65F58;" d="M405.333,375.467c-8.575,0-17.042-1.208-25.158-3.583c-4.3-1.267-8.817,1.017-10.392,5.192
                c-13.042,34.767-46.767,58.125-83.917,58.125c-30.967,0-59.325-15.658-75.858-41.883c-1.542-2.45-4.233-3.95-7.133-3.983
                c-0.025,0-0.058,0-0.083,0c-2.867,0-5.542,1.442-7.125,3.833c-10.308,15.633-27.625,24.967-46.333,24.967
                c-30.583,0-55.467-24.883-55.467-55.467c0-1.908,0.092-3.8,0.283-5.658c0.433-4.317-2.433-8.275-6.675-9.192
                c-40.8-8.9-70.408-45.717-70.408-87.55c0-43.517,31.042-80.617,73.808-88.217c3.3-0.583,5.95-3.05,6.775-6.3
                c13.308-52.375,59.117-88.95,111.417-88.95c41.508,0,79.983,23.317,100.408,60.842c1.15,2.125,3.15,3.658,5.492,4.225
                c2.383,0.567,4.825,0.117,6.817-1.258c12.058-8.25,26.192-12.608,40.883-12.608c38.242,0,70.042,29.867,72.392,67.992
                c0.2,3.233,2.208,6.067,5.192,7.333c33.217,14.067,54.683,46.467,54.683,82.542C494.933,335.275,454.742,375.467,405.333,375.467z"
                />
            <path style="fill:#334F55;" d="M332.85,179.242l-8.583,0.042l-8.567-0.042c-21.558-0.2-38.625-0.317-49.65,10.617
                c-3.849,3.826-6.447,8.863-8.08,14.942h-21.007c-1.632-6.079-4.23-11.116-8.08-14.942c-11.025-10.933-28.092-10.808-49.65-10.617
                l-8.567,0.042l-8.583-0.042c-23.142-0.217-45.1-0.35-57.958,12.408c-6.808,6.75-10.258,16.467-10.258,28.867
                c0,50.392,19.7,78.15,55.467,78.15c39.058,0,88.42-35.999,89.5-76.8H256.1c1.08,40.801,50.441,76.8,89.5,76.8
                c35.767,0,55.467-27.758,55.467-78.15c0-12.4-3.45-22.117-10.258-28.867C377.942,178.892,356,179.017,332.85,179.242z"/>
            <g>
                <path style="fill:#83A6E2;" d="M149.333,281.6c-25.483,0-38.4-20.55-38.4-61.083c0-7.792,1.708-13.275,5.217-16.758
                    c6.733-6.683,21.4-7.492,37.85-7.492c2.617,0,5.275,0.017,7.95,0.042l8.717,0.042l8.7-0.042c17.608-0.175,31.525-0.25,37.492,5.667
                    c3.375,3.342,5.008,9.408,5.008,18.542C221.867,251.975,181.008,281.6,149.333,281.6z"/>
                <path style="fill:#83A6E2;" d="M345.6,281.6c-31.675,0-72.533-29.625-72.533-61.083c0-9.133,1.633-15.2,5.008-18.542
                    c5.083-5.042,15.933-5.708,29.917-5.708c2.433,0,4.967,0.017,7.575,0.042l8.7,0.042l8.717-0.042c19.492-0.183,37.992-0.3,45.8,7.45
                    c3.508,3.483,5.217,8.966,5.217,16.758C384,261.05,371.083,281.6,345.6,281.6z"/>
            </g>
            <g>
                <path style="fill:#334F55;" d="M147.567,207.3l-21.758,21.758c-3.333,3.333-3.333,8.733,0,12.067c1.667,1.667,3.85,2.5,6.033,2.5
                    s4.367-0.833,6.033-2.5l21.758-21.758c3.333-3.333,3.333-8.733,0-12.067C156.3,203.967,150.9,203.967,147.567,207.3z"/>
                <path style="fill:#334F55;" d="M352.367,207.3l-21.758,21.758c-3.333,3.333-3.333,8.733,0,12.067c1.667,1.667,3.85,2.5,6.033,2.5
                    s4.367-0.833,6.033-2.5l21.758-21.758c3.333-3.333,3.333-8.733,0-12.067C361.1,203.967,355.7,203.967,352.367,207.3z"/>
                
                    <rect x="234.666" y="285.208" transform="matrix(-0.1521 0.9884 -0.9884 -0.1521 625.9796 162.7025)" style="fill:#334F55;" width="17.067" height="129.306"/>
            </g>
        </svg>`;

        alert.insertAdjacentHTML("afterbegin", svg);
        this.alertsContainer.insertAdjacentElement("beforeend", alert);

        UI.bubble(alert);
    }

    static bubble(element) {
        let opacity = 0;
        let translateY = 40;

        function animate(time) {
            opacity += 0.05;

            if (parseFloat(element.style.opacity) <= 0.6) {
                translateY -= 4.5;
            } else {
                translateY += 2.5;
            }

            element.style.opacity = opacity;
            element.style.transform = `translateY(${translateY}px)`;

            const raf = requestAnimationFrame(animate);

            if (parseFloat(element.style.opacity) >= 1) {
                cancelAnimationFrame(raf);

                if (element.classList.contains('alert')) {
                    setTimeout(() => {
                        UI.fade(element);
                    }, 4000);
                }
            }
        }

        animate();
    }

    static fade(element) {
        let opacity = 1;

        function animate(time) {
            opacity -= 0.05;
            element.style.opacity = opacity;
            const raf = requestAnimationFrame(animate);

            if (parseFloat(element.style.opacity) <= 0) {
                cancelAnimationFrame(raf);

                element.style.transform = 'translateY(-40px)';

                setTimeout(() => {
                    element.remove();
                }, 300);
            }
        }

        animate();
    }
}