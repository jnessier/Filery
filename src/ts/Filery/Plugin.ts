import {ApiClient} from './ApiClient';
import {Control} from './UI/Control';
import {Container} from './UI/Container';
import {ContextMenu} from './UI/ContextMenu';

declare var tinymce: any;

export class Plugin {

    private readonly editor = null;

    private readonly filter;

    private selectedItem = null;

    private buttons = {
        'delete': null,
        'select': null,
        'image': null,
        'link': null,
        'upload': null
    };

    constructor(editor: any, filter: any) {
        this.editor = editor;
        this.filter = filter;
    }

    private insertType = 'select';
    private insertCallback: any;

    public openDialog(insertCallback: any, insertType: any) {

        this.insertType = insertType;
        this.insertCallback = insertCallback;

        this.editor.windowManager.open({
            title: 'File manager',
            id: 'filery-dialog',
            height: 400,
            width: 700,
            autoScroll: true,
            buttons: [{
                text: 'Select',
                icon: 'insert',
                classes: 'primary',
                disabled: true,
                visible: (insertType === 'select'),
                onClick: (e) => {
                    e.preventDefault();
                    this.insertFile('select');
                },
                onPostRender: (e) => {
                    this.buttons.select = e.target;
                },
            }, {
                icon: 'image',
                text: 'Insert image',
                classes: 'primary',
                visible: false,
                onClick: (e) => {
                    e.preventDefault();
                    this.insertFile('image');
                },
                onPostRender: (e) => {
                    this.buttons.image = e.target;
                },
            }, {
                icon: 'link',
                text: 'Insert link',
                classes: 'primary',
                disabled: true,
                visible: (insertType === 'insert'),
                onClick: (e) => {
                    e.preventDefault();
                    this.insertFile('link');
                },
                onPostRender: (e) => {
                    this.buttons.link = e.target;
                },
            }, {
                icon: 'remove',
                disabled: true,
                onClick: (e) => {
                    e.preventDefault();
                    this.deleteFile();
                },
                onPostRender: (e) => {
                    this.buttons.delete = e.target;
                },
            }, {
                text: 'Upload',
                icon: 'upload',
                onClick: (e) => {
                    e.preventDefault();
                    this.uploadFile();
                },
                onPostRender: (e) => {
                    this.buttons.upload = e.target;
                },
            }, {
                text: 'Cancel',
                onclick: 'close',
            }],
            onOpen: (e) => {
                this.loadDialogContent();

                window.addEventListener('keydown', (e) => {
                    if (e.code === 'Escape') {
                        this.editor.windowManager.close(window);
                    }
                });
            }
        });
    }

    public uploadFile(): this {
        Control
            .createByTag('input', {
                'type': 'file',
                'accept': this.filter + '/*'
            })
            .on('change', (e) => {
                ApiClient
                    .upload(e.target.files[0])
                    .then((file) => {
                        this.editor.windowManager.alert(tinymce.i18n.translate(['"{0}" successfully uploaded.', file.getName()]), () => {
                            this.loadDialogContent();
                        });
                    })
                    .catch((error) => {
                        this.editor.windowManager.alert(tinymce.i18n.translate('Upload failed.') + ' ' + error);
                    });
            })
            .trigger('click');
        return this;
    }

    public insertFile(type: string): this {

        if (this.selectedItem) {

            let file = this.selectedItem.getFile();

            if (this.insertCallback(file, type)) {
                this.editor.windowManager.close(window);

                let text = tinymce.i18n.translate(['"{0}" as link successfully inserted.', file.getName()]);
                if (type === 'image') {
                    text = tinymce.i18n.translate(['"{0}" as image successfully inserted.', file.getName()]);
                }

                this.editor.notificationManager.open({
                    text: text,
                    type: 'success',
                    timeout: 3000
                });

                return this;
            } else {
                console.error('Insert callback failed (or returned false/null).');
            }
        } else {
            console.error('Insert failed. There is no file selected.');
        }

        return this;
    }


    public deleteFile(): this {
        if (this.selectedItem) {

            let file = this.selectedItem.getFile();

            this.editor.windowManager.confirm(tinymce.i18n.translate(['Are you sure you want to delete "{0}"?', file.getName()]), (state) => {
                if (state) {
                    ApiClient
                        .delete(file)
                        .then(() => {
                            this.selectedItem.fadeOut(() => {

                                this.selectedItem.deselect();
                                this.loadDialogContent();
                                this.editor.windowManager.alert(tinymce.i18n.translate(['"{0}" successfully deleted.', file.getName()]));

                                /*this.editor.windowManager.confirm(tinymce.i18n.translate(['"{0}" successfully deleted. Do you want to remove the content with reference to the deleted file?', file.getName()]), (state) => {
                                    if (state) {
                                        Control
                                            .createBySelector('img', this.editor.getBody())
                                            .forEach((img) => {
                                                if (img.getAttribute('src').endsWith(file.getName())) {
                                                    img.remove();
                                                }
                                            });

                                        Control
                                            .createBySelector('a', this.editor.getBody())
                                            .forEach((a) => {
                                                if (a.getAttribute('href').endsWith(file.getName())) {
                                                    a.unwrap();
                                                }
                                            });
                                    }
                                });*/
                            }, 30);

                        })
                        .catch((error) => {
                            this.editor.windowManager.alert(tinymce.i18n.translate(['Delete failed: {0}', error]));
                        });
                } else {
                    this.selectedItem.unselect();
                }

            });

        } else {
            this.editor.windowManager.alert(tinymce.i18n.translate(['Delete failed: {0}', 'There is no file selected.']));
        }

        return this;
    }

    public loadDialogContent() {
        ApiClient
            .read()
            .then((files) => {

                if (this.filter.length > 0) {
                    files = files.filter((file) => {
                        return this.filter.indexOf(file.getType()) > -1;
                    });
                }

                let contextmenu = new ContextMenu(this.insertType);

                contextmenu
                    .setCallback('delete', (item) => {
                        this.selectedItem = item;
                        this.deleteFile();
                    })
                    .setCallback('select', (item) => {
                        this.selectedItem = item;
                        this.insertFile('select');
                    })
                    .setCallback('link', (item) => {
                        this.selectedItem = item;
                        this.insertFile('link');
                    })
                    .setCallback('image', (item) => {
                        this.selectedItem = item;
                        this.insertFile('image');
                    });


                let container = new Container(files, contextmenu);

                Control
                    .createBySelector('#filery-dialog-body')[0]
                    .html('')
                    .append(container)
                    .append(contextmenu);

                container
                    .selectListener((item) => {
                        this.selectedItem = item;

                        this.buttons.delete.disabled(false);
                        this.buttons.select.disabled(false);
                        this.buttons.link.disabled(false);
                        if (this.insertType === 'insert' && this.selectedItem.getFile().type === 'image') {
                            this.buttons.image.visible(true);
                        }
                    }, (item) => {
                        this.selectedItem = null;

                        this.buttons.image.visible(false);
                        this.buttons.link.disabled(true);
                        this.buttons.select.disabled(true);
                        this.buttons.delete.disabled(true);
                    });

            })
            .catch((error) => {
                this.editor.windowManager.alert(tinymce.i18n.translate('Load failed.') + ' ' + error);
            });
    }
}