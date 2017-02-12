<?php

	$content = 
"
<style>
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
		<page backtop='20mm' backbottom='20mm' backleft='15mm' backright='15mm' footer='page' >
				<bookmark title='1. Salmo 22 (Pelos Prados - C)' level='0' ></bookmark><h2>1. Salmo 22 (Pelos Prados - C)</h2>
				<i>Católicas</i><br><br><span class='pdfintro'><span class='pdfintro-normal'>Intro:</span>C</span><br><br>
				<nobreak>
				<cifra class='pdfverse' >Pelos&nbsp;p[C]rados&nbsp;e&nbsp;cam[Am]pinas&nbsp;verde[F]jan[Fm]tes&nbsp;eu&nbsp;v[C]ou&nbsp;é&nbsp;o&nbsp;Sen[Em]hor&nbsp;que&nbsp;me<br>[F]Leva&nbsp;a&nbsp;descans[G]ar&nbsp;&nbsp;junto&nbsp;às&nbsp;[C]fontes&nbsp;de&nbsp;águas[Am]&nbsp;puras&nbsp;repo[F]us[Fm]antes<br>Eu&nbsp;v[C]ou&nbsp;minhas&nbsp;f[Em]orças&nbsp;o&nbsp;Senh[F]or&nbsp;vai&nbsp;ani[G]mar</cifra>
				<p class='pdfverse' >Pelos&nbsp;p[C]rados&nbsp;e&nbsp;cam[Am]pinas&nbsp;verde[F]jan[Fm]tes&nbsp;eu&nbsp;v[C]ou&nbsp;é&nbsp;o&nbsp;Sen[Em]hor&nbsp;que&nbsp;me<br>[F]Leva&nbsp;a&nbsp;descans[G]ar&nbsp;&nbsp;junto&nbsp;às&nbsp;[C]fontes&nbsp;de&nbsp;águas[Am]&nbsp;puras&nbsp;repo[F]us[Fm]antes<br>Eu&nbsp;v[C]ou&nbsp;minhas&nbsp;f[Em]orças&nbsp;o&nbsp;Senh[F]or&nbsp;vai&nbsp;ani[G]mar</p>
				</nobreak>
				</page>
				
		<page backtop='110mm' backbottom='20mm' backleft='15mm' backright='15mm' footer='page' >
			<div style='text-align:right;'>
				<h1 style='margin:0;'>Festa de São Sebastião 1</h1><br>
				versão do músico
			</div>
		</page>
		<page backtop='20mm' backbottom='20mm' backleft='15mm' backright='15mm' footer='page' ></page>
		

		
";

	$content = utf8_encode($content);
	require_once(dirname(__FILE__).'/html2pdf/vendor/autoload.php');
	$html2pdf = new HTML2PDF('P','A4','pt');
	$html2pdf->WriteHTML($content);
	$html2pdf->createIndex(utf8_encode('Músicas'), 25, 12, false, true, 2);
	$html2pdf->Output('C:\Users\Alessandro\Desktop\SaoSebastiao\ConteudoDoApp\website\output.pdf','F');
	
	
?>
