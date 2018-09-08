<?php

return [
    'base' => [
        'path' => 'absolute/path/to/storage',
        'url' => 'http://domain.tld/storage',
    ],
    'showHiddenFiles' => false,
    'upload' => [
        'overwrite' => false,
    ],
    'tokenCallback' => function ($token) {
        // E.g. return decodeFileryToken($token);
        // or return $_SESSION[$token];
        return [];
    }
];