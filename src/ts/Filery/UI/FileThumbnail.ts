import {Control} from './Control';
import {File} from '../Model/File';
import {PluginConfig} from '../Plugin';

export class FileThumbnail extends Control {

    constructor(file: File, config: PluginConfig) {
        super();

        this.element = Control.createElement('div', {
            className: 'file-thumbnail'
        });

        let fileThumbnailImage = Control
            .createByTag('span', {
                className: 'file-thumbnail-image'
            })
            .addClass(file.getType());

        if (config.editor.settings.filery_show_images && file.getType() === 'image') {
            fileThumbnailImage.css('background-image: url("' + encodeURI(file.getUrl()) + '"); background-size: contain');
        }

        this.append(fileThumbnailImage);

    }
}