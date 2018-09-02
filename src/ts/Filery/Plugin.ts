import {ApiClient} from './ApiClient';
import {Control} from './UI/Control';
import {Container} from './UI/Container';

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

    private type = 'select';

    public openDialog(insertCallback: any, insertType: any) {

        this.editor.windowManager.open({
            title: 'File manager',
            id: 'filery-dialog',
            height: 450,
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
                    this.insertFile(insertCallback, "select");
                },
                onPostRender: (e) => {
                    this.buttons.select = e.target;
                },
            }, {
                icon: 'link',
                text: 'Insert as link',
                classes: 'primary',
                disabled: true,
                visible: (insertType === 'insert'),
                onClick: (e) => {
                    e.preventDefault();
                    this.insertFile(insertCallback, 'link');
                },
                onPostRender: (e) => {
                    this.buttons.link = e.target;
                },
            }, {
                icon: 'image',
                text: 'Insert as image',
                classes: 'primary',
                disabled: true,
                visible: (insertType === 'insert'),
                onClick: (e) => {
                    e.preventDefault();
                    this.insertFile(insertCallback, 'image');
                },
                onPostRender: (e) => {
                    this.buttons.image = e.target;
                },
            }, {
                text: 'Delete',
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
        let a = Control
            .createByElement('input', {
                'type': 'file',
                'accept': this.filter + '/*'
            })
            .on('change', (e) => {
                ApiClient
                    .uploadFile(e.target.files[0])
                    .then((result) => {
                        if (result.status) {
                            this.editor.windowManager.alert(tinymce.i18n.translate(['"{0}" successfully uploaded', result.data[0].name]), function () {
                                this.loadDialogContent();
                            });
                        } else {
                            this.editor.windowManager.alert(tinymce.i18n.translate(['Upload failed: {0}', result.message]));
                        }
                    });
            })
            .trigger('click');
        return this;
    }


    public insertFile(callback: any, type: string): this {

        if (this.selectedItem) {

            let file = this.selectedItem.getFile();

            if (callback(file, type)) {
                this.editor.windowManager.close(window);

                let text = tinymce.i18n.translate(["\"{0}\" successfully inserted", file.getName()]);
                if (type === "image") {
                    text = tinymce.i18n.translate(["\"{0}\" as image successfully inserted", file.getName()]);
                } else if (type === "link") {
                    text = tinymce.i18n.translate(["\"{0}\" as link successfully inserted", file.getName()]);
                }

                this.editor.notificationManager.open({
                    text: text,
                    type: "success",
                    timeout: 3000
                });

                return this;
            } else {
                this.editor.windowManager.alert(tinymce.i18n.translate(["Insert failed: {0}", "Insert callback was not successfully."]));
            }
        } else {
            this.editor.windowManager.alert(tinymce.i18n.translate(["Insert failed: {0}", "There is no file selected."]));
        }

        return this;
    }


    public deleteFile(): this {
        if (this.selectedItem) {

            let file = this.selectedItem.getFile();

            this.editor.windowManager.confirm(tinymce.i18n.translate(['Are you sure you want to delete the file "{0}"?', file.getName()]), (state) => {
                if (state) {
                    ApiClient
                        .deleteFile(file)
                        .then((result) => {
                            if (result.status) {

                                this.selectedItem.fadeOut(() => {
                                    this.loadDialogContent();

                                    this.editor.windowManager.alert(tinymce.i18n.translate(['"{0}" successfully deleted.', file.getName()]), () => {

                                        let content = this.editor.getContent();

                                        console.log(Control.createByHtml(content));

                                        content.find('[src$="' + file.getName() + '"]').remove();

                                        /*   let $content = $(_);
                                           $content
                                               .find("[src$=\"" + selectedFile.name + "\"]")
                                               .remove();
                                           $content
                                               .find("[href$=\"" + selectedFile.name + "\"]")
                                               .each(function () {
                                                   let $this = $(this);
                                                   $this.replaceWith($this.html());
                                               });
                                           if ($content.length) {
                                               _this.editor.setContent($("<div>").append($content).html());
                                           } else {
                                               _this.editor.setContent("");
                                           }*/
                                    });
                                }, 30);

                            } else {
                                this.editor.windowManager.alert(tinymce.i18n.translate(['Delete failed: {0}', result.message]));
                            }
                        });
                } else {
                    this.selectedItem.unselect();
                }

            });

        } else {
            this.editor.windowManager.alert(tinymce.i18n.translate(["Delete failed: {0}", "There is no file selected."]));
        }

        return this;
    }

    public loadDialogContent = () => {
        ApiClient
            .fetchFiles()
            .then((result) => {
                if (result.status) {
                    let container = new Container(result.data);


                    Control
                        .createBySelector('#filery-dialog-body')
                        .html('')
                        .append(container);

                    container.selectListener((item) => {
                        this.selectedItem = item;

                        this.buttons.delete.disabled(false);
                        this.buttons.select.disabled(false);
                        this.buttons.link.disabled(false);
                        if (this.selectedItem.getFile().type === 'image') {
                            this.buttons.image.disabled(false);
                        }
                    }, (item) => {
                        this.selectedItem = null;

                        this.buttons.image.disabled(true);
                        this.buttons.link.disabled(true);
                        this.buttons.select.disabled(true);
                        this.buttons.delete.disabled(true);
                    });

                } else {
                    this.editor.windowManager.alert(tinymce.i18n.translate(['Load failed: {0}', result.message]));
                }
            });
    };
}