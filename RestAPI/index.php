<?php
require '../vendor/autoload.php';

// Run app
$app = (new Rpg\MonsterAPI\App())->get();
$app->run();