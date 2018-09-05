import {Plugin} from './Filery/Plugin';
import {ApiClient} from './Filery/ApiClient';

declare var tinymce: any;

import '../sass/plugin.scss';
import {File} from './Filery/Model/File';


export default function (editor: any, url: string) {

    tinymce.DOM.loadCSS(url + '/plugin.min.css');

    ApiClient.setUrl(editor.settings.filery_api_url);

    editor.addButton('filery', {
        icon: 'browse',
        title: 'File manager',
        onClick: function () {

            let plugin = new Plugin(editor, []);

            plugin.openDialog((file, insertType) => {
                if (insertType === 'image') {
                    editor.insertContent('<img src="' + file.getUrl() + '" title="' + file.getName() + '" />');
                } else {
                    editor.insertContent('<a href="' + file.getUrl() + '" title="' + file.getName() + '">' + file.getName() + '</a>');
                }
                return true;
            }, 'insert');
        }
    });

    return {
        getMetadata: function () {
            return {
                name: 'Filery',
                url: 'https://www.neoflow.ch'
            };
        }
    };
}


