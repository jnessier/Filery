import {Control} from './Control';
import {File} from '../Model/File';

export class FileTitleMeta extends Control {
    constructor(file: File) {
        super();

        this.element = Control.createElement('ul', {
            className: 'file-title-meta'
        });

        this
            .append('<li>' + file.getFormattedSize() + '</li>')
            .append('<li>' + file.getFormattedTime() + '</li>');
    }
}