<?php

return [
    'base' => [
        'path' => realpath(__DIR__.'/../dev/storage'),
        'url' => 'http://filery.local/dev/storage',
    ],
    'showHiddenFiles' => false,
    'upload' => [
        'overwrite' => true,
    ],
];
