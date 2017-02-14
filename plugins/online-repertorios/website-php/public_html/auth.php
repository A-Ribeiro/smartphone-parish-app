<?php
require_once "config.php";

if (!isset($email_permission_to_write))
	$email_permission_to_write = [
		"alessandro.ribeiro.silva@gmail.com" => true,
		"spdoido@gmail.com" => true
	];

if (!isset($email_permission_to_backup_restore))
	$email_permission_to_backup_restore = [
		"alessandro.ribeiro.silva@gmail.com" => true
	];

function canEmailWrite($email) {
	global $email_permission_to_write;
	if ( array_key_exists ( $email , $email_permission_to_write ) )
		return $email_permission_to_write[$email];
	
	return false;
}

function canEmailBackupRestore($email) {
	global $email_permission_to_backup_restore;
	if ( array_key_exists ( $email , $email_permission_to_backup_restore ) )
		return $email_permission_to_backup_restore[$email];
	
	return false;
}

?>
