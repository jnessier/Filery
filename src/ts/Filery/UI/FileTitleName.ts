import {Control} from './Control';
import {File} from '../Model/File';

export class FileTitleName extends Control {

    constructor(file: File) {
        super();

        this.element = document.createElement('span');
        this.element.classList.add('file-title-name');

        this.element.innerHTML = file.getName();

    }

}