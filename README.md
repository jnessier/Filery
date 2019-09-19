# This project is no longer maintained.
Please use other solutions for the file management in TinyMCE.
------------------------------------------------------------

![A file manager plugin for TinyMCE](https://raw.githubusercontent.com/Neoflow/Filery/master/example.png "A file manager plugin for TinyMCE.")

# About
Filery is a file manager plugin for TinyMCE. The plugin provides a dialog as a part of TinyMCE, where you can manage and upload files for your content.

Feel free to try the [demo](https://demos.neoflow.ch/filery/) online.

**Table of Contents**
* [Requirements](#requirements)
* [Download](#download)
* [Installation](#installation)
    + [1. TinyMCE plugin](#1-tinymce-plugin)
        - [Installation](#installation-1)
        - [Configuration](#configuration-1)
        - [Advanced configuration](#advanced-configuration-1)
    + [2. Plugin API](#2-plugin-api)
        - [Installation](#installation-2)
        - [Configuration](#configuration-2)
        - [Advanced configuration](#advanced-configuration-2)
* [Support](#support)        
* [Donation](#donation)
* [License](#license)

# Requirements
* TinyMCE 4.8.x or newer
* PHP 7.1 or newer

**Important**: The website with the TinyMCE instance and the Filery API have to run under the same domain with the same PHP-initiated session. If this is not the case, the security of the Filery API cannot be guaranteed.

Please use the modern theme of TinyMCE for the best user experience with Filery.

# Download
You can download the latest release [here](https://github.com/Neoflow/Filery/releases).

Older versions of Filery than the latest release aren't support and recommended use.

# Installation
Filery and the installation is divided into two parts:
1. [TinyMCE Plugin](#1-tinymce-plugin)
2. [Plugin API](#2-plugin-api)

Both parts must be installed and configured as described below. Otherwise Filery will not run.

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
Filery will not work without an API and a token, which needs to be configured.

You need to create a token first, before you can start to initialize TinyMCE and Filery.  
```php
<?php
session_start();

require_once 'path/to/filery/api/classes/Filery/Token.php';
$token = new Filery\Token();
$token->create();
?>
```
Please note, that you can provide a custom configuration for the API with the method `create`. The configuration will be stored in the session, based on the token string as key and automatically fetched by the API after each request. The custom configuration array has to match the pattern of the API configuration and simplifies the implementation, when for example, the directories of the files are different for each TinyMCE instance.

After the token is generated, you can configure your TinyMCE instance and the Filery plugin. 

|Parameter|Description|
|---|---|
|`filery_api_url`|Defines the URL to the plugin API. The API is the most important part of the plugin and is handling all CRUD actions for the file management.|
|`filery_api_token`|The token provides the security, that only authenticated users can access the Filery API.|
|`filery_dialog_height`|Can be used to customize the dialog height.<br />**Optional** - Default value: 400px|
|`filery_show_images`|Set FALSE to show default image icon instead of images.<br />**Optional** - Default value: true|

```js
tinymce.init({
  // ...
  filery_api_url: 'http://domain.tld/filery/api/index.php',
  filery_api_token: '<?= $token->toString(); ?>',
  filery_dialog_height: '400px',
  filery_show_images: true
  // ...
});
```
Don't forget to echo the generated token as string.

### Advanced configuration
Filery provides callbacks functions for the file picker and image upload, who have to configured as static method call in callback.

```js
tinymce.init({
  // ...
    file_picker_callback: function (callback, value, meta) {
        Filery.filePickerCallback(callback, value, meta);
    },
    images_upload_handler: function (blobInfo, success, failure) {
        Filery.imagesUploadHandler(blobInfo, success, failure);
    },
  // ...
});
```
Please note, that `images_upload_url` as "shorthand" alternative to the `images_upload_handler` callback is not supported by Filery.
## 2. Plugin API
### Installation
Move the folder "api" to a HTTP-accessible destination of your server and rename the config file from "config-new.php" to "config.php".

### Configuration
The API needs to get configured too and has to know where to get the files from.

|Parameter|Description|
|---|---|
|`base.path`|The path to the directory where the files for the API are located.|
|`base.url`|The URL of the the directory, where the files are accessible over HTTP.|
|`showHiddenFiles`|Set TRUE to make the hidden files visible too in the file manager of Filery. It's highly recommended to leave the parameter disabled for security reasons.<br />**Optional** - Default value: false|
|`upload.overwrite`|Set TRUE to overwrite an existing file, when the uploaded file has the similar name. Don't forget to set TRUE, when you have `images_reuse_filename` enabled in your TinyMCE configuration.<br />**Optional** - Default value: false|

```php
return [
    'base' => [
        'path' => 'absolute/path/to/files',
        'url' => 'http://domain.tld/files',
    ],
    'showHiddenFiles' => false,
    'upload' => [
        'overwrite' => false,
    ]
];
```

### Advanced configuration
There are more advanced configuration parameters for the API. If you really want to change it, then please take a look at the [AbstractAPI](https://github.com/rjgamer/Filery/blob/master/api/classes/Filery/AbstractAPI.php#L15) class on line 15. 

# Support
Older versions of Filery than the latest release aren't supported and recommended use.

# Donation
If you like my work or if you use it for a commercial project, please give me a donation. Thanks!

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.me/JonathanNessier)

# License
Filery is an open-source plugin for TinyMCE and [licensed under MIT](https://github.com/rjgamer/Filery/blob/master/LICENSE).

*Made in Switzerland with :banana:... I mean :heart:

