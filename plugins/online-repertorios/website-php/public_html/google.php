<?php

require_once 'config.php';

if ( $GOOGLE_CLIENT_ID != "" ) {
	require_once 'google-api-php-client-2.1.1/vendor/autoload.php';
}

function GetGoogleUserInfo($id_token){
	global $GOOGLE_CLIENT_ID;
	
	if ( $GOOGLE_CLIENT_ID == "" ) {
		return [
			"name"=>getenv("username"),
			"email"=>"local"
			];
	}
	
	$client = new Google_Client([ 'client_id' => $GOOGLE_CLIENT_ID ]);
	
	$payload = $client->verifyIdToken($id_token);
	if ($payload) {
	  //$userid = $payload['sub'];
	  // If request specified a G Suite domain:
	  //$domain = $payload['hd'];
	  return $payload;
	} else {
	  // Invalid ID token
	  return null;
	}
}

//define('__ROOT__', dirname(dirname(__FILE__))); 
//require_once(__ROOT__.'/auth.php'); 

?>