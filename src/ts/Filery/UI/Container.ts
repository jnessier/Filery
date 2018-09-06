import {Control} from './Control';
import {Item} from './Item';
import {File} from '../Model/File';
import {PluginConfig} from '../Plugin';

export class Container extends Control {

    constructor(files: Array<File> = [], config: PluginConfig) {
        super();

        this.element = Control.createElement('div', {
            className: 'filery-container'
        });

        files.forEach((file: File) => {
            this.append(new Item(file, config));
        });
    }


}
