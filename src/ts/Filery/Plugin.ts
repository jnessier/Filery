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

        this.config.editor.windowManager.open({
            title: 'File manager',
            id: 'filery-dialog',
            height: 400,
            width: 700,
            autoScroll: true,
            buttons: [{
                text: 'Upload',
                icon: 'upload',
                classes: 'primary',
                onClick: (e) => {
                    e.preventDefault();
                    this.uploadFile();
                }
            }, {
                text: 'Cancel',
                onclick: 'close',
            }],
            onOpen: (e) => {
                e.preventDefault();
                this.loadFiles();
            }
        });
    }

    private uploadFile() {
        Control
            .createByTag('input', {
                'type': 'file',
                //'accept': this.config.filter + '/*'
            })
            .on('change', (e) => {
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
            .trigger('click');

        return this;
    }

    public loadFiles() {
        ApiClient
            .read()
            .then((files) => {
                if (this.config.filter.length > 0) {
                    files = files.filter((file) => {
                        return this.config.filter.indexOf(file.getType()) > -1;
                    });
                }
                Control
                    .createBySelector('#filery-dialog-body')[0]
                    .html('')
                    .append(new Container(files, this.config));

            })
            .catch((error) => {
                this.config.editor.windowManager.alert(tinymce.i18n.translate('Load failed.') + ' ' + error);
            });
    }
}