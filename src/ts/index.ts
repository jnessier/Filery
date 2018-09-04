import plugin from './plugin';
import {Plugin} from './Filery/Plugin';

declare var tinymce: any;

tinymce.PluginManager.add('filery', plugin);

