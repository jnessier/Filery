<?php

return [
    'base' => [
        'path' => realpath(__DIR__ . '/../storage'),
        'url' => 'http://filery.local/storage',
    ],
    'upload' => [
        'overwrite' => true,
    ],
];