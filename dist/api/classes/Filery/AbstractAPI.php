<?php

namespace Filery;

use Exception;
use Throwable;

abstract class AbstractAPI
{
    /**
     * API configuration
     * @var array
     */
    protected $config = [];

    /**
     * API result
     * @var array
     */
    protected $result = [
        'status' => true,
        'message' => '',
        'data' => [],
    ];

    /**
     * API actions
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
     * Run API and echo JSON encode result as response.
     */
    public function run()
    {
        try {
            if (!is_readable($this->config['base']['path'])) {
                throw new Exception('Base path does not exist or is not readable.');
            } else if (!isset($_GET['action']) || !isset($this->actions[$_GET['action']]) || !method_exists($this, $_GET['action'])) {
                throw new Exception('API action not found.');
            }

            $args = [];
            foreach ($this->actions[$_GET['action']] as $key) {
                if (isset($_GET[$key])) {
                    $args[$key] = $_GET[$key];
                } else if (isset($_POST[$key])) {
                    $args[$key] = $_POST[$key];
                }
            }

            if (count($args) < count($this->actions[$_GET['action']])) {
                throw new Exception('Arguments for API action not found.');
            }

            call_user_func_array([$this, $_GET['action']], $args);
        } catch (Throwable $ex) {
            $this->result['status'] = false;
            $this->result['message'] = $ex->getMessage();
        }

        header('Access-Control-Allow-Origin: ' . $this->config['allowedOrigin']);
        header('Access-Control-Allow-Headers: ' . $this->config['allowedHeaders']);
        header('Content-Type: application/json');
        echo json_encode($this->result);
        exit;
    }
}
