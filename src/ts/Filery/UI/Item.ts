import {Control} from './Control';
import {File} from '../Model/File';
import {FileThumbnail} from './FileThumbnail';
import {FileTitle} from './FileTitle';

export class Item extends Control {

    protected file: File;

    constructor(file: File) {
        super();

        this.file = file;

        this.element = Control.createElement('div', {
            className: 'filery-item'
        });

        let itemBody = Control
            .createByTag('div', {
                className: 'filery-item-body'
            })
            .append(new FileThumbnail(file))
            .append(new FileTitle(file));


        this.append(itemBody);
    }

    public select() {
        this
            .addClass('selected')
            .trigger('selected', [this]);
    }

    public deselect() {
        this
            .removeClass('selected')
            .trigger('deselected', [this]);
    }

    public toggleSelect() {
        if (this.hasClass('selected')) {
            this.deselect();
        } else {
            this.select();
        }
    }

    public getFile(): File {
        return this.file;
    }

}