export class Control {

    protected element: HTMLElement;

    protected events = {};

    public static createByElement(element: HTMLElement): Control {
        let control = new Control();
        control.set(element);

        return control;
    }

    public static createByTag(tagName: string, attributes?: {}): Control {
        let control = new Control();
        control.set(Control.createElement(tagName, attributes));

        return control;
    }

    public static createBySelector(query: string, target = document): Array<Control> {
        let controls = new Array<Control>();

        target.querySelectorAll(query).forEach((element) => {
            controls.push(this.createByElement(element as HTMLElement));
        });

        return controls;
    }

    public static createByHtml(html: string): Array<Control> {
        let template = Control.createElement('template') as HTMLTemplateElement;

        template.innerHTML = html.trim();

        let controls = new Array<Control>();
        template.content.childNodes.forEach((element) => {
            controls.push(this.createByElement(element as HTMLElement));
        });

        return controls;
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

    public getAttribute(name: string): string {
        return this.element.getAttribute(name);
    }

    public setAttribute(name: string, value: string): this {
        this.element.setAttribute(name, value);

        return this;
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

    public remove(): this {
        if (this.element) {
            this.element.remove();
        }

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

    public on(type: string, listener: any, options?: any): this {
        this.element.addEventListener(type, listener, options);
        this.events[type] = listener;

        return this;
    }

    public once(type: string, listener: any, options?: any): this {
        this.on(type, listener, options);

        this.trigger(type, (e) => {
            this.off(type);
        });

        return this;
    }

    public off(type: string): this {
        this.element.removeEventListener(type, this.events[type]);

        return this;
    }

    public trigger(type: string, detail?: any): this {
        if (/^(?:mouse|pointer|contextmenu|drag|drop)|click/.test(type)) {
            this.element.dispatchEvent(new MouseEvent(type, detail));
        } else if (/^key/.test(type)) {
            this.element.dispatchEvent(new KeyboardEvent(type, detail));
        } else {
            this.element.dispatchEvent(new CustomEvent(type, detail));
        }

        return this;
    }

    public unwrap(): this {
        let parent = this.element.parentElement;
        while (this.element.firstChild) parent.insertBefore(this.element.firstChild, this.element);
        parent.removeChild(this.element);
        this.element = parent;

        return this;
    }

    public fadeOut(callback, time = 30): this {

        let opacity = 1;
        if (this.element.style.opacity) {
            opacity = Number(this.element.style.opacity);
        }

        let fadeEffect = setInterval(() => {
            if (opacity > 0) {
                opacity -= 0.1;
                this.element.style.opacity = String(opacity);
            } else {
                this.element.style.display = 'none';
                callback(this);
                clearInterval(fadeEffect);
            }
        }, time);

        return this;
    }

    public fadeIn(callback, time = 30): this {

        let opacity = 1;
        if (this.element.style.opacity) {
            opacity = Number(this.element.style.opacity);
        }

        let fadeEffect = setInterval(() => {
            if (opacity < 1) {
                opacity += 0.1;
                this.element.style.opacity = String(opacity);
            } else {
                this.element.style.display = '';
                callback(this);
                clearInterval(fadeEffect);
            }
        }, time);

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
