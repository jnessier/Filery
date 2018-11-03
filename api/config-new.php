<?php

return [
    'base' => [
        'path' => 'absolute/path/to/storage',
        'url' => 'http://domain.tld/storage',
    ],
    'show' => [
        'hidden' => false, // Set TRUE to list hidden files and folders
        'folders' => true, // Set TRUE to list folders too
    ],
    'hide' => [
        '.htaccess',
    ], // Add folder and file names which you want to hide (or for safety first when show.hidden is enabled)
    'upload' => [
        'overwrite' => false,
    ],
];
