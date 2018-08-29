<?php

namespace Filery;

use Exception;

class Encryption
{
    protected $publicKey;
    protected $privateKey;

    public function __construct($publicKey, $privateKey)
    {
        $this->publicKey = $publicKey;
        $this->privateKey = $privateKey;
    }

    public function encrypt($data)
    {
        if (openssl_public_encrypt($data, $encrypted, $this->publicKey)) {
            return base64_encode($encrypted);
        }
        throw new Exception('Unable to encrypt data. Perhaps it is bigger than the key size?');
    }

    public function decrypt($data)
    {
        if (openssl_private_decrypt(base64_decode($data), $decrypted, $this->privateKey)) {
            return $decrypted;
        }
        return '';
    }
}

function convert_string($action, $string)
{
    $output = '';
    $encrypt_method = "AES-256-CBC";
    $secret_key = 'eaiYYkYTysia2lnHiw0N0vx7t7a3kEJVLfbTKoQIx5o=';
    $secret_iv = 'eaiYYkYTysia2lnHiw0N0';
    // hash
    $key = hash('sha256', $secret_key);
    $initialization_vector = substr(hash('sha256', $secret_iv), 0, 16);
    if ($string != '') {
        if ($action == 'encrypt') {
            $output = openssl_encrypt($string, $encrypt_method, $key, 0, $initialization_vector);
            $output = base64_encode($output);
        }
        if ($action == 'decrypt') {
            $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $initialization_vector);
        }
    }
    return $output;
}
