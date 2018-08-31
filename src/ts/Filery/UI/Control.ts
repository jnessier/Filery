export class Control {

    protected element: HTMLElement;

    protected events = {};

    public static createByElement(tagName: string, attributes?: {}): Control {
        let control = new Control();
        control.set(Control.createElement(tagName, attributes));

        return control;
    }

    public static createBySelector(query: string): Control {
        let control = new Control();
        control.set(document.querySelector(query));

        return control;
    }

    protected static createElement(tagName: string, attributes?: {}): HTMLElement {
        let element = document.createElement(tagName);

        if (attributes) {
            Object.keys(attributes).forEach((key: string) => {
                let value = attributes[key];
                if (key === 'className') {
                    element.classList.add(value);
                } else if (key.startsWith('on') && typeof value === 'function') {
                    element.addEventListener(key.substring(2), value);
                } else {
                    if (typeof value === 'boolean' && key) {
                        element.setAttribute(key, '');
                    } else {
                        element.setAttribute(key, value);
                    }
                }
            });
        }

        return element;
    }

    public html(html: string): this {
        this.element.innerHTML = html;

        return this;
    }

    public get(): HTMLElement {
        return this.element;
    }

    public set(element: HTMLElement) {
        this.element = element;

        return this;
    }

    public append(child: any): this {
        if (child instanceof Control) {
            this.element.appendChild(child.get());
        } else if (typeof child === 'string') {
            this.element.insertAdjacentHTML('beforeend', child);
        }

        return this;
    }

    public text(text: string): this {
        this.element.appendChild(document.createTextNode(text));

        return this;
    }

    public prepend(child: any): this {
        if (child instanceof Control) {
            this.element.insertAdjacentElement('afterbegin', child.get());
        } else if (typeof child === 'string') {
            this.element.insertAdjacentHTML('afterbegin', child);
        }

        return this;
    }

    public css(styles: any): this {
        if (typeof styles === 'object') {
            Object.keys(styles).forEach((key: string) => {
                this.element.style[key] = styles[key];
            });
        } else if (typeof styles === 'string') {
            this.element.style.cssText = styles;
        }

        return this;
    }

    public on(type: string, listener: any): this {
        this.element.addEventListener(type, listener);
        this.events[type] = listener;

        return this;
    }

    public off(type: string): this {
        this.element.removeEventListener(type, this.events[type]);

        return this;
    }

    public trigger(type: string, detail?: any): this {
        let event = new CustomEvent(type, detail);
        this.element.dispatchEvent(event);

        return this;
    }

    public addClass(className: string): this {
        this.element.classList.add(className);

        return this;
    }

    public removeClass(className: string): this {
        this.element.classList.remove(className);

        return this;
    }

    public hasClass(className: string): boolean {
        return this.element.classList.contains(className);
    }

}
