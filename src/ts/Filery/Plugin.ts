import {ApiClient} from './ApiClient';
import {Control} from './UI/Control';
import {Container} from './UI/Container';
import {Breadcrumbs} from "./UI/Breadcrumbs";

declare var tinymce: any;

export interface PluginConfig {
    filter: string[];
    callback: any;
    type: string;
    editor: any;
    dir: string;
}

export class Plugin {

    static openDialog(config: PluginConfig) {

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Escape') {
                config.editor.windowManager.close(window);
            }
        });

        let height = 400;
        if (config.editor.settings.filery_dialog_height) {
            height = parseInt(config.editor.settings.filery_dialog_height);
        }

        config.editor.windowManager.open({
            title: tinymce.i18n.translate(['File manager']),
            id: 'filery-dialog',
            height: height,
            width: 700,
            autoScroll: true,
            buttons: [{
                text: tinymce.i18n.translate(['Upload']),
                icon: 'upload',
                classes: 'primary',
                onClick: (e) => {
                    e.preventDefault();
                    Plugin.uploadFile(config);
                }
            }, {
                text: tinymce.i18n.translate(['Cancel']),
                onclick: 'close',
            }],
            onOpen: (e) => {
                e.preventDefault();
                Plugin.loadFiles(config);
            }
        });
    }

    static uploadFile(config: PluginConfig) {
        let input = Control
            .createByTag('input', {
                'type': 'file',
                'accept': config.filter + '/*'
            });

        if (config.filter.length) {
            let accept = [];
            config.filter.forEach((filter) => {
                accept.push(filter + '/*');
            });
            input.setAttribute('accept', accept.join(','));
        }

        input.on('change', (e) => {
            ApiClient
                .upload(e.target.files[0], config.dir)
                .then((file) => {
                    config.editor.windowManager.alert(tinymce.i18n.translate(['"{0}" successfully uploaded.', file.getName()]), () => {
                        Plugin.loadFiles(config);
                    });
                })
                .catch((error) => {
                    config.editor.windowManager.alert(tinymce.i18n.translate('Upload failed.') + ' ' + error);
                });
        }).getElement().click();

        return this;
    }

    static loadFiles(config: PluginConfig) {
        ApiClient
            .read(config.dir)
            .then((list) => {
                Control
                    .createBySelector('#filery-dialog-body', document)[0]
                    .html('')
                    .append(new Breadcrumbs(config))
                    .append(new Container(list, config));
            })
            .catch((error) => {
                config.editor.windowManager.alert(tinymce.i18n.translate('Load failed.') + ' ' + error);
            });
    }
}