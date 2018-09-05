import {Control} from './Control';
import {Item} from './Item';
import {File} from '../Model/File';
import {ContextMenu} from './ContextMenu';

export class Container extends Control {
    protected items = [];

    protected selectedIndex: number;

    constructor(files: Array<File> = [], contextMenu: ContextMenu) {
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

                })
                .on('contextmenu', (e) => {
                    e.preventDefault();

                    let dialogRect = document.querySelector('#filery-dialog').getBoundingClientRect();

                    contextMenu
                        .setPosition(e.pageY - dialogRect.top + 5, e.pageX - dialogRect.left + 5)
                        .setItem(item)
                        .show();
                });

            window.addEventListener('click', (e) => {
                contextMenu.hide();
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
