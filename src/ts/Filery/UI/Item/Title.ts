import {Control} from '../Control';
import {File} from '../../Data/File';

export class Title extends Control {
    constructor(file: File) {
        super();

        this.element = Control.createElement('span', {
            className: 'title'
        });

        let titleName = Control
            .createByTag('span', {
                className: 'title-name'
            })
            .text(file.getName());

        this.append(titleName);

        let titleMeta = Control
            .createByTag('ul', {
                className: 'title-meta'
            });

        if (file.getType() !== 'folder') {
            titleMeta.append('<li>' + file.getFormattedSize() + '</li>');
        }
        titleMeta.append('<li>' + file.getFormattedTime() + '</li>');

        this.append(titleMeta);
    }

}