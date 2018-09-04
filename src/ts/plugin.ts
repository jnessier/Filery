import {Plugin} from './Filery/Plugin';
import {ApiClient} from './Filery/ApiClient';

declare var tinymce: any;

import '../sass/plugin.scss';


export default function (editor: any, url: string) {

    tinymce.DOM.loadCSS(url + '/plugin.min.css');

    ApiClient.setUrl(editor.settings.filery.api.url);

    editor.addButton('filery', {
        icon: 'browse',
        title: 'File manager',
        onClick: function () {

            let plugin = new Plugin(editor, []);

            plugin.openDialog((file, insertType) => {
                if (insertType === 'image') {
                    editor.insertContent('<img src="' + file.url + '" title="' + file.name + '" />');
                } else {
                    editor.insertContent('<a href="' + file.url + '" title="' + file.name + '">' + file.name + '</a>');
                }
                return true;
            }, 'insert');
        }
    });

    editor.settings.filery.filePickerCallback = function (callback, value, meta) {
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
        plugin.openDialog(function (file) {
            callback(file.url, {
                text: file.name,
                title: file.name
            });
        }, 'select');
    }

    return {
        getMetadata: function () {
            return {
                name: 'Filery',
                url: 'https://www.neoflow.ch'
            };
        }
    };
}


