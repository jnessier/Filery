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
Move the folder "filery" to the plugin folder of your TinyMCE 
installation and add "filery" to the list of plugins and toolbar items
to the TinyMCE configuration. 

````
tinymce.init({
  selector: "textarea",
  plugins: "filery",
  toolbar: "filery",
});
````

### Configuration
Filery as a few plugin-specific configuration parameters.

`filery_api_url` defines the URL to the plugin API. The API is the most
important part of the plugin and is handling all CRUD actions for the 
file management.

`filery_api_token` is a token which can be send to the API for custom API
configurations. 

`filery_dialog_height` can be used to customize the dialog height.

````
tinymce.init({
  selector: "textarea",
  plugins: "filery",
  toolbar: "filery",
  filery_api_url: 'http://filery.local/api/index.php',
  filery_api_token: false,
  filery_dialog_height: '400px'
});
````
