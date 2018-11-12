import {Control} from './Control';
import {Plugin, PluginConfig} from '../Plugin';

declare var tinymce: any;

export class Breadcrumbs extends Control {

    constructor(config: PluginConfig) {
        super();

        this.element = Control.createElement('div', {
            className: 'filery-breadcrumbs'
        });

        let breadcrumbs = Control.createByTag('ul'),
            folders = config.dir.split('/'),
            dir = '';

        folders.forEach((folder, index) => {
            let breadcrumb = Control
                .createByTag('li', {
                    title: tinymce.i18n.translate('Directory')
                })
                .setData('dir', dir);

            if (index === 0) {
                breadcrumb.text(tinymce.i18n.translate('Directory'))
            } else {
                dir += '/' + folder;
                breadcrumbs
                    .append(Control
                        .createByTag('li', {
                            class: 'slash'
                        })
                        .text('/'));

                breadcrumb
                    .text(folder)
                    .setAttribute('title', dir)
                    .setData('dir', dir)
            }

            if (folders.length > 1 && index < (folders.length - 1)) {
                breadcrumb
                    .addClass('folder')
                    .on('click', (e) => {
                        e.preventDefault();
                        config.dir = Control.createByElement(e.target).getData('dir');
                        Plugin.loadFiles(config);
                    });
            }

            breadcrumbs.append(breadcrumb);
        })

        this.append(breadcrumbs);

    }


}