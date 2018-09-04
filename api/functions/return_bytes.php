<?php
/**
 * Convert values to bytes
 * @see https://stackoverflow.com/a/6846537/2338829
 *
 * @param $val
 * @return int
 */
function return_bytes($val)
{
    $val = trim($val);

    if (is_numeric($val))
        return $val;

    $last = strtolower($val[strlen($val) - 1]);
    $val = substr($val, 0, -1); // necessary since PHP 7.1; otherwise optional

    switch ($last) {
        // The 'G' modifier is available since PHP 5.1.0
        case 'g':
            $val *= 1024;
        case 'm':
            $val *= 1024;
        case 'k':
            $val *= 1024;
    }

    return (int)$val;
}