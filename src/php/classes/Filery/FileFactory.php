<?php

namespace Filery;

use Exception;

class FileFactory
{
    protected $config;

    public function __construct($config)
    {
        $this->config = $config;
    }

    public function create($path)
    {
        if (is_file($path)) {

            $type = 'file';
            $name = basename($path);
            $extension = pathinfo($path, PATHINFO_EXTENSION);
            $url = $this->config['base']['url'] . '/' . $name;

            foreach ($this->config['fileTypes'] as $fileType => $extensions) {
                if (in_array($extension, $extensions)) {
                    $type = $fileType;
                    break;
                }
            }

            return [
                'url' => $url,
                'name' => $name,
                'extension' => $extension,
                'time' => filemtime($path),
                'size' => filesize($path),
                'type' => $type
            ];
        }
        throw new Exception('File path is not valid.');
    }

    public function createByUpload($data)
    {

        $fileName = basename($data['name']);
        $filePath = $this->config['base']['path'] . '/' . $fileName;
        $fileExtension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

        if (!in_array($fileExtension, $this->config['upload']['allowedFileExtensions'])) {
            throw new HttpException(415, 'File extension is not allowed.');
        }

        if (file_exists($filePath) && !$this->config['upload']['overwrite']) {
            throw new HttpException(409, 'File already exists.');
        }

        if ($data['size'] > $this->config['upload']['maxFileSize']) {
            throw new HttpException(413, 'File is too large.');
        }

        if (move_uploaded_file($data['tmp_name'], $filePath)) {
            return $this->fileFactory->create($filePath);
        }
        throw new Exception('File upload failed.');
    }

}