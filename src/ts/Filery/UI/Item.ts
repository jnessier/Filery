import {Control} from './Control';
import {File} from '../Model/File';
import {FileThumbnail} from './FileThumbnail';
import {FileTitle} from './FileTitle';
import {FileButtons} from './FileButtons';
import {PluginConfig} from '../Plugin';

export class Item extends Control {

    protected file: File;

    constructor(file: File, config: PluginConfig) {
        super();

        this.file = file;

        this.element = Control.createElement('div', {
            className: 'filery-item'
        });

        this
            .setAttribute('title', file.getName())
            .on('click', (e) => {
                e.preventDefault();
                this.toggleSelect();
            });

        let itemBody = Control
            .createByTag('div', {
                className: 'filery-item-body'
            })
            .append(new FileThumbnail(file))
            .append(new FileTitle(file));

        this
            .append(itemBody)
            .append(new FileButtons(file, config));

    }

    public select() {
        this.addClass('selected');
    }

    public deselect() {
        this.removeClass('selected');
    }

    public toggleSelect() {
        if (this.hasClass('selected')) {
            this.deselect();
        } else {
            this.select();
        }
    }


}