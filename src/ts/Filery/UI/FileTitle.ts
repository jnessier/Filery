import {Control} from './Control';
import {FileTitleName} from './FileTitleName';
import {FileTitleMeta} from './FileTitleMeta';
import {File} from '../Model/File';
import {FileThumbnailImage} from './FileThumbnailImage';

export class FileTitle extends Control {
    constructor(file: File) {
        super();

        this.element = document.createElement('div');
        this.element.classList.add('file-title');

        this
            .append(new FileTitleName(file))
            .append(new FileTitleMeta(file));
    }

}