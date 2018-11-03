import {Control} from '../Control';
import {File} from '../../Data/File';
import {PluginConfig} from '../../Plugin';
import {ApiClient} from '../../ApiClient';

declare var tinymce: any;

export class FileButtons extends Control {

    protected file: File;

    private readonly config: PluginConfig;

    constructor(file: File, config: PluginConfig) {
        super();

        this.file = file;

        this.config = config;

        this.element = Control.createElement('div', {
            className: 'file-buttons',
        });

        let buttons = Control.createByTag('ul');

        if (this.file.getType() !== 'folder') {
            if (this.config.type === 'select') {
                buttons.append(Control
                    .createByTag('li', {
                        className: 'select',
                        title: tinymce.i18n.translate('Select')
                    })
                    .text(tinymce.i18n.translate('Select'))
                    .on('click', (e) => {
                        e.preventDefault();
                        this.insertFile('select');
                    }));
            } else {
                buttons.append(Control
                    .createByTag('li', {
                        className: 'link',
                        title: tinymce.i18n.translate('Insert link')
                    })
                    .text(tinymce.i18n.translate('Insert link'))
                    .on('click', (e) => {
                        e.preventDefault();
                        this.insertFile('link');
                    }));

                if (this.file.getType() === 'image') {
                    buttons.append(Control
                        .createByTag('li', {
                            className: 'image',
                            title: tinymce.i18n.translate('Insert image')
                        })
                        .text(tinymce.i18n.translate('Insert image'))
                        .on('click', (e) => {
                            e.preventDefault();
                            this.insertFile('image');
                        }));
                }
            }
        }

        buttons.append(Control
            .createByTag('li', {
                className: 'delete',
                title: tinymce.i18n.translate('Delete')
            })
            .prepend('<i class="mce-ico mce-i-remove"></i>')
            .on('click', (e) => {
                e.preventDefault();
                this.deleteFile();
            }));

        this.append(buttons);
    }

    private insertFile(type: string): this {
        if (this.config.callback(this.file, type)) {
            this.config.editor.windowManager.close(window);

            let text = tinymce.i18n.translate(['"{0}" as link successfully inserted.', this.file.getName()]);
            if (type === 'image') {
                text = tinymce.i18n.translate(['"{0}" as image successfully inserted.', this.file.getName()]);
            }

            this.config.editor.notificationManager.open({
                text: text,
                type: 'success',
                timeout: 3000
            });

            return this;
        } else {
            console.error('Insert callback failed (or returned false/null).');
        }
        return this;
    }

    private deleteFile(): this {
        this.config.editor.windowManager.confirm(tinymce.i18n.translate(['Are you sure you want to delete "{0}"?', this.file.getName()]), (state) => {
            if (state) {
                ApiClient
                    .delete(this.file)
                    .then(() => {

                        this.getParent().fadeOut(() => {
                            this.config.editor.windowManager.confirm(tinymce.i18n.translate(['"{0}" successfully deleted. Do you want to remove the content with reference to the deleted file?', this.file.getName()]), (state) => {
                                if (state) {
                                    Control
                                        .createBySelector('img', this.config.editor.getBody())
                                        .forEach((img) => {
                                            if (img.getAttribute('src').endsWith(this.file.getName())) {
                                                img.remove();
                                            }
                                        });

                                    Control
                                        .createBySelector('a', this.config.editor.getBody())
                                        .forEach((a) => {
                                            if (a.getAttribute('href').endsWith(this.file.getName())) {
                                                a.unwrap();
                                            }
                                        });
                                }
                            });
                        }, 30);

                    })
                    .catch((error) => {
                        this.config.editor.windowManager.alert(tinymce.i18n.translate(['Delete failed: {0}', error]));
                    });
            }

        });

        return this;
    }

}

