![A file manager plugin for TinyMCE](https://raw.githubusercontent.com/Neoflow/Filery/master/static/example.png "A file manager plugin for TinyMCE.")

# About
Filery is a file manager plugin for TinyMCE. The plugin provides a dialog as a part of TinyMCE, where you can manage and upload files for your content.

Feel free to try the [demo](https://demos.neoflow.ch/filery/) online.

**Table of Contents**
* [Requirements](#requirements)
* [Installation](#installation)
    + [1. TinyMCE plugin](#1-tinymce-plugin)
        - [Installation](#installation-1)
        - [Configuration](#configuration-1)
        - [Advanced configuration](#advanced-configuration-1)
    + [2. Plugin API](#2-plugin-api)
        - [Installation](#installation-2)
        - [Configuration](#configuration-2)
        - [Advanced configuration](#advanced-configuration-2)
* [Donation](#donation)
* [License](#license)

# Requirements
For Filery as TinyMCE plugin:
* TinyMCE 4.8.x or newer
* Modern theme of TinyMCE

For the API of Filery:
* PHP 5.6 or newer
* Read and write access

# Installation
The installation is done in two steps:
1. [Installation of the TinyMCE plugin](#1-tinymce-plugin)
2. [Installation of the plugin API](#2-plugin-api)

But first you have to download and unzip the [latest release](https://github.com/rjgamer/Filery/releases/latest).

## 1. TinyMCE plugin
### Installation
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

### Advanced configuration
Filery provides callbacks functions for the file picker and image upload, which must be to configured first.

```js
tinymce.init({
  // ...
    file_picker_callback: function (callback, value, meta) {
        Filery.filePickerCallback(callback, value, meta);
    },
    images_upload_handler: function (blobInfo, success, failure) {
        Filery.imagesUploadHandler(blobInfo, success, failure);
    }
  // ...
});
```
## 2. Plugin API
### Installation
Move the folder "api" to a HTTP-accessible destination of your server and rename the config file from "config-new.php" to "config.php".

### Configuration
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

### Advanced configuration
There are more advanced configuration parameters for the API. If you really want to change it, then please take a look at the [AbstractAPI class on line 14](https://github.com/rjgamer/Filery/blob/master/api/classes/Filery/AbstractAPI.php#L14). 

# Donation
If you like my work or if you use it for a commercial project, please give me a donation. Thanks!

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.me/JonathanNessier)

# License
Filery is an open-source plugin for TinyMCE and [licensed under MIT](https://github.com/rjgamer/Filery/blob/master/LICENSE).

*Made in Switzerland with :banana:... I mean :heart:

