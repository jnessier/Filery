import plugin from './plugin';
import {Plugin} from './Filery/Plugin';
import {File} from './Filery/Model/File';
import {ApiClient} from './Filery/ApiClient';

declare var tinymce: any;

tinymce.PluginManager.add('filery', plugin);

export function filePickerCallback(callback, value, meta) {
    let filter = [];
    if (meta.filetype === 'image') {
        filter = [
            'image'
        ];
    } else if (meta.filetype === 'media') {
        filter = [
            'video',
            'audio'
        ];
    }

    let plugin = new Plugin(tinymce.activeEditor, filter);
    plugin.openDialog(function (file: File) {
        callback(file.getUrl(), {
            text: file.getName(),
            title: file.getName()
        });
        return true;
    }, 'select');
}

export function imagesUploadHandler(blobInfo, success, failure) {

    ApiClient
        .upload(blobInfo)
        .then((file) => {
            success(file.getUrl());
        })
        .catch((error) => {
            failure(error);
        });
};