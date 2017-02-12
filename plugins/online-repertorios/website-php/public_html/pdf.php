<?php

require_once 'db.php';
require_once 'google.php';

function UTF_parse($str){
	return $str;
	//return utf8_encode($str);
}


function generatePDF($userInfo, $data, $musicDictionary=null, $dest=null){
	global $pdo;
	
	initDB();
	
	if ($userInfo != null) {
	
		$jsonMusicIDs = json_decode($data["jsonMusicIDs"],true);
		
		if (!isset($musicDictionary)) {
			
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

			$stmt = $pdo->prepare($musicquery);
			if ($stmt->execute($musicparams)) {
				while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
					$musicDictionary[$row['id']] = json_decode($row['json'],true);
				}
			}
			$stmt = null;
			
		}


		$content = 
		"<style>
			.pdfverse {
				margin-left:0.0mm;
				margin-right:8mm;
				margin-bottom:0.8mm;
				margin-top:1.0mm;
				line-height:9mm;
				padding-top:4.0mm;
			}
			
			.pdfverse-cantor {
				margin-left:0.0mm;
				margin-right:8mm;
				margin-bottom:0.8mm;
				margin-top:1.0mm;
				padding-top:4.0mm;
				line-height:5.0mm;
			}
			
			.lastverse-cantor {
				margin-left:0.0mm;
				margin-right:8mm;
				margin-bottom:0.8mm;
				margin-top:1.0mm;
				padding-top:4.0mm;
				line-height:5.0mm;
			}
			
			.lastverse {
				margin-left:0.0mm;
				margin-right:8mm;
				margin-bottom:0.8mm;
				margin-top:1.0mm;
				line-height:9mm;
				padding-top:4.0mm;
			}
			.pdfchord {
				position:pushrelative;
				margin-top:-3.5mm;
				color:#0000ff;
				font-weight:bold;
				font-size:88%;
			}
			.pdfintro {
				color:#0000ff;
				font-weight:bold;
				margin:0;
				padding:0;
				font-size:88%;
			}
			.pdfintro-normal {
				color:#000000;
				font-weight:normal;
			}
		</style>
		<page backtop='110mm' backbottom='20mm' backleft='15mm' backright='15mm' footer='page' >
			<div style='text-align:right;'>
				<h1 style='margin:0;'>".$data['scriptName']."</h1><br>
				".(($data["musicianVersion"])?(UTF_parse("versão do músico")):(UTF_parse("versão do cantor")))."
			</div>
		</page>
		<page backtop='20mm' backbottom='20mm' backleft='15mm' backright='15mm' footer='page' ></page>
		";




		//
		// Mount Result
		//
		$anypage_written = false;

		for ($i=0;$i<count($jsonMusicIDs);$i++){
			if (array_key_exists($jsonMusicIDs[$i],$musicDictionary)) {
				$music = $musicDictionary[ $jsonMusicIDs[$i] ];
				
				$title = "".strval($i+1).". ".$music['title'];
				$title = str_replace('\'','&#39;' , $title);
				
				$anypage_written = true;
				
				$page = 
				"<page backtop='20mm' backbottom='20mm' backleft='15mm' backright='15mm' footer='page' >
				<bookmark title='".$title."' level='0' ></bookmark><h2>".$title."</h2>
				<i>".$music['author']."</i><br><br>";
				
				
				for($j=0;$j<count($music['parts']);$j++){
					
					$verseclass;
					if ($data["musicianVersion"]) {
						$verseclass = 'pdfverse';
						if ($j == count($music['parts'])-1 )
							$verseclass = 'lastverse';
					} else {
						$verseclass = 'pdfverse-cantor';
						if ($j == count($music['parts'])-1 )
							$verseclass = 'lastverse-cantor';
					}
					
					
					$part = $music['parts'][$j];
					if ( $part['__type'] == 'intro' && $data["musicianVersion"] )
						$page .= "<span class='pdfintro'><span class='pdfintro-normal'>Intro:</span>".str_replace("\\n"," ",$part['txt'])."</span><br><br>";
					else if ( $part['__type'] == 'verse' ) {
						$processedcontent = str_replace("\\n","<br>",$part['txt']);
						
						if ($data["musicianVersion"]) {
							//$processedcontent = str_replace("[","<span class='pdfchord'>",$processedcontent);
							//$processedcontent = str_replace("]","</span>",$processedcontent);
							$processedcontent = str_replace("<wbr>","",$processedcontent);
							$processedcontent = preg_replace_callback('/( )(?![^<]*>|[^<>]*<\/)/', function ($match) {
								return '&nbsp;';
							}, $processedcontent);
							$page .= "<nobreak><cifra class='".$verseclass."' >".$processedcontent."</cifra></nobreak>";
						} else {
							$processedcontent = str_replace("<wbr>","",$processedcontent);
							$processedcontent = preg_replace_callback('/(\[)(.*?)(\])/', function ($match) {
								return '';
							}, $processedcontent);
							$processedcontent = preg_replace('/\s\s+/', ' ', $processedcontent);
							$processedcontent = trim($processedcontent);
							$page .= "<nobreak><p class='".$verseclass."' >".$processedcontent."</p></nobreak>";
						}
						
					} else if ( $part['__type'] == 'chorus' ) {
						$processedcontent = str_replace("\\n","<br>",$part['txt']);
						if ($data["musicianVersion"]) {
							//$processedcontent = str_replace("[","<span class='pdfchord'>",$processedcontent);
							//$processedcontent = str_replace("]","</span>",$processedcontent);
							$processedcontent = str_replace("<wbr>","",$processedcontent);
							$processedcontent = preg_replace_callback('/( )(?![^<]*>|[^<>]*<\/)/', function ($match) {
								return '&nbsp;';
							}, $processedcontent);
							$page .= "<nobreak><cifra class='".$verseclass."' ><b>".$processedcontent."</b></cifra></nobreak>";
						} else {
							$processedcontent = str_replace("<wbr>","",$processedcontent);
							$processedcontent = preg_replace_callback('/(\[)(.*?)(\])/', function ($match) {
								return '';
							}, $processedcontent);
							$processedcontent = preg_replace('/\s\s+/', ' ', $processedcontent);
							$processedcontent = trim($processedcontent);
							$page .= "<nobreak><p class='".$verseclass."' ><b>".$processedcontent."</b></p></nobreak>";
						}
						
					}
				}
				
				$page .= "</page>\n";
				
				$content .= $page;
			}
		}
		
		if (isset($data["writeplaintext"]) && $data["writeplaintext"]) {
			header('Content-Type:text/plain;charset=utf-8;');
			echo($content);
		}
		else
		if ($anypage_written) {
			require_once(dirname(__FILE__).'/html2pdf/vendor/autoload.php');
			$html2pdf = new HTML2PDF('P','A4','pt');
			$html2pdf->WriteHTML($content);
			$html2pdf->createIndex(UTF_parse('Músicas'), 25, 12, false, true, 2);
			
			$html2pdf->pdf->SetAuthor( $userInfo['name'] );
			$html2pdf->pdf->SetSubject( $data['scriptName'] );
			
			if (!isset($dest))
				$dest='I';
			
			if ($data["musicianVersion"]) {
				$html2pdf->pdf->SetTitle($data['scriptName'].' - versão do músico');
				$html2pdf->pdf->SetKeywords('script roteiro letra música cifra');
				return $html2pdf->Output('repertorio-musico.pdf',$dest);
			}
			else {
				$html2pdf->pdf->SetTitle($data['scriptName'].' - versão do cantor');
				$html2pdf->pdf->SetKeywords('script roteiro letra música');
				return $html2pdf->Output('repertorio-cantor.pdf',$dest);
			}
		} else {
			echo(UTF_parse('Erro no processamento do PDF. Nenhuma página de música encontrada.'));
		}
		
		
	} else {
		echo(UTF_parse('invalid userInfo["name"] ...'));
	}
	
}

?>
