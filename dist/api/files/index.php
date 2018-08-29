<?php

use Filery\API;

// Include classes
require_once 'classes/Filery/AbstractAPI.php';
require_once 'classes/Filery/API.php';

// API init and run
$api = new API(require 'config.php');
$api->run();



