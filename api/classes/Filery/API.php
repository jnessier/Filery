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
            ->register('GET', ['dir'], [$this, 'read'])
            ->register('DELETE', ['dir', 'name'], [$this, 'delete'])
            ->register('POST', ['dir'], [$this, 'upload']);
    }

    /**
     * Call registered API action.
     *
     * @return mixed
     */
    protected function call()
    {
        if (isset($_GET['dir'])) {
            $newBasePath = realpath($this->config['base']['path'].$_GET['dir']);
            if ($newBasePath && 0 === strpos($newBasePath, $this->config['base']['path'])) {
                $this->config['base']['path'] = $newBasePath;
                $this->config['base']['url'] .= $_GET['dir'];
            }
        }

        return parent::call();
    }

    /**
     * Read API action (get all files).
     *
     * @return array
     */
    protected function read()
    {
        $data = [];

        $fileNames = scandir($this->config['base']['path']);

        foreach ($fileNames as $fileName) {
            $filePath = $this->config['base']['path'].'/'.$fileName;

            if ($this->config['show']['folders'] || !is_dir($filePath)) {
                if ($this->config['show']['hidden'] || '.' !== $fileName[0]) {
                    if (!in_array($fileName, $this->config['hide'])) {
                        $data[] = $this->aggregateFileData($filePath);
                    }
                }
            }
        }

        usort($data, function ($a, $b) {
            if ($a['type'] === $b['type']) {
                return 0;
            }

            return ('folder' !== $a['type']) ? +1 : -1;
        });

        return $data;
    }

    /**
     * Delete API action (delete file by file name).
     *
     * @return array
     *
     * @throws Exception
     */
    protected function delete()
    {
        $fileName = $_GET['name'];
        $filePath = $this->config['base']['path'].'/'.basename($fileName);

        if (is_readable($filePath)) {
            if ((is_file($filePath) && unlink($filePath)) || rrmdir($filePath)) {
                return [];
            }
        }
        throw new Exception('File or folder does not exist nor is it deletable.');
    }

    /**
     * Upload API action (upload file).
     *
     * @return array
     *
     * @throws Exception
     * @throws HttpException
     */
    protected function upload()
    {
        $fileData = $_FILES['file'];

        $fileName = basename($fileData['name']);
        $filePath = $this->config['base']['path'].'/'.$fileName;
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
