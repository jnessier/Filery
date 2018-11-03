<!DOCTYPE html>
<html>
<head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.8.5/tinymce.min.js"></script>
    <script src="http://localhost:8080/scripts/main.js"></script>
    <?php
    session_start();

    require_once '../api/classes/Filery/Token.php';
    $token = new Filery\Token();
    $token->create([
        'base' => [
            'path' => realpath(__DIR__.'/storage/custom'),
            'url' => 'http://filery.local/dev/storage/custom',
        ],
    ]);
    ?>
    <script>
        tinymce.init({
            selector: 'textarea',
            menubar: false,

            plugins: [
                'link image imagetools media filery',
            ],

            height: '500px',
            toolbar: 'filery | insert | image',
            file_picker_types: 'file image media',

            image_advtab: true,
            imagetools_toolbar: 'editimage imageoptions',

            imagetools_cors_hosts: ['filery.local'],

            // Don't forget to set the Filery callback handler of images_upload_handler
            automatic_uploads: true,

            // Don't forget to enable upload.overwrite in your API config to get this work with Filery
            images_reuse_filename: true,

            // Alternative to images_upload_handler callback, but not supported by Filery
            //images_upload_url: 'http://filery.local/api/index.php?images_upload_url=1',

            filery_api_token: '<?= $token->toString(); ?>',
            filery_api_url: 'http://filery.local/api/index.php',

            file_picker_callback: function (callback, value, meta) {
                Filery.filePickerCallback(callback, value, meta);
            },
            images_upload_handler: function (blobInfo, success, failure) {
                Filery.imagesUploadHandler(blobInfo, success, failure);
            }
        });
    </script>
</head>
<body>
<textarea>Testing filery.</textarea>
</body>
</html>
