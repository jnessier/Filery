<?php

use Filery\API;

// Include classes
require_once 'classes/Filery/API.php';
require_once 'classes/Filery/StatusException.php';

// API init and run
$api = new API(require 'config.php');
$api->register('GET', [], function () {
    $fileNames = scandir($this->config['base']['path']);
    foreach ($fileNames as $fileName) {
        $filePath = $this->config['base']['path'] . '/' . $fileName;
        if (is_file($filePath)) {

            $type = 'file';
            $extension = pathinfo($filePath, PATHINFO_EXTENSION);

            foreach ($this->config['fileTypes'] as $fileType => $extensions) {
                if (in_array($extension, $extensions)) {
                    $type = $fileType;
                    break;
                }
            }

            $this->result['data'][] = [
                'url' => $this->config['base']['url'] . '/' . $fileName,
                'name' => $fileName,
                'extension' => $extension,
                'time' => filemtime($filePath),
                'size' => filesize($filePath),
                'type' => $type
            ];
        }
    }
})->run();



