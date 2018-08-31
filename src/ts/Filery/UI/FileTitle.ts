import {Control} from './Control';
import {FileTitleMeta} from './FileTitleMeta';
import {File} from '../Model/File';

export class FileTitle extends Control {
    constructor(file: File) {
        super();

        this.element = Control.createElement('span', {
            className: 'file-title'
        });

        let fileTitleName = Control
            .createByElement('span', {
                className: 'file-title-name'
            })
            .text(file.getName());

        this.append(fileTitleName);

        let fileTitleMeta = Control
            .createByElement('ul', {
                className: 'file-title-meta'
            })
            .append('<li>' + file.getFormattedSize() + '</li>')
            .append('<li>' + file.getFormattedTime() + '</li>');

        this.append(fileTitleMeta);
    }

}