((window, document) => {

    var owner = document.currentScript.ownerDocument;

    class TleDisplay extends HTMLElement {

        constructor() {
            this.createdCallback();
        }

        createdCallback() {
            this.root = this.createShadowRoot();
            this.template = owner.querySelector("template");
            this.clone = this.template.content.cloneNode(this.template);

            var line1 = this.getAttribute('line1');
            var line2 = this.getAttribute('line2');

            $(this.clone).find('.line1').html(line1);
            $(this.clone).find('.line2').html(line2);

            this.root.appendChild(this.clone);
        }

    }

    document.registerElement('tle-display', TleDisplay);
})(window, document);