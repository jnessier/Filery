import {Plugin, PluginConfig} from './Filery/Plugin';
import {ApiClient} from './Filery/ApiClient';
import plugin from './plugin';

declare var tinymce: any;

tinymce.PluginManager.add('filery', plugin);

tinymce.PluginManager.requireLangPack('filery', 'en,de');

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

    let config: PluginConfig = {
        filter: filter,
        callback: (file) => {
            callback(file.getUrl(), {
                text: file.getName(),
                title: file.getName()
            });
            return true;
        },
        type: 'select',
        editor: tinymce.activeEditor
    };

    let plugin = new Plugin(config);
    plugin.openDialog();
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