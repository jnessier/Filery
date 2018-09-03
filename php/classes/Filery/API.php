<?php
/**
 * Created by PhpStorm.
 * User: Jonathan Nessier
 * Date: 03.09.2018
 * Time: 13:09
 */

namespace Filery;


use Exception;

class API extends AbstractAPI
{

    public function __construct(array $config)
    {
        parent::__construct($config);

        $this
            ->register('GET', [], [$this, 'read'])
            ->register('DELETE', ['fileName'], [$this, 'delete']);
    }


    protected function read()
    {
        $data = [];
        $fileNames = scandir($this->config['base']['path']);

        foreach ($fileNames as $fileName) {
            $fileUrl = $this->config['base']['url'] . '/' . $fileName;
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

                $data[] = [
                    'url' => $fileUrl,
                    'name' => $fileName,
                    'extension' => $extension,
                    'time' => filemtime($filePath),
                    'size' => filesize($filePath),
                    'type' => $type
                ];
            }
        }
        return $data;
    }

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


}