import {Control} from './Control';
import {ItemBody} from './ItemBody';
import {File} from '../Model/File';
import * as $ from 'cheerio';

export class Item extends Control {

    protected file: File;

    constructor(file: File) {
        super();

        console.log(typeof $('<div class="filery-item"></div>'));

        this.element = document.createElement('div');
        this.element.classList.add('filery-item');

        this.element.setAttribute('title', file.getName());

        this.setFile(file);

        this.append(new ItemBody(file));
    }

    public toggleSelect(): this {
        if (this.element.classList.contains('selected')) {
            this.deselect();
        } else {
            this.select();
        }

        return this;
    }

    public select(): this {
        this.element.classList.add('selected');

        this.trigger('selected');

        return this;
    }

    public deselect(): this {
        this.element.classList.remove('selected');

        this.trigger('deselected');

        return this;
    }

    public reset(): this {
        this.element.classList.remove('selected');
        return this;
    }

    public getFile(): File {
        return this.file;
    }

    public setFile(file: File): this {
        this.file = file;
        return this;
    }
}