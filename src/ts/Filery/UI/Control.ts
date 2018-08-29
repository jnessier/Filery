export class Control {

    protected element: Element;

    protected events = {};

    protected children = [];

    public static select<T extends Control>(this: { new(): T }, query: string, scope = document): T {
        let element = scope.querySelector(query),
            control = new this();

        if (element) {
            control.setElement(element);
        }

        return control;
    }

    public static create<T extends Control>(this: { new(): T }, tagName: string, attributes?: any): T {
        let element = document.createElement(tagName),
            control = new this();

        attributes.forEach.call(attributes, (value, key) => {
            element.setAttribute(key, value);
        });

        return control.setElement(element);
    }

    public getChildren() {
        return this.children;
    }

    public getElement(): Element {
        return this.element;
    }

    public setElement(element: Element): this {
        this.element = element;

        return this;
    }

    public append<T extends Control>(control: T) {
        let childElement = control.getElement();

        this.element.appendChild(childElement);
        this.children.push(control);

        return this;
    }

    public prepend<T extends Control>(control: T) {
        let childElement = control.getElement();

        this.element.insertBefore(childElement, this.element.childNodes[0]);
        this.children.unshift(control);

        return this;
    }

    public on(type: string, listener: any) {

        this.element.addEventListener(type, listener);
        this.events[type] = listener;
        return this;
    }

    public off(type: string) {
        this.element.removeEventListener(type, this.events[type]);

        return this;
    }

    public trigger(type: string, detail?: any) {
        let event = new CustomEvent(type, detail);
        this.element.dispatchEvent(event);

        return this;
    }

}
