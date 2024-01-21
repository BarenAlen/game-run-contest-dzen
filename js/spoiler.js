export default class Spoiler {
    constructor(selector = '.js-spoiler') {

        this.selector = selector;
        this.HEAD = '[data-spoiler-head]';
        this.BODY = '[data-spoiler-body]';
        this.TOGGLER = '[data-spoiler-toggler]';
        this.OPEN_CLASS = 'is-open';
        
        this.spoilersArr = [];

        this.init();
    };

    init() {
        this._findSpoilers();
        if (!this.spoilersArr.length) return
        this._handler();
    }

    _findSpoilers() {
        this.spoilersArr = document.querySelectorAll(this.selector);
    }

    _handler() {
        this.spoilersArr.forEach(item =>  {
            const content = item.querySelector(this.BODY);
            const toggler = item.querySelector(this.TOGGLER) || item;
            
            item.dataset.height = content.scrollHeight.toString();
            // this.open(this.spoilersArr[0]);

            toggler.addEventListener('click', () => {
                if (item.classList.contains(this.OPEN_CLASS)) {
                    this.close(item);
                } else {
                    // this.closeAll();
                    this.open(item);
                } 
            })
        })

        const initialWindowWidth = window.innerWidth;

        window.addEventListener('resize', () => {
            const newWindowWidth = window.innerWidth;

            // пересчитываем высоту контент только если ресайз был по ширине 
            if (initialWindowWidth !== newWindowWidth) {
                this._setHeight();
            }
        })
    }

    _setHeight() {
        this.spoilersArr.forEach(item => {
            const body = item.querySelector(this.BODY);
            if (!body) throw `No body element in ${item.innerHTML}`;
    
            const height = body.scrollHeight.toString();

            item.dataset.height = height;
            
            if (item.classList.contains(this.OPEN_CLASS)) {
                body.style.height = `${height}px`;
            }
        })
    }

    open(el) {
        this.closeAll()
        const body = el.querySelector(this.BODY);

        el.classList.add(this.OPEN_CLASS);
        body.style.height = el.dataset.height + 'px';
    }

    close(el) {
        const body = el.querySelector(this.BODY);

        el.classList.remove(this.OPEN_CLASS);
        body.style.height = '0';
    }

    closeAll() {
        this.spoilersArr.forEach(el => {
            this.close(el);
        })
    }
}