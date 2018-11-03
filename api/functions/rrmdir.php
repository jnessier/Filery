<?php
/**
 * Recursively delete folder with subfolders and files.
 *
 * @param $path Folder path
 *
 * @return bool
 */
function rrmdir($path)
{
    $dir = opendir($path);
    while (false !== ($file = readdir($dir))) {
        if (('.' != $file) && ('..' != $file)) {
            $full = $path.'/'.$file;
            if (is_dir($full)) {
                rrmdir($full);
            } else {
                unlink($full);
            }
        }
    }
    closedir($dir);

    return rmdir($path);
}
