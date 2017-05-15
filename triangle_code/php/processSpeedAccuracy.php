

<?php


header('Content-Type: text/html; charset=utf-8');
require_once 'KLogger.php';

$log = new KLogger ( "/var/www/html/php/logSpeedAccuracy.txt" , KLogger::DEBUG );

// $pKeys = array_keys($_POST);
// for($i=0;$i<count($pKeys);$i++){
// 	$log ->LogError($pKeys[$i]);
// }


// $uid = mysqli_real_escape_string('uid=' . $_POST['uid']);
// $log->LogError('uid=' . $_POST['uid']);
// $key = mysqli_real_escape_string($_POST['key']);
$log->LogError($_POST['uid'] .'_'. $_POST['key'] . '_' . $_POST['value']);
// $value = $_POST['value'];
// $log->LogError($_POST['value']);

// $value = stripslashes($value);
// $log->LogError('afterStrip');
// $log->LogError($value);


?>
