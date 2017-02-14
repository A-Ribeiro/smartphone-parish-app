<?php 

	function delTree($dir) { 
		$files = array_diff(scandir($dir), array('.','..')); 
		foreach ($files as $file) { 
			(is_dir("$dir/$file")) ? delTree("$dir/$file") : unlink("$dir/$file"); 
		} 
		return rmdir($dir); 
	} 
	//generate config.php
	
	
	$zip = new ZipArchive;
	
	if ($zip->open("site.zip")) {
		$path = getcwd() . "/"; 
        $path = str_replace("\\","/",$path); 
        echo "Extracting: ".$path."site.zip";
        echo $zip->extractTo($path); 
        $zip->close(); 
        echo 'Done.'; 
	}
	
	
    if ($zip->open("_3rdparty/html2pdf.zip")) {
        $path = getcwd() . "/"; 
        $path = str_replace("\\","/",$path); 
        echo "Extracting: ".$path."html2pdf.zip";
        echo $zip->extractTo($path); 
        $zip->close(); 
        echo 'Done.'; 
    }
	
	if ($zip->open("_3rdparty/google-api-php-client-2.1.1.zip")) {
        $path = getcwd() . "/"; 
        $path = str_replace("\\","/",$path); 
        echo "Extracting: ".$path."google-api-php-client-2.1.1.zip";
        echo $zip->extractTo($path); 
        $zip->close(); 
        echo 'Done.'; 
    }
	
	delTree("_3rdparty");
	unlink("site.zip");
	
	header('location:index.html');
	
	//unlink("index.php");
?>