<?php

namespace Filery;

use Exception;

class Token
{
    /**
     * Token string.
     *
     * @var string
     */
    protected $token;

    /**
     * Filery session tokens.
     *
     * @var array
     */
    protected $session;

    /**
     * Constructor.
     */
    public function __construct()
    {
        if (PHP_SESSION_NONE == session_status()) {
            session_start();
        }

        if (!isset($_SESSION['filery_tokens'])) {
            $_SESSION['filery_tokens'] = [
                'register' => [],
                'data' => [],
            ];
        }

        $this->session = $_SESSION['filery_tokens'];

        $this->cleanUp();
    }

    /**
     * Destructor.
     */
    public function __destruct()
    {
        $_SESSION['filery_tokens'] = $this->session;
    }

    /**
     * Session clean up - delete "end-of-life" tokens.
     *
     * @return self
     */
    protected function cleanUp(): self
    {
        $eolTime = microtime(true) - (int) ini_get('session.gc_maxlifetime');
        foreach ($this->session['register'] as $tokenString => $registerTime) {
            if ($registerTime <= $eolTime) {
                unset($this->session['register'][$tokenString]);
                unset($this->session['data'][$tokenString]);
            }
        }

        return $this;
    }

    /**
     * Create token string.
     *
     * @param array $data Custom data
     *
     * @return Token
     */
    public function create(array $data = []): self
    {
        $this->token = base64_encode(sha1(session_id().serialize($data)));

        $this->storeToSession($data);

        return $this;
    }

    /**
     * Store data to the session, based on the token string as key.
     *
     * @param array $data Custom data
     *
     * @return self
     *
     * @throws Exception
     */
    protected function storeToSession(array $data): self
    {
        if ($this->token) {
            $this->session['register'][$this->token] = microtime(true);
            $this->session['data'][$this->token] = serialize($data);

            return $this;
        }
        throw new Exception('Cannot store data to session when token string is not set or created');
    }

    /**
     * Fetch data from the session, based on the token string as key.
     *
     * @return array
     *
     * @throws Exception
     */
    public function fetchFromSession(): array
    {
        if ($this->token) {
            return unserialize($this->session['data'][$this->token]);
        }
        throw new Exception('Cannot fetch data from session when token string is not set or created');
    }

    /**
     * Set token and.
     *
     * @param string $token Token string
     *
     * @return self
     *
     * @throws Exception
     */
    public function set(string $token): self
    {
        if (isset($this->session['register'][$token]) && isset($this->session['data'][$token])) {
            $this->token = $token;

            return $this;
        }
        throw new Exception('Token string is invalid.');
    }

    /**
     * Get token string.
     *
     * @return string
     */
    public function toString(): string
    {
        return $this->token;
    }
}
