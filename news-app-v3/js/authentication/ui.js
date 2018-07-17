class UI {
    constructor() {
        this.container = document.getElementById('mainContainer');
        this.errorContainer = document.getElementById('errorContainer');
    }

    clearContainer(elem) {
        elem.innerHTML = "";
    }

    loadPage(markup) {
        this.clearContainer(this.container);
        this.container.insertAdjacentHTML("afterbegin", markup);
    }

    showError(err) {
        if (document.querySelector('.err-card')) {
            document.querySelector('.err-card').remove();
        }

        const card = document.createElement('div');
        card.classList.add('card', 'horizontal', 'brown', 'lighten-4', 'err-card');
        card.style.opacity = 0;
        card.style.position = 'relative';
        card.style.transition = '0.2s ease-out';

        const template = `
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
            <p class="center-align">${err.message.slice(0, -1)}!</p>
        </div>
        `;

        card.innerHTML = template;

        this.container.insertAdjacentElement("afterbegin", card);
        this.bubble(card);
    }

    bubble(element) {
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

                setTimeout(() => {
                    UI.fade(element);
                    }, 3000);
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

    validate(input) {
        const label = input.closest('.input-field').lastElementChild;

        if (!input.value) {
            input.style.borderBottom = '1px solid #ff7043';
            label.textContent = input.form.name === 'signin-form' ? `Please, fill in ${input.id}` : `Please, set up ${input.id}`;
            label.classList.add('invalid');
        }
    }
}