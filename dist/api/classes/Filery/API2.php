<?php

namespace Filery;

use Exception;

class API extends AbstractAPI
{
    /**
     * API actions
     * @var array
     */
    protected $actions = [
        'fetch' => [],
        'delete' => [
            'fileName'
        ],
        'upload' => [
            'file'
        ],
        'rename' => [
            'fileName',
            'newFileName'
        ]
    ];


    /**
     * API action to fetch files
     */
    protected function fetch()
    {
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
    }

    /**
     * API action to delete file.
     * @param string $fileName File name
     * @throws Exception
     */
    protected function delete($fileName)
    {
        $filePath = $this->config['base']['path'] . '/' . basename($fileName);
        if (basename($fileName) === $fileName && is_readable($filePath) && is_file($filePath)) {
            if (unlink($filePath)) {
                return;
            }
        }
        throw new Exception('File does not exist or is not deletable.');
    }
}
