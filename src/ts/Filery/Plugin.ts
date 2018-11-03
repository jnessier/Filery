import {ApiClient} from './ApiClient';
import {Control} from './UI/Control';
import {Container} from './UI/Container';

declare var tinymce: any;

export interface PluginConfig {
    filter: string[];
    callback: any;
    type: string;
    editor: any;
}

export class Plugin {

    private readonly config: PluginConfig;

    constructor(config: PluginConfig) {
        this.config = config;
    }

    public openDialog() {

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Escape') {
                this.config.editor.windowManager.close(window);
            }
        });

        let height = 400;
        if (this.config.editor.settings.filery_dialog_height) {
            height = parseInt(this.config.editor.settings.filery_dialog_height);
        }

        this.config.editor.windowManager.open({
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
                    this.uploadFile();
                }
            }, {
                text: tinymce.i18n.translate(['Cancel']),
                onclick: 'close',
            }],
            onOpen: (e) => {
                e.preventDefault();
                this.loadFiles();
            }
        });
    }

    private uploadFile() {
        let input = Control
            .createByTag('input', {
                'type': 'file',
                'accept': this.config.filter + '/*'
            });

        if (this.config.filter.length) {
            let accept = [];
            this.config.filter.forEach((filter) => {
                accept.push(filter + '/*');
            });
            input.setAttribute('accept', accept.join(','));
        }

        input.on('change', (e) => {
            ApiClient
                .upload(e.target.files[0])
                .then((file) => {
                    this.config.editor.windowManager.alert(tinymce.i18n.translate(['"{0}" successfully uploaded.', file.getName()]), () => {
                        this.loadFiles();
                    });
                })
                .catch((error) => {
                    this.config.editor.windowManager.alert(tinymce.i18n.translate('Upload failed.') + ' ' + error);
                });
        })
            .get().click();

        return this;
    }

    public loadFiles() {
        ApiClient
            .read()
            .then((list) => {
                Control
                    .createBySelector('#filery-dialog-body', document)[0]
                    .html('')
                    .append(new Container(list, this.config));

            })
            .catch((error) => {
                this.config.editor.windowManager.alert(tinymce.i18n.translate('Load failed.') + ' ' + error);
            });
    }
}