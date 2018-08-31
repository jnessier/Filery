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

            this.append(item);
        });
    }

    public getSelectedItem(): Item {
        return;
    }

    public append<Container>(child: any): this {
        super.append(child);

        if (child instanceof Item) {
            this.items.push(child);
        }

        return this;
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
