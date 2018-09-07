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
1. Installation of the TinyMCE plugin
2. Installation of the plugin API

But first you have to download and unzip the latest version.

### TinyMCE plugin
#### Installation
Move the folder "filery" to the plugins folder of your TinyMCE 
installation and add `filery` to the list of plugins and toolbar items
of your TinyMCE configuration. 

````
tinymce.init({
  selector: "textarea",
  plugins: "filery",
  toolbar: "filery"
});
````

### Configuration
Filery will not work with an API and needs to be configured.

|Parameter|Description|
|---|---|
|`filery_api_url`|Defines the URL to the plugin API. The API is the most important part of the plugin and is handling all CRUD actions for the file management.|
|`filery_api_token`|Is a token which will be send as X-FILERY-TOKEN header to the API for a custom API configuration handling (e.g. when your using different configurations per TinyMCE instance).<br />**Optional** - Default value: false|
|`filery_dialog_height`|Can be used to customize the dialog height.<br />**Optional** - Default value: 400px|

````
tinymce.init({
  ...
  filery_api_url: 'http://domain.tld/filery/api/index.php',
  filery_api_token: false,
  filery_dialog_height: '400px',
  ...
});
````
