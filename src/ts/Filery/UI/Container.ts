import {Control} from './Control';
import {Item} from './Item';
import {File} from '../Model/File';

export class Container extends Control {
    protected items = [];

    protected selectedIndex: number;

    constructor(files: []) {
        super();

        this.element = Control.createElement('div', {
            className: 'filery-container'
        });

        files.forEach((file: File, index) => {

            let item = new Item(file);
            item
                .on('click', (e) => {
                    e.preventDefault();

                    if (index !== this.selectedIndex && this.items[this.selectedIndex]) {
                        this.items[this.selectedIndex].deselect();
                    }

                    this.selectedIndex = index;
                    item.toggleSelect();

                });

            this.items.push(item);

            this.append(item);
        });
    }

    public selectListener(selectCallback: any, deselectCallback?: any) {
        this.items.forEach((item) => {
            if (typeof selectCallback === 'function') {
                item.on('selected', (e) => {
                    selectCallback(item);
                });
            }
            if (typeof deselectCallback === 'function') {
                item.on('deselected', (e) => {
                    deselectCallback(item);
                });
            }
        });
    }


}
