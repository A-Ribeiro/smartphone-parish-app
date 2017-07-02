<?php

require_once "config.php";
//
// DB configuration
//
// $USE_MYSQL = false;
$pdo = null;


function initDB() {
	global $USE_MYSQL;
	global $pdo;
	
	global $MYSQL_HOST;
	global $MYSQL_DBNAME;
	global $MYSQL_DBUSER;
	global $MYSQL_DBPASSWD;
	
	
	
	if ($pdo != null)
		return;
	
	if ($USE_MYSQL)
		$pdo = new PDO("mysql:host=$MYSQL_HOST;dbname=$MYSQL_DBNAME", "$MYSQL_DBUSER", "$MYSQL_DBPASSWD");
	else 
		$pdo = new PDO('sqlite:db.sqlite3');
	
	if ( $pdo == null ){
		echo 'Database driver load problem...';
		exit;
	}

	sqlite_check_tables_creation();
	
}



function truncateTables() {
	global $USE_MYSQL;
	global $pdo;
	
	initDB();
	
	if (!$USE_MYSQL) {
		$pdo->exec("DELETE FROM `music`;");
		$pdo->exec("VACUUM;");
		
		$pdo->exec("DELETE FROM `script`;");
		$pdo->exec("VACUUM;");
	} else {
		$pdo->exec("TRUNCATE `music`;");
		$pdo->exec("TRUNCATE `script`;");
	}
}

function sqlite_check_tables_creation() {
	global $USE_MYSQL;
	global $pdo;
	
	initDB();
	
	if (!$USE_MYSQL) {
		// Set errormode to exceptions
		$pdo->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
		try {
			
			$pdo->exec(
				"CREATE TABLE IF NOT EXISTS `music` (
					`id` INTEGER NOT NULL PRIMARY KEY,
					`userEmail` varchar(64) NOT NULL,
					`userName` varchar(128) NOT NULL,
					`name` varchar(200) NOT NULL UNIQUE,
					`last-modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
					`raw` text NOT NULL,
					`json` text NOT NULL
				);"
			);
			
			
			$pdo->exec(
				"CREATE TABLE IF NOT EXISTS `script` (
					`id` INTEGER NOT NULL PRIMARY KEY,
					`userEmail` varchar(64) NOT NULL,
					`userName` varchar(128) NOT NULL,
					`name` varchar(200) NOT NULL UNIQUE,
					`last-modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
					`json` text NOT NULL
				);"
			);
			
			//$pdo->exec( "CREATE INDEX IF NOT EXISTS dateindex ON `music` (`last-modify`);" );
			//$pdo->exec( "CREATE INDEX IF NOT EXISTS dateindex ON `script` (`last-modify`);" );
			
		} catch (PDOException $e) {
			echo 'ERROR: ' . $e->getMessage();
			exit;
		}
		
		$pdo->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_SILENT);
		
	} else {
		
		$pdo->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
		try {
			
			$pdo->exec(
				"CREATE TABLE IF NOT EXISTS `music` (
					`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
					`userEmail` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
					`userName` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
					`name` varchar(200) COLLATE utf8_unicode_ci NOT NULL UNIQUE,
					`last-modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
					`raw` text COLLATE utf8_unicode_ci NOT NULL,
					`json` text COLLATE utf8_unicode_ci NOT NULL  
				) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;");

			$pdo->exec(
				"CREATE TABLE IF NOT EXISTS `script` (
					`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
					`userEmail` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
					`userName` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
					`name` varchar(200) COLLATE utf8_unicode_ci NOT NULL UNIQUE,
					`last-modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
					`json` text COLLATE utf8_unicode_ci NOT NULL
				) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;");
				
			/*
			ALTER TABLE `music`
			  ADD KEY `dateindex` (`last-modify`);
			ALTER TABLE `script`
			  ADD KEY `dateindex` (`last-modify`);
			*/
			
		} catch (PDOException $e) {
			echo 'ERROR: ' . $e->getMessage();
			exit;
		}
		
		$pdo->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_SILENT);
		
	}
}

?>