import {Control} from './Control';
import {File} from '../Model/File';

export class FileThumbnailImage extends Control {

    constructor(file: File) {
        super();

        this.element = document.createElement('span');
        this.element.classList.add('file-thumbnail-image');

        this.element.classList.add(file.getType());

        if (file.getType() === 'image') {
            let style = 'background-image: url(\'' + encodeURI(file.getUrl()) + '\'); background-size: contain';
            this.element.setAttribute('style', style);
        }
    }
}