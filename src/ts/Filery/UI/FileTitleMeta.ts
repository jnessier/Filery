import {FileTitleMetaItem} from './FileTitleMetaItem';
import {Control} from './Control';
import {FileTitleName} from './FileTitleName';
import {File} from '../Model/File';

export class FileTitleMeta extends Control {
    constructor(file: File) {
        super();

        this.element = document.createElement('ul');
        this.element.classList.add('file-title-meta');

        this.append(new FileTitleMetaItem(file.getFormattedSize()));
        this.append(new FileTitleMetaItem(file.getFormattedTime()));
    }
}