<?php

require_once 'auth.php';
require_once 'db.php';
require_once 'google.php';
require_once 'pdf.php';

function toBase($num, $b=62) {
  $base='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  $r = $num  % $b ;
  $res = $base[$r];
  $q = floor($num/$b);
  while ($q) {
    $r = $q % $b;
    $q =floor($q/$b);
    $res = $base[$r].$res;
  }
  return $res;
}

function to10( $num, $b=62) {
  $base='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  $limit = strlen($num);
  $res=strpos($base,$num[0]);
  for($i=1;$i<$limit;$i++) {
    $res = $b * $res + strpos($base,$num[$i]);
  }
  return $res;
}

function intToAny( $num, $base = null, $index = null ) {
    if ( $num <= 0 ) return '0';
    if ( ! $index )
        $index = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if ( ! $base )
        $base = strlen( $index );
    else
        $index = substr( $index, 0, $base );
    $res = '';
    while( $num > 0 ) {
        $char = bcmod( $num, $base );
        $res .= substr( $index, $char, 1 );
        $num = bcsub( $num, $char );
        $num = bcdiv( $num, $base );
    }
    return $res;
}

//http://rosettacode.org/wiki/LZW_compression
function LZW_decompress($com) {
	//$com = explode(",",$com);
	$i;
	$w;
	$k;
	$result;
	$dictionary = array();
	$entry = "";
	$dictSize = 256;
	for ($i = 0; $i < 256; $i++) {
		$dictionary[$i] = chr($i);
	}
	$w = chr( $com[0] );
	$result = $w;
	for ($i = 1; $i < count($com);$i++) {
		$k = $com[$i];
		if ( array_key_exists ( $k , $dictionary ) ) {
			$entry = $dictionary[$k];
		} else {
			if ($k == $dictSize) {
				$entry = $w.$w[0];
			} else {
				return "ERROR in decompression";
			}
		}
		$result .= $entry;
		$dictionary[$dictSize++] = $w . $entry[0];
		$w = $entry;
	}
	return $result;
}


function unescape_utf8_encoded_ascii($str) {
	$str = preg_replace_callback('/\:u([0-9a-f]{4})/', function ($match) {
		return mb_convert_encoding(pack('H*', $match[1]), 'UTF-8', 'UTF-16BE');
	}, $str);
	$str = str_replace(": ",":",$str);
	return $str;
}


function DecompressLZW_Base62_to_UTF8_String( $str ){
	$int_array_lzw_json = explode(";",$str);
	//base inverse op
	for ($i = 0; $i < count($int_array_lzw_json);$i++)
		$int_array_lzw_json[$i] = to10($int_array_lzw_json[$i]);
	
	$original_utf8 = unescape_utf8_encoded_ascii(LZW_decompress($int_array_lzw_json));
	return $original_utf8;
}

?>
<?php

$data = json_decode($_REQUEST["data"],true);
$result = array();

/////////////////
// dump/restore calls
/////////////////
/*
if ($data["op"] == "check-compression") {
	
	$int_array_lzw_json = explode(";",$data["lzw-json"]);
	//base inverse op
	for ($i = 0; $i < count($int_array_lzw_json);$i++)
		$int_array_lzw_json[$i] = to10($int_array_lzw_json[$i]);
	
	$result []= $int_array_lzw_json;
	
	$encodedjson = LZW_decompress($int_array_lzw_json);
	$result []= $encodedjson;
	
	$original_utf8 = unescape_utf8_encoded_ascii($encodedjson);
	$result []= $original_utf8;
	
	$result []= DecompressLZW_Base62_to_UTF8_String( $data["lzw-json"] );
	
} else
	*/
//
// op: json-restore
//
if ($data["op"] == "json-restore"){
	
	
	if ( isset($data["compressed-json"]) && 
		// google api auth token
		 isset($data["token"]) ) {
		
		$userInfo = GetGoogleUserInfo($data["token"]);
		
		if ($userInfo != null && canEmailBackupRestore($userInfo["email"])) {
			
			truncateTables();
			sqlite_check_tables_creation();
			
			$json = DecompressLZW_Base62_to_UTF8_String($data["compressed-json"]);
			
			$json = json_decode($json,true);
			
			$musics = [
				'inserted' => 0,
				'count' => 0
			];
			initDB();
			for($i=0;$i<count($json['musics']);$i++){
				$entry = $json['musics'][$i];
				$stmt = $pdo->prepare("INSERT INTO `music` (`id`, `name`, `last-modify`, `raw`, `json`, `userName`, `userEmail` ) VALUES (:id, :name, :lastmodify, :raw, :json, :userName, :userEmail )");
				if ($stmt->execute([
					':id'=>$entry["id"],
					':name'=>$entry["name"],
					':lastmodify'=>$entry["last-modify"],
					':raw'=>$entry["raw"],
					':json'=>$entry["json"],
					':userName'=>$entry["userName"],
					':userEmail'=>$entry["userEmail"]
					]))
					$musics ['inserted'] ++;
				$musics['count'] ++;
			}
			$result ['musics'] = $musics;
			
			$scripts = [
				'inserted' => 0,
				'count' => 0
			];
			
			for($i=0;$i<count($json['scripts']);$i++){
				$entry = $json['scripts'][$i];
				$stmt = $pdo->prepare("INSERT INTO `script` (`id`, `name`, `last-modify`, `json`, `userName`, `userEmail` ) VALUES (:id, :name, :lastmodify, :json, :userName, :userEmail)");
				if ($stmt->execute([
					':id'=>$entry["id"],
					':name'=>$entry["name"],
					':lastmodify'=>$entry["last-modify"],
					':json'=>$entry["json"],
					':userName'=>$entry["userName"],
					':userEmail'=>$entry["userEmail"]
					]))
					$scripts ['inserted'] ++;
				$scripts['count'] ++;
			}
			$result ['scripts'] = $scripts;
			
			$stmt = null;
		} else {
			$result["error"] = "unauthorized";
		}
		
	} else {
		$result["error"] = "missing parameters...";
	}
	
	
} else
//
// op: json-dump
//
if ($data["op"] == "json-dump"){
	
	// google api auth token
	if ( isset($data["token"]) ) {
		
		$userInfo = GetGoogleUserInfo($data["token"]);
		
		if ($userInfo != null && canEmailBackupRestore($userInfo["email"])) {
				
			$result['musics'] = [];
			$result['scripts'] = [];
			initDB();
			$stmt = $pdo->prepare('SELECT * FROM `music`');
			if ($stmt->execute()) {
				$lastid = 0;
				while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
					if ( intval( $row['id'] ) > $lastid )
						$lastid = intval( $row['id'] );
					$result['musics'] []= $row;
				}
				$result['music-lastid'] = $lastid;
			}
			$stmt = null;
			
			
			$stmt = $pdo->prepare('SELECT * FROM `script`');
			if ($stmt->execute()) {
				$lastid = 0;
				while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
					if ( intval( $row['id'] ) > $lastid )
						$lastid = intval( $row['id'] );
					$result['scripts'] []= $row;
				}
				$result['script-lastid'] = $lastid;
			}
			$stmt = null;
			
		} else {
			$result["error"] = "unauthorized";
		}
		
	} else {
		$result["error"] = "missing parameters...";
	}
	
	//header("Pragma: public"); // required
	//header("Expires: 0");
	//header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
	//header("Cache-Control: private",false);
	//header('Content-Disposition: attachment; filename="music-script-dump.json"');
	
} else
/////////////////
// script calls
/////////////////
//
// op: script-list
//
if ($data["op"] == "script-list"){
	initDB();
	$stmt = $pdo->prepare('SELECT `id`, `name` FROM `script` ORDER BY `name` ASC');
	if ($stmt->execute()) {
		while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$result[] = $row;
		}
	}
	$stmt = null;
} else
//
// op: script-record
//
if ($data["op"] == "script-record-by-id"){
	if ( isset($data["name"]) &&
		 isset($data["json"]) &&
		
		 isset($data["token"]) // google api auth token
		) {
		
		$userInfo = GetGoogleUserInfo($data["token"]);
		
		if ($userInfo != null && canEmailWrite($userInfo["email"])) {
			$params = [
				':name'=>$data["name"],
				':json'=>$data["json"],
				
				":userName"=>$userInfo["name"],
				":userEmail"=>$userInfo["email"]
				
			];
			if (!isset($data["id"]) || $data["id"] == null) {
				initDB();
				$stmt = $pdo->prepare("INSERT INTO `script` (`name`, `last-modify`, `json`, `userName`, `userEmail` ) VALUES (:name, CURRENT_TIMESTAMP, :json, :userName, :userEmail )");
				$result["success"] = $stmt->execute($params);
				if ($result["success"]) {
					// get inserted ID
					$result["id"] = (string)$pdo->lastInsertId();
				}
			}else {
				$params [':id'] = $data["id"];
				initDB();
				$stmt = $pdo->prepare("UPDATE `script` SET `name`=:name, `last-modify`=CURRENT_TIMESTAMP, `userName`=:userName, `userEmail`=:userEmail, `json`=:json WHERE `script`.`id` = :id");
				$result["success"] = $stmt->execute($params);
				$result["id"] = $data["id"];
			}
			
			$stmt = null;
		} else {
			$result["error"] = "unauthorized";
		}
	} else {
		$result["error"] = "missing parameters...";
	}
}else
//
// op: script-get
//
if ($data["op"] == "script-get-by-id"){
	if (isset( $data['id'] )) {
		initDB();
		$stmt = $pdo->prepare('SELECT `id`, `name`, `last-modify`, `json` FROM `script` WHERE `id`=:id LIMIT 1');
		if ($stmt->execute( [':id'=>$data['id']] )) {
			if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
				$result = $row;
			}
		}
		$stmt = null;
		if (count($result) == 0)
			$result["error"] = "script not found";
	} else {
		$result["error"] = "missing parameters...";
	}
}else
//
// op: script-export-json
//
if ($data["op"] == "script-export-json"){
	
	if (isset( $data["jsonScriptIDs"] ) && isset($data["token"]) ) {
		
		
		
		$userInfo = GetGoogleUserInfo($data["token"]);
		
		if ($userInfo != null && isset($userInfo["name"])) {
			
			
			//
			// 1st level query -- query all scripts...
			//
			$musicDictionary = array();
			$musicquery = "";
			$musicparams = array();
			
			
			$jsonScriptIDs = json_decode($data["jsonScriptIDs"],true);
			$query = "";
			$params = array();
			
			$non_repeat_aux = array();
			for ($i=0;$i<count($jsonScriptIDs);$i++){
				
				if (isset($non_repeat_aux[$jsonScriptIDs[$i]]))
					continue;
				
				if ($i != 0)
					$query .= ",";
				$query .= ":name_" . (string)$i;
				$params[":name_". (string)$i] = $jsonScriptIDs[$i];
				
				$non_repeat_aux[$jsonScriptIDs[$i]] = "";
			}
			
			//SELECT `json` FROM `script` WHERE `name` in (:name_0,:name_1,:name_2,...) order by `name` ASC
			$query = "SELECT `json` FROM `script` WHERE `id` in (" . $query . ") ORDER BY `name` ASC";
			initDB();
			$stmt = $pdo->prepare($query);
			if ($stmt->execute($params)) {
				while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
					$row = json_decode($row['json'],true);
					if(isset($row['list'])) {
						
						$result[] = $row;
						
						$musiclist = $row['list'];
						
						for ($i=0;$i<count($musiclist);$i++){
							
							$music = $musiclist[$i]['id'];
							if (isset($musicDictionary[$music]))
								continue;
							
							
							$musicindex = count($musicDictionary);
							
							if ($musicindex != 0)
								$musicquery .= ",";
							$musicquery .= ":name_" . (string)$musicindex;
							$musicparams[":name_". (string)$musicindex] = $music;
							
							$musicDictionary[$music] = "";
						}
					}
				}
			}
			$stmt = null;
			
			
			//
			// 2nd level query -- query all musics
			//
			
			$musicquery = "SELECT `id`, `json` FROM `music` WHERE `id` in (" . $musicquery . ")";
			
			$stmt = $pdo->prepare($musicquery);
			if ($stmt->execute($musicparams)) {
				while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
					$musicDictionary[$row['id']] = json_decode($row['json'],true);
				}
			}
			$stmt = null;
			
			//
			// 3rd pass -- join the music in the result lists
			//
			
			for ($i=0;$i<count($result);$i++){
				
				if (isset($result[$i]['list'])){
					$listToPDF = [];
					$musiclist = $result[$i]['list'];
					
					$result[$i]['list'] = array();
					for ($j=0;$j<count($musiclist);$j++){
						$music = $musiclist[$j]['id'];
						$listToPDF []= $music;
						if (isset($musicDictionary[$music]) && $musicDictionary[$music] != "")
							$result[$i]['list'] []= $musicDictionary[$music];
					}
					
					
					// attach 2 pdfs
					
					$result[$i]['pdf-musician'] = base64_encode(generatePDF(
						$userInfo,
						[
							"jsonMusicIDs"=>  json_encode($listToPDF),
							"scriptName" =>  $result[$i]['name'],
							"musicianVersion" => true,
							"writeplaintext" => false
						],
						$musicDictionary,
						'S'
					));
					
					$result[$i]['pdf-singer'] = base64_encode(generatePDF(
						$userInfo,
						[
							"jsonMusicIDs"=>  json_encode($listToPDF),
							"scriptName" =>  $result[$i]['name'],
							"musicianVersion" => false,
							"writeplaintext" => false
						],
						$musicDictionary,
						'S'
					));
					
				}
				
			}
		} else {
			$result["error"] = "google account information error...";
		}
	} else {
		$result["error"] = "missing parameters...";
	}
	
} else
/////////////////
// music calls
/////////////////
//
// op: music-list
//
if ($data["op"] == "music-list"){
	initDB();
	$stmt = $pdo->prepare('SELECT `id`, `name` FROM `music` ORDER BY `name` ASC');
	if ($stmt->execute()) {
		while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$result[] = $row;
		}
	}
	$stmt = null;
} else
if ($data["op"] == "music-get-json-list"){
	
	if (isset($data["jsonMusicIDs"])) {
		
		$jsonMusicIDs = json_decode($data["jsonMusicIDs"],true);
		
		//
		// Optimize query list
		//
		$musicDictionary = [];
		$musicparams = [];
		$musicquery = "";
		for ($i=0;$i<count($jsonMusicIDs);$i++){
			
			$music = $jsonMusicIDs[$i];
			if (isset($musicDictionary[$music]))
				continue;
			
			$musicindex = count($musicDictionary);
			
			if ($musicindex != 0)
				$musicquery .= ",";
			$musicquery .= ":name_" . (string)$musicindex;
			$musicparams[":name_". (string)$musicindex] = $music;
			
			$musicDictionary[$music] = "";
		}
		
		//
		// DB query all music
		//
		
		$musicquery = "SELECT `id`, `json` FROM `music` WHERE `id` in (" . $musicquery . ")";
		initDB();
		$stmt = $pdo->prepare($musicquery);
		if ($stmt->execute($musicparams)) {
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
				$musicDictionary[$row['id']] = json_decode($row['json'],true);
			}
		}
		$stmt = null;
		
		//
		// Mount Result
		//
		
		for ($i=0;$i<count($jsonMusicIDs);$i++){
			if (array_key_exists($jsonMusicIDs[$i],$musicDictionary))
				$result []= $musicDictionary[ $jsonMusicIDs[$i] ];
		}
		
	} else {
		$result["error"] = "missing parameters...";
	}
	
} else
//
// op: music-record-by-id
//
if ($data["op"] == "music-record-by-id"){
	if ( isset($data["name"]) && 
		 isset($data["raw"]) && 
		 isset($data["json"]) &&
		 
		 isset($data["token"]) // google api auth token
		 ) {
			
		$userInfo = GetGoogleUserInfo($data["token"]);
		
		if ($userInfo != null && canEmailWrite($userInfo["email"])) {
			
			$params = [
				
				':name'=>$data["name"],
				':raw'=>$data["raw"],
				':json'=>$data["json"],
				
				":userName"=>$userInfo["name"],
				":userEmail"=>$userInfo["email"]
				
			];
			if (!isset($data["id"]) || $data["id"] == null) {
				//$result["msg"] = "not using id...";
				initDB();
				$stmt = $pdo->prepare("INSERT INTO `music` (`name`, `last-modify`, `raw`, `json`, `userEmail`, `userName` ) VALUES (:name, CURRENT_TIMESTAMP, :raw, :json, :userEmail, :userName )");
				$result["success"] = $stmt->execute($params);
				if ($result["success"]) {
					// get inserted ID
					$result["id"] = (string)$pdo->lastInsertId();
				}
			} else {
				//$result["msg"] = "using id...";
				$params [':id'] = $data["id"];
				initDB();
				$stmt = $pdo->prepare("UPDATE `music` SET `name`=:name, `last-modify`=CURRENT_TIMESTAMP, `raw`=:raw, `json`=:json, `userEmail`=:userEmail, `userName`=:userName WHERE `music`.`id` = :id");
				$result["success"] = $stmt->execute($params);
				$result["id"] = $data["id"];
			}
			
			$stmt = null;
		} else {
			$result["error"] = "unauthorized";
		}
	} else {
		$result["error"] = "missing parameters...";
	}
}else
//
// op: music-get-by-id
//
if ($data["op"] == "music-get-by-id"){
	initDB();
	$stmt = $pdo->prepare('SELECT `id`, `name`, `last-modify`, `raw`, `json` FROM `music` WHERE `id`=:id LIMIT 1');
	if ($stmt->execute( [':id'=>$data['id']] )) {
		if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$result = $row;
		}
	}
	$stmt = null;
	if (count($result) == 0)
		$result["error"] = "music not found";
}else
//
// op: music-get-json-by-id
//
if ($data["op"] == "music-get-json-by-id"){
	initDB();
	$stmt = $pdo->prepare('SELECT `json` FROM `music` WHERE `id`=:id LIMIT 1');
	if ($stmt->execute([':id'=>$data['id']])) {
		if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$result = $row['json'];
			header("Content-Type: application/json");
			echo($result);
			$stmt = null;
			$pdo = null;
			return;
		}
	}
	$stmt = null;
	if (count($result) == 0)
		$result["error"] = "music not found";
}else {
	$result["error"] = "invalid op";
}

$pdo = null;
header("Content-Type: application/json");
echo(json_encode($result));
?>