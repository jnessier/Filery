<?php

return [
    'base' => [
        'path' => realpath(__DIR__.'/../dev/storage'),
        'url' => 'http://filery.local/dev/storage',
    ],
    'show' => [
        'hidden' => false, // Set TRUE to list hidden files and folders
        'folders' => true, // Set TRUE to list folders too
    ],
    'hide' => [
        '.htaccess',
    ], // Add folder and file names which you want to hide (or for safety first when show.hidden is enabled)
    'upload' => [
        'overwrite' => true,
    ],
];
