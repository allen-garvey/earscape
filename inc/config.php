<?php 
define('ENVIRONMENT_DEVELOPMENT', 0);
define('ENVIRONMENT_PRODUCTION', 1);
require_once('current_environment.php'); //gets environment_current constant

if(ENVIRONMENT_CURRENT === ENVIRONMENT_DEVELOPMENT){
	define('BASE_URL','/earscape/');
	define('ROOT_PATH',$_SERVER['DOCUMENT_ROOT'] . '/earscape/');
}

define('INC_PATH', ROOT_PATH.'inc/');
define('VIEWS_PATH', INC_PATH.'views/');
define('CONTROLLERS_PATH', INC_PATH.'controllers/');
define('MODELS_PATH', INC_PATH.'models/');
define('SVG_PATH', INC_PATH.'svg/');

define('STYLES_URL', BASE_URL.'styles/');
define('SCRIPTS_URL', BASE_URL.'scripts/');
define('IMAGES_URL', BASE_URL.'images/');

