import {Control} from './Control';
import {ItemBody} from './ItemBody';
import {File} from '../Model/File';

export class Item extends Control {

    protected file: File;

    constructor(file: File, select?: any, deselect?: any) {
        super();

        this.element = document.createElement('div');
        this.element.classList.add('filery-item');

        this.element.setAttribute('title', file.getName());

        this.setFile(file);

        this
            .on('click', (e) => {
                e.preventDefault();
                this.toggleSelect(select, deselect);
            });

        this.append(new ItemBody(file));
    }

    public toggleSelect(select?: any, deselect?: any): this {
        if (this.element.classList.contains('selected')) {
            this.deselect(deselect);
        } else {
            this.select(select);
        }

        return this;
    }

    public select(select?: any): this {
        this.element.classList.add('selected');

        if (typeof select === 'function') {
            select(this);
        }

        return this;
    }

    public deselect(deselect?: any): this {
        this.element.classList.remove('selected');

        if (typeof deselect === 'function') {
            deselect(this);
        }

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