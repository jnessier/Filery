# Filery
A file manager plugin for TinyMCE.

## Important questions
### What does the plugin do?
The plugin provides a file manager dialog for TinyMCE, where you
can manage and upload files of your content. 

### How much does the plugin cost?
Nothing, nada, nichts. The plugin is 100% free and licensed under MIT.

## Installation
The installation is done in two steps:
1. [Installation of the TinyMCE plugin](#1-tinymce-plugin)
2. [Installation of the plugin API](#2-plugin-api)

But first you have to download and unzip the latest version.

### 1. TinyMCE plugin
#### Installation
Move the folder "filery" to the plugins folder of your TinyMCE installation and add `filery` to the list of plugins and toolbar items of your TinyMCE configuration. 

```js
tinymce.init({
  selector: "textarea",
  plugins: "filery",
  toolbar: "filery"
});
```

### Configuration
Filery will not work without an API, which needs to be configured.

|Parameter|Description|
|---|---|
|`filery_api_url`|Defines the URL to the plugin API. The API is the most important part of the plugin and is handling all CRUD actions for the file management.|
|`filery_api_token`|A token for a custom API configuration handling (e.g. when you want to use different API configurations per TinyMCE instance). The token will be send as X-FILERY-TOKEN header to the API.<br />**Optional** - Default value: false|
|`filery_dialog_height`|Can be used to customize the dialog height.<br />**Optional** - Default value: 400px|

```js
tinymce.init({
  // ...
  filery_api_url: 'http://domain.tld/filery/api/index.php',
  filery_api_token: false,
  filery_dialog_height: '400px',
  // ...
});
```

### 2. Plugin API
#### Installation
Move the folder "api" to a HTTP-accessible destination of your server and rename the config file from "config-new.php" to "config.php".

#### Configuration
The API needs to know where get the files from, which can be configured too.

|Parameter|Description|
|---|---|
|`base.path`|The path to the directory where the files for the API are located.|
|`base.url`|The URL of the the directory, where the files are accessible over HTTP.|
|`showHiddenFiles`|Set TRUE to make the hidden files visible too in the file manager of Filery.<br />**Optional** - Default value: false|
|`tokenCallback`|A callback function for the token handling. Can be used to return custom config parameters. The return value must be an key-value array.<br />**Optional** - Default value: Anonymous function returning an empty array.|

```php
return [
    'base' => [
        'path' => 'absolute/path/to/storage',
        'url' => 'http://domain.tld/storage',
    ],
    'showHiddenFiles' => false,
    'tokenCallback' => function ($token) {
        // E.g. return decodeFileryToken($token);
        // or return $_SESSION[$token];
        return [];
    }
];
```

#### Advanced configuration
There are more advanced configuration parameters for the API. If you really want to change it, then please take a look at the [AbstractAPI class on line 14](https://github.com/rjgamer/Filery/blob/master/api/classes/Filery/AbstractAPI.php#L14). 

## License
Filery as TinyMCE plugin open-source and licensed under MIT. 

*Made in Switzerland with :banana:... no I mean :heart:

