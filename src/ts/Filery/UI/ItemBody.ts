import {Control} from './Control';
import {FileThumbnail} from './FileThumbnail';
import {FileTitle} from './FileTitle';
import {File} from '../Model/File';
import {Item} from './Item';

export class ItemBody extends Control {

    constructor(file) {
        super();

        this.element = document.createElement('div');
        this.element.classList.add('filery-item-body');

        this
            .append(new FileThumbnail(file))
            .append(new FileTitle(file));

    }
}