<?php
session_start();
session_unset();
ob_get_clean();
header('Location: index.php');

?>