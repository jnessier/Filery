<?php

return [
    'base' => [
        'path' => 'absolute/path/to/storage',
        'url' => 'http://domain.tld/storage',
    ],
    // Return your custom config params, based on your token (filery_api_token)
    'tokenCallback' => function ($token) {
        // E.g. return decodeFileryToken($token);
        // or return $_SESSION[$token];
        return [];
    }
];