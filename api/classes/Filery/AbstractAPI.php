<?php

namespace Filery;

use Exception;
use Throwable;

abstract class AbstractAPI
{
    /**
     * API configuration.
     *
     * @var array
     */
    protected $config = [
        'base' => [
            'path' => 'absolute/path/to/storage',
            'url' => 'http://domain.tld/storage',
        ],
        'showHiddenFiles' => false,
        'accessControl' => [
            'acceptedOrigins' => [],
            'acceptedMethods' => 'GET, POST, DELETE, PUT, OPTIONS',
        ],
        'fileTypes' => [
            'code' => ['java', 'php', 'html', 'js', 'css', 'htm', 'cpp', 'ts', 'xml', 'json', 'bat', 'sh', 'py'],
            'audio' => ['mp3', 'wav', 'ogg', 'wma', 'flac'],
            'image' => ['gif', 'bmp', 'jpg', 'jpeg', 'png', 'webp'],
            'text' => ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'csv', 'pdf'],
            'video' => ['mp4', 'qt', 'mov', 'avi', 'flv', 'wmv', 'webm'],
            'zip' => ['zip', 'rar', 'tar', '7z'],
        ],
        'upload' => [
            'overwrite' => false,
            'maxFileSize' => 2000000,
            'allowedFileExtensions' => [
                'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'csv', 'pdf',
                'mp3', 'wav', 'ogg', 'wma', 'flac',
                'gif', 'bmp', 'jpg', 'jpeg', 'png', 'webp',
                'mp4', 'qt', 'mov', 'avi', 'flv', 'wmv', 'webm',
                'zip', 'rar', 'tar', '7z',
            ],
        ],
    ];

    /**
     * Registered API actions.
     *
     * @var array
     */
    protected $actions = [];

    /**
     * AbstractAPI constructor.
     *
     * @param array $config API Configuration
     */
    public function __construct($config)
    {
        $this->config['upload']['maxFileSize'] = return_bytes(ini_get('upload_max_filesize'));

        $this->config = array_replace_recursive($this->config, $config);
    }

    /**
     * Register API actions.
     *
     * @param string   $method    POST, GET, DELETE or PUT
     * @param array    $queryKeys Keys of query parameters
     * @param callable $callback  Callback when API action get called
     *
     * @return self
     */
    protected function register($method, $queryKeys, $callback)
    {
        $this->actions[$method] = [
            'queryKeys' => $queryKeys,
            'callback' => $callback,
        ];

        return $this;
    }

    /**
     * Run API and echo JSON encode result as response.
     */
    public function run()
    {
        try {
            $this->cors();

            try {
                if (!isset($_SERVER['HTTP_X_FILERY_TOKEN'])) {
                    throw new Exception('Token not sent.');
                }
                $token = new Token();
                $customConfig = $token
                    ->set($_SERVER['HTTP_X_FILERY_TOKEN'])
                    ->fetchFromSession();
                $this->config = array_replace_recursive($this->config, $customConfig);
            } catch (Throwable $ex) {
                throw new HttpException(401);
            }

            if (!is_readable($this->config['base']['path'])) {
                throw new Exception('Base path does not exist or is not readable.');
            }

            $output = $this->call();
        } catch (HttpException $ex) {
            http_response_code($ex->getCode());
            $output = ['error' => $ex->getMessage()];
        } catch (Throwable $ex) {
            http_response_code(500);
            $output = [
                'error' => $ex->getMessage(),
            ];
        } finally {
            header('Content-Type: application/json');
            echo json_encode($output);
            exit;
        }
    }

    /**
     * Cross-Origin Resource Sharing handling.
     *
     * @see https://stackoverflow.com/a/9866124/2338829
     * @see https://www.tiny.cloud/docs/advanced/php-upload-handler/
     */
    protected function cors()
    {
        if (isset($_SERVER['HTTP_ORIGIN']) && count($this->config['accessControl']['acceptedOrigins']) > 0) {
            if (in_array($_SERVER['HTTP_ORIGIN'], $this->config['accessControl']['acceptedOrigins'])) {
                header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);
            } else {
                throw new HttpException(403);
            }
        }

        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');

        if ('OPTIONS' == $_SERVER['REQUEST_METHOD']) {
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
                header('Access-Control-Allow-Methods: '.$this->config['accessControl']['acceptedMethods']);
            }

            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
                header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
            }

            exit();
        }
    }

    /**
     * Call registered API action.
     *
     * @return mixed
     *
     * @throws HttpException
     */
    protected function call()
    {
        $key = $_SERVER['REQUEST_METHOD'];
        if (isset($this->actions[$key])) {
            $callback = $this->actions[$key]['callback'];
            $queryKeys = $this->actions[$key]['queryKeys'];
            if (is_callable($callback) && count(array_intersect(array_keys($_GET), $queryKeys)) == count($queryKeys)) {
                return call_user_func($callback, json_decode(file_get_contents('php://input'), true));
            }
        }
        throw new HttpException(404);
    }

    /**
     * Aggregate file data.
     *
     * @param string $path File path
     *
     * @return array
     */
    protected function aggregateFileData($path)
    {
        $name = basename($path);

        if (is_file($path)) {
            $type = 'file';
            $extension = pathinfo($path, PATHINFO_EXTENSION);
            $size = filesize($path);
            foreach ($this->config['fileTypes'] as $fileType => $extensions) {
                if (in_array($extension, $extensions)) {
                    $type = $fileType;
                    break;
                }
            }
        } else {
            $type = 'folder';
            $extension = '';
            $size = 0;
        }

        return [
            'url' => $this->config['base']['url'].'/'.$name,
            'name' => $name,
            'extension' => $extension,
            'time' => filemtime($path),
            'size' => $size,
            'type' => $type,
        ];
    }
}
