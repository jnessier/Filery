import {Control} from './Control';
import {File} from '../Model/File';

export class FileThumbnail extends Control {

    constructor(file: File) {
        super();

        this.element = Control.createElement('div', {
            className: 'file-thumbnail'
        });

        let fileThumbnailImage = Control
            .createByTag('span', {
                className: 'file-thumbnail-image'
            })
            .addClass(file.getType());

        if (file.getType() === 'image') {
            fileThumbnailImage.css('background-image: url("' + encodeURI(file.getUrl()) + '"); background-size: contain');
        }

        this.append(fileThumbnailImage);

    }
}