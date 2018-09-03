<?php

return [
    'base' => [
        'path' => __DIR__ . '/files',
        'url' => 'http://localhost/filery/php/files',
    ],
    'keys' => [
        'public' => '...public key here...',
        'private' => '...private key here...'
    ],
    'accessControl' => [
        'allowedOrigin' => '*',
        'allowedMethods' => 'GET, POST, DELETE, OPTIONS'
    ],
    'fileTypes' => [
        'code' => ['java', 'php', 'html', 'js', 'css', 'htm', 'cpp', 'ts', 'xml', 'json', 'bat'],
        'audio' => ['mp3', 'wav', 'ogg', 'wma'],
        'image' => ['gif', 'bmp', 'jpg', 'jpeg', 'png'],
        'text' => ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'],
        'video' => ['mp4', 'wma', 'qt', 'mov'],
        'zip' => ['zip', 'rar'],
    ]
];