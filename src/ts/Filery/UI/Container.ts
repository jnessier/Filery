import {Control} from './Control';
import {Item} from './Item';
import {File} from '../Model/File';

export class Container extends Control {

    constructor(files: []) {
        super();

        this.element = document.createElement('div');
        this.element.classList.add('filery-container');

        files.forEach((file: File, index) => {

            let item = new Item(file);
            this.append(item);

            /*    item.clickListener(c)
                    .on('click', (e) => {
                        e.preventDefault();
                        this.children.forEach((child, childIndex) => {
                            if (index !== childIndex) {
                                child.deselect();
                            }
                        });
                        item.toggleSelect();
                    })*/
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
