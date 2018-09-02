<?php

namespace Filery;

use Exception;
use Throwable;

class API
{
    /**
     * API configuration
     * @var array
     */
    protected $config = [];

    /**
     * Registered API actions
     * @var array
     */
    protected $actions = [];

    /**
     * AbstractAPI constructor.
     * @param array $config API Configuration
     */
    public function __construct($config)
    {
        $this->config = $config;
    }


    /**
     * Register API actions
     * @param string $method POST, GET, DELETE or PUT
     * @param array $queryKeys Keys of query parameters
     * @param callable $callback Callback when API action get called
     * @return self
     */
    public function register($method, $queryKeys, $callback)
    {
        $key = $method . implode($queryKeys);
        $this->acttions[$key] = $callback;

        return $this;
    }

    /**
     * Run API and echo JSON encode result as response.
     */
    public function run()
    {
        try {
            if (!is_readable($this->config['base']['path'])) {
                throw new Exception('Base path does not exist or is not readable.');
            }

            $output = call_user_func($this->getCallback(), [
                'input' => json_decode(file_get_contents('php://input'), true)
            ]);
        } catch (StatusException $ex) {
            http_response_code($ex->getCode());
            $output = [
                'message' => $ex->getMessage()
            ];
        } catch (Throwable $ex) {
            http_response_code(500);
            $output = [
                'message' => $ex->getMessage()
            ];
        }

        header('Access-Control-Allow-Origin: ' . $this->config['allowedOrigin']);
        header('Access-Control-Allow-Headers: ' . $this->config['allowedHeaders']);
        header('Content-Type: application/json');
        echo json_encode($output);
        exit;
    }

    /**
     * Get callback of registered API actions
     * @return mixed
     * @throws HttpException
     */
    protected function getCallback()
    {


        $key = $_SERVER['REQUEST_METHOD'] . implode(array_keys($_GET));
        if (isset($this->actions[$key])) {
            $callback = $this->actions[$key];
            if (is_callable($callback)) {
                return call_user_func($callback, [
                    'input' => json_decode(file_get_contents('php://input'), true)
                ]);
            }
        }
        throw new StatusException('', 404);
    }
}
