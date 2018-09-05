import {Control} from './Control';
import {Item} from './Item';

declare var tinymce: any;

export class ContextMenu extends Control {
    protected item: Item;

    protected callbacks = {
        delete: (item) => {
            // nothing
        },
        select: (item) => {
            // nothing
        },
        link: (item) => {
            // nothing
        },
        image: (item) => {
            // nothing
        }
    };

    private insertType = 'insert';

    constructor(insertType: string) {
        super();

        this.element = Control.createElement('div', {
            className: 'filery-contextmenu',
        });

        this.insertType = insertType;
    }

    public setCallback(key: string, callback: any): this {
        this.callbacks[key] = callback;

        return this;
    }

    public setItem(item: Item): this {
        this.item = item;

        let menu = Control.createByTag('ul');

        if (this.insertType === 'select') {
            menu.append(Control.createByTag('li')
                .text(tinymce.i18n.translate('Select'))
                .on('click', (e) => {
                    e.preventDefault();
                    this.callbacks.select(this.item);
                }));
        } else {
            menu.append(Control.createByTag('li')
                .text(tinymce.i18n.translate('Insert link'))
                .on('click', (e) => {
                    e.preventDefault();
                    this.callbacks.link(this.item);
                }));

            if (this.item.getFile().getType() === 'image') {
                menu.append(Control.createByTag('li')
                    .text(tinymce.i18n.translate('Insert image'))
                    .on('click', (e) => {
                        e.preventDefault();
                        this.callbacks.image(this.item);
                    }));
            }
        }

        menu
            .append(Control.createByTag('li')
                .text(tinymce.i18n.translate('Delete'))
                .on('click', (e) => {
                    e.preventDefault();
                    this.callbacks.delete(this.item);
                }));

        this
            .html('')
            .append(menu);

        return this;
    }

    public setPosition(top: number, left: number): this {
        this.css({
            left: left + 'px',
            top: top + 'px',
        });

        return this;
    };

    public show() {
        this
            .addClass('show')
            .trigger('showed', [this]);
    }

    public hide() {
        this
            .removeClass('show')
            .trigger('hidden', [this]);
    }

    public toggleShow() {
        if (this.hasClass('show')) {
            this.hide();
        } else {
            this.show();
        }
    }
}

