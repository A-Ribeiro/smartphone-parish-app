<?php

require_once 'pdf.php';

if (isset($_REQUEST["data"])) {
	$data = json_decode($_REQUEST["data"],true);

	if ( isset($data["jsonMusicIDs"]) && isset($data['scriptName']) && isset($data["musicianVersion"]) && isset($data["token"]) ) {
		$userInfo = GetGoogleUserInfo($data["token"]);
		generatePDF($userInfo,$data);
	} else {
		echo(UTF_parse('missing parameters...'));
	}
}
?>
