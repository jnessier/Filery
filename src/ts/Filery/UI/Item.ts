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

        this.setAttribute('title', file.getName());

        let itemBody = Control
            .createByTag('div', {
                className: 'filery-item-body'
            });

        if (config.filter.length === 0 || config.filter.indexOf(file.getType()) !== -1) {
            itemBody.on('click', (e) => {
                e.preventDefault();
                this.getSiblings().forEach((item) => {
                    item.removeClass('selected');
                });
                if (this.hasClass('selected')) {
                    this.removeClass('selected');
                } else {
                    this.addClass('selected');
                }
            });
        } else {
            this.addClass('disabled');
        }

        itemBody
            .append(new FileThumbnail(file))
            .append(new FileTitle(file));

        this
            .append(itemBody)
            .append(new FileButtons(file, config));

    }


}