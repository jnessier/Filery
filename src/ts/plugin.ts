import {Plugin, PluginConfig} from './Filery/Plugin';
import {ApiClient} from './Filery/ApiClient';
import '../sass/plugin.scss';

declare var tinymce: any;

export default function (editor: any, url: string) {

    let defaultSettings = {
        filery_dialog_height: '400px',
        filery_show_images: true
    };

    Object.keys(defaultSettings).forEach((key: string) => {
        if (typeof  editor.settings[key] === 'undefined') {
            editor.settings[key] = defaultSettings[key];
        }
    });

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
                editor: editor,
                dir: ''
            };

            Plugin.openDialog(config);
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


