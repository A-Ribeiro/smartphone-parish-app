<?php 

	function delTree($dir) { 
		$files = array_diff(scandir($dir), array('.','..','desinstalar.php')); 
		foreach ($files as $file) { 
			(is_dir("$dir/$file")) ? delTree("$dir/$file") : unlink("$dir/$file"); 
		} 
		return rmdir($dir); 
	} 
	//generate config.php
	delTree("./");
	
	header('location:./');
?>