import {Control} from './Control';
import {FileTitleName} from './FileTitleName';
import {FileTitleMeta} from './FileTitleMeta';
import {FileThumbnailImage} from './FileThumbnailImage';
import {FileTitle} from './FileTitle';
import {File} from '../Model/File';

export class FileThumbnail extends Control {

    constructor(file: File) {
        super();

        this.element = document.createElement('div');
        this.element.classList.add('file-thumbnail');

        this
            .append(new FileThumbnailImage(file));

    }
}