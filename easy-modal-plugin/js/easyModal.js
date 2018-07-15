(function ($) {
    class Modal {
        constructor(element, options) {
            this.modal = element;
            this.defaultOptions = {
                closeClass: ".close-modal",
                overlayOpacity: 0.7,
                duration: 500,
                autoClose: true,
                autoCloseTime: 5000
            };
            this.options = $.extend(this.defaultOptions, options);
        }

        init() {
            $.when(this.showOverlay(), this.showModal())
                .done((overlay, modal) => {
                    $("body").css({"overflow-y": "hidden"});
                    overlay.animate({"opacity": 1}, this.options.duration);
                    modal.animate({"opacity": 1}, this.options.duration);
                })
                .then(this.autoCloseModal());

            // set events
            this.setIvents();
        }

        setIvents() {
            $(".overlay").on("click", (e) => this.closeModal());
            $(this.options.closeClass).on("click", (e) => this.closeModal());
        }

        clearIvents() {
            $(".overlay").off("click");
            $(this.options.closeClass).off("click");
        }

        showOverlay() {
            const overlay = new $.Deferred();
            const options = {
                "display": "block",
                "position": "fixed",
                "top": 0,
                "left": 0,
                "width": "100%",
                "height": "100%",
                "z-index": 999,
                "opacity": 0,
                "background-color": `rgba(0, 0, 0, ${this.options.overlayOpacity})`
            };

            return overlay
                .done(elem => elem.css(options))
                .resolve($('<div class="overlay"></div>'))
                .done(elem => elem.insertBefore(this.modal))
                .promise();
        }

        showModal() {
            const modal = $.Deferred();
            const {halfWidth, halfHeight} = Modal.calcModalSize(this);
            const options = {
                "display": "block",
                "position": "fixed",
                "top": "50%",
                "left": "50%",
                "z-index": 1001,
                "opacity": 0,
                "margin-top": `-${halfHeight}px`,
                "margin-left": `-${halfWidth}px`,
            };

            return modal
                .done(elem => elem.css(options))
                .resolve(this.modal)
                .promise();
        }

        // Methods not using deferred objects
        // showOverlay() {
        //     // hide body scrolling
        //     $("body").css({"overflow-y": "hidden"});
        //
        //     const overlay = $('<div class="overlay"></div>').css({
        //         "display": "block",
        //         "position": "fixed",
        //         "top": 0,
        //         "left": 0,
        //         "width": "100%",
        //         "height": "100%",
        //         "z-index": 999,
        //         "opacity": 0,
        //         "background-color": `rgba(0, 0, 0, ${this.options.overlayOpacity})`
        //     });
        //
        //     this.modal.before(overlay);
        // }
        //
        // showModal() {
        //     // get modal height & width
        //     const {halfWidth, halfHeight} = Modal.calcModalSize(this);
        //
        //     // show overlay
        //     $(".overlay").animate({
        //         "opacity": 1
        //     }, this.options.duration);
        //
        //     // show modal
        //     this.modal.css({
        //         "display": "block",
        //         "position": "fixed",
        //         "top": "50%",
        //         "left": "50%",
        //         "z-index": 1001,
        //         "opacity": 0,
        //         "margin-top": `-${halfHeight}px`,
        //         "margin-left": `-${halfWidth}px`,
        //     }).animate({
        //         "opacity": 1
        //     }, this.options.duration);
        // }

        closeModal() {
            $("body").css({"overflow-y": "auto"});
            // removing overlay
            $(".overlay").animate({"opacity": 0}, this.options.duration, () => $(".overlay").remove());
            // hide modal window
            this.modal.animate({
                "opacity": 0
            }, this.options.duration, () => this.modal.css({"display": "none"}));

            // delete events
            this.clearIvents();
        }

        autoCloseModal() {
            if (this.options.autoClose) {
                setTimeout(() => {
                    this.closeModal();
                }, this.options.autoCloseTime);
            }
        }

        static calcModalSize(elem) {
            const halfWidth = elem.modal.outerWidth() / 2;
            const halfHeight = elem.modal.outerHeight() / 2;

            return {
                halfWidth,
                halfHeight
            }
        }
    }

    $.fn.easyModal = function (options) {
        new Modal(this, options).init();
    }
})(jQuery);
