import {ApiClient} from './ApiClient';
import {Control} from './UI/Control';
import {Container} from './UI/Container';
import * as util from 'util';

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

    openDialog(callback: any, type: any) {


        this.editor.windowManager.open({
            title: 'File manager',
            id: 'filery-dialog',
            height: 450,
            width: 700,
            autoScroll: true,
            buttons: [
                {
                    text: 'Select',
                    icon: 'insert',
                    classes: 'primary',
                    disabled: true,
                    onClick: function (e) {
                        e.preventDefault();
                        /* _this.insertFile(callback, "select");*/
                    },
                    onPostRender: (e) => {
                        this.buttons.select = e.target;
                    },
                }, {
                    icon: 'link',
                    text: 'Insert as link',
                    classes: 'primary',
                    disabled: true,
                    onClick: function (e) {
                        e.preventDefault();
                        /*    _this.insertFile(callback, "link");*/
                    },
                    onPostRender: (e) => {
                        this.buttons.link = e.target;
                    },
                }, {
                    icon: 'image',
                    text: 'Insert as image',
                    classes: 'primary',
                    disabled: true,
                    onClick: function (e) {
                        e.preventDefault();
                        /*  _this.insertFile(callback, "image");*/
                    },
                    onPostRender: (e) => {
                        this.buttons.image = e.target;
                    },
                }, {
                    text: 'Delete',
                    icon: 'remove',
                    classes: 'danger',
                    disabled: true,
                    onClick: function (e) {
                        e.preventDefault();
                        /*  _this.deleteFile();*/
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
                if (type === 'select') {
                    this.buttons.image.visible(false);
                    this.buttons.link.visible(false);
                } else if (type === 'insert') {
                    this.buttons.select.visible(false);
                }

                this.loadDialogContent();

                document.addEventListener('keydown', this.closeDialogByKey);
            },
            onClose: (e) => {
                document.removeEventListener('keydown', this.closeDialogByKey);
            }
        });
    }

    private closeDialogByKey = ((e) => {
        if (e.code === 'Escape') {
            this.editor.windowManager.close(window);
        }
    });

    uploadFile() {
        Control
            .create('input', {
                'type': 'file',
                'accept': this.filter + '/*'
            })
            .on('change', (e) => {
                ApiClient
                    .uploadFile(e.target.files[0])
                    .then((result) => {
                        if (result.status) {
                            this.editor.windowManager.alert(tinymce.i18n.translate(['"{0}" successfully uploaded', result.data[0].name]), function () {
                                /*_this.loadDialogContent();*/
                            });
                        } else {
                            this.editor.windowManager.alert(tinymce.i18n.translate(['Upload failed: {0}', result.message]));
                        }
                    });

            })
            .trigger('click');
    }


    /*  insertFile(callback: any, type: string) {

          let selectedFile = this.selectedItem.file;

          if (this.selectedItem) {
              callback(selectedFile, type);
              this.editor.windowManager.close(window);

              let notificationText = tinymce.i18n.translate(["\"{0}\" successfully inserted", selectedFile.name]);
              if (type === "image") {
                  notificationText = tinymce.i18n.translate(["\"{0}\" as image successfully inserted", selectedFile.name]);
              } else if (type === "link") {
                  notificationText = tinymce.i18n.translate(["\"{0}\" as link successfully inserted", selectedFile.name]);
              }

              this.editor.notificationManager.open({
                  text: notificationText,
                  type: "success",
                  timeout: 3000
              });
          } else {
              this.editor.windowManager.alert(tinymce.i18n.translate(["Insert failed: {0}", "There is no file selected."]));
          }
      }

      deleteFile() {
          if (this.selectedItem) {

              let _this = this,
                  selectedFile = this.selectedItem.file;

              this.editor.windowManager.confirm(tinymce.i18n.translate(["Are you sure you want to delete the file \"{0}\"?", selectedFile.name]), function (state) {
                  if (state) {
                      Helper.ajaxDelete({
                          data: {
                              "name": selectedFile.name
                          },
                          success: function (data) {
                              if (data.deleted) {
                                  _this.$selectedFileryItem
                                      .trigger("unselect")
                                      .fadeOut(function () {
                                          _this.loadDialogContent();

                                          _this.editor.windowManager.alert(tinymce.i18n.translate(["\"{0}\" successfully deleted", selectedFile.name]), function () {
                                              let $content = $(_this.editor.getContent());
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
                                              }

                                          });
                                      });
                              } else {
                                  _this.editor.windowManager.alert(tinymce.i18n.translate(["Delete failed"]));
                              }
                          }
                      }, _this.editor);
                  } else {
                      _this.$selectedFileryItem.trigger("unselect");
                  }
              });

          } else {
              this.editor.windowManager.alert("Delete failed: There is no file selected.");
          }

      }
  */
    loadDialogContent() {
        ApiClient
            .fetchFiles()
            .then((result) => {
                if (result.status) {
                    let container = new Container(result.data),
                        dialogBody = Control.select('#filery-dialog-body');

                    dialogBody.getElement().innerHTML = '';
                    dialogBody.append(container);
                } else {
                    this.editor.windowManager.alert(tinymce.i18n.translate(['Load failed: {0}', result.message]));
                }
            });
    }

    static setSelectedFile(file: File) {

    }
}