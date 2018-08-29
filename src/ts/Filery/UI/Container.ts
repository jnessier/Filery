import {Control} from './Control';
import {Item} from './Item';

export class Container extends Control {

    protected selectedItem: Item;

    constructor(files: []) {
        super();

        this.element = document.createElement('div');
        this.element.classList.add('filery-container');

        files.forEach((file) => {
            this.append(new Item(file, this.setSelectedItem));
        });

    }

    public setSelectedItem(item: Item) {
        this.selectedItem = item;
    }

    protected getSelectedItem() {
        return this.selectedItem;

    }


}
