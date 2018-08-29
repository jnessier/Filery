import {Control} from './Control';
import {Item} from './Item';

export class Container extends Control {

    constructor(files: []) {
        super();

        this.element = document.createElement('div');
        this.element.classList.add('filery-container');

        files.forEach((file) => {
            this.append(new Item(file));
        });

    }

    protected getSelectedItem() {
        let item = Item.select('.selected', this.element);

    }


}
