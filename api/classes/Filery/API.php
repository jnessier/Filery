<?php

namespace Filery;

use Exception;

class API extends AbstractAPI
{
    /**
     * AbstractAPI constructor.
     *
     * @param array $config API Configuration
     */
    public function __construct(array $config)
    {
        parent::__construct($config);

        $this
            ->register('GET', [], [$this, 'read'])
            ->register('DELETE', ['fileName'], [$this, 'delete'])
            ->register('POST', [], [$this, 'upload']);
    }

    /**
     * Read API action (get all files)
     *
     * @return array
     */
    protected function read()
    {
        $data = [];
        $fileNames = scandir($this->config['base']['path']);

        foreach ($fileNames as $fileName) {
            $filePath = $this->config['base']['path'] . '/' . $fileName;
            if (is_file($filePath)) {
                if ($this->config['showHiddenFiles'] || '.' !== $fileName[0]) {
                    $data[] = $this->aggregateFileData($filePath);
                }
            }
        }

        return $data;
    }

    /**
     * Delete API action (delete file by file name)
     *
     * @return array
     * @throws Exception
     */
    protected function delete()
    {
        $fileName = $_GET['fileName'];
        $filePath = $this->config['base']['path'] . '/' . basename($fileName);

        if (basename($fileName) === $fileName && is_readable($filePath) && is_file($filePath)) {
            if (unlink($filePath)) {
                return [];
            }
        }
        throw new Exception('File does not exist or is not deletable.');
    }

    /**
     * Upload API action (upload file)
     *
     * @return array
     * @throws Exception
     * @throws HttpException
     */
    protected function upload()
    {
        $fileData = $_FILES['file'];

        $fileName = basename($fileData['name']);
        $filePath = $this->config['base']['path'] . '/' . $fileName;
        $fileExtension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

        // Check if file already exists
        if (file_exists($filePath) && !$this->config['upload']['overwrite']) {
            throw new HttpException(409, 'File already exists.');
        }

        if ($fileData['size'] > $this->config['upload']['maxFileSize']) {
            throw new HttpException(413, 'File is too large.');
        }

        if (!in_array($fileExtension, $this->config['upload']['allowedFileExtensions'])) {
            throw new HttpException(415, 'File extension is not allowed.');
        }

        if (move_uploaded_file($fileData['tmp_name'], $filePath)) {
            return $this->aggregateFileData($filePath);
        }
        throw new Exception('File upload failed.');
    }
}
