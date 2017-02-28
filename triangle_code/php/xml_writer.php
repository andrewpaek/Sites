<?php

	require_once 'KLogger.php';
	
	$log = new KLogger ( "log.txt" , KLogger::DEBUG );
	
	try
	{
		//echo getcwd() . "\n";
		echo '   trying';
		$uid = $_POST['uid'];
		$time = time(); 
		
		$file=$uid . "_" . $time;
		// $file=$_POST['filename'];
		if (is_writable($file))
		{
			$log->LogError("file is writable");
		}
		else {
			$log->LogError($filename);
			$log->LogError("can't write to file");
		}
		$f = fopen($file, 'w+');
		echo fileperms($file);
		
		echo fwrite($f,$_POST['gantt']);
	
		fclose($f);
		//$z=file_get_contents($file);
		//echo $z;
	}
	catch(Exception $e)
	{
		$log->LogError($e->getMessage());
	}
	echo 'no exception';
	if ($f) print 1;
	else print 0;
	return $file
?>