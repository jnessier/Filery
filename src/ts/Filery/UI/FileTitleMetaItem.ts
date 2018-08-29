import {Control} from './Control';

export class FileTitleMetaItem extends Control {
    constructor(value: any) {
        super();

        this.element = document.createElement('li');

        this.element.innerHTML = value;
    }
}