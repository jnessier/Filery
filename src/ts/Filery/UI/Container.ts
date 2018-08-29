import {Control} from './Control';
import {Item} from './Item';

export class Container extends Control {

    constructor(files: []) {
        super();

        this.element = document.createElement('div');
        this.element.classList.add('filery-container');

        files.forEach((file, index) => {

            let item = new Item(file);

            this.append(item);

            item
                .on('click', (e) => {
                    e.preventDefault();

                    item.toggleSelect();

                    this.children.forEach((child, childIndex) => {
                        if (index !== childIndex) {
                            child.getElement().classList.remove('selected');
                        }
                    });
                })
        });

    }

    public selectListener(selectCallback: any, deselectCallback?: any) {
        this.children.forEach((item) => {
            item
                .on('selected', (e) => {
                    selectCallback(item);
                })
                .on('deselected', (e) => {
                    deselectCallback(item);
                });
        });
    }


}
