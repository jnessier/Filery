import {Plugin, PluginConfig} from './Filery/Plugin';
import {ApiClient} from './Filery/ApiClient';
import '../sass/plugin.scss';

declare var tinymce: any;

export default function (editor: any, url: string) {

    tinymce.DOM.loadCSS(url + '/plugin.min.css');

    ApiClient.setUrl(editor.settings.filery_api_url);

    editor.addButton('filery', {
        icon: 'browse',
        title: 'File manager',
        onClick: function () {

            let config: PluginConfig = {
                filter: [],
                callback: (file, insertType) => {
                    if (insertType === 'image') {
                        editor.insertContent('<img src="' + file.getUrl() + '" title="' + file.getName() + '" />');
                    } else {
                        let content = editor.selection.getContent();
                        editor.insertContent('<a href="' + file.getUrl() + '" title="' + file.getName() + '">' + (content ? content : file.getName()) + '</a>');
                    }
                    return true;
                },
                type: 'insert',
                editor: editor
            };

            let plugin = new Plugin(config);
            plugin.openDialog();
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


