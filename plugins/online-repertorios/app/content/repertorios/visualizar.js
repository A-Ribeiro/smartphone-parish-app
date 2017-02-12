

function htmlEncode( html ) {
	return document.createElement( 'a' ).appendChild( 
		document.createTextNode( html ) ).parentNode.innerHTML;
}

function htmlDecode( html ) {
	var a = document.createElement( 'a' ); a.innerHTML = html;
	return a.textContent;
}

// "test".fontwidth("16px PTSerif")

String.prototype.fontwidth = function (fontSize) {
	var el, f = "16px PTSerif";
	if (fontSize != null)
		f = fontSize;
	el = document.createElement('div');
	el.style.position = 'absolute';
	el.style.float = "left";
	el.style.whiteSpace = 'nowrap';
	el.style.visibility = 'hidden';
	el.style.font = f;
	el.innerHTML = this;
	el = document.body.appendChild(el);
	w = el.offsetWidth;
	el.parentNode.removeChild(el);
	return w;
}

function processchord(str, chords_centered) {
	var out = "";
	
	// process chords centered
	if (chords_centered != null && chords_centered) {
		var aux = "";
		for(var i=0;i<str.length;i++){
			if (str[i] == '[')
				aux = "";
			else if (str[i] == ']')
			{
				var width = aux.fontwidth();
				//console.log(aux + " -> " + width + "px");
				width = width * 0.5;
				out = out.replace(/\[/g,'<span class="chord" style="margin-left:-'+width+'px;" >') + '</span>';
				
				aux = "";
				continue;
			} else
				aux += str[i];
			out += str[i];
		}
	} else {
		out = str.replace(/\[/g,'<span class="chord">').replace(/\]/g,'</span>');
	}
	
	out = out.replace(/( )(?![^<]*>|[^<>]*<\/)/g,'<wbr>&nbsp;<wbr>');
	return out;
}

function generateSummary(script) {
	
	var text = '<div class="pagei noShow" style="text-align:center;" ><h1>Músicas</h1><p style="text-align:left;display:inline-block;">';
	
	for(var i=0;i<script['list'].length;i++){
		var music = script['list'][i];
		text += String(i + 1) + '. ' + music['title'];
		if (i < script['list'].length-1)
			text += '<br />';
	}
	
	text +='</p></div>';
	
	return text;
	
}

function renderMusic(musicjson, contentID, generatechords, clearcontent) {
	
	if (clearcontent)
		$(contentID).empty();
	
	var page = "";
	
	page += '<div class="pagei">';
	
	/*
	if (generatechords)
		page += '<div class="pagei">';
	else
		page += '<div class="pagei0">';
	*/
	
	page +='<br  class="noPrint" />';
	
	if ( musicjson["title"] != null )
		page +='<h2 style="padding-bottom:0em;margin-bottom:0em;color: #333333;font-weight: 400;padding-top:0em;margin-top:0em;">' + musicjson["title"].replace(/\\n/g,"<br />") + '</h2>';
	if ( musicjson["author"] != null )
		page +='<div style="font-style:italic;font-size:90%;" class="underline">'+musicjson["author"].replace(/\\n/g,"<br />") +'</div>';
	
	if (generatechords){
		if ( musicjson['parts'] != null )
		for (var i=0;i<musicjson['parts'].length;i++) {
			
			var complementstyle = "";
			if (i == musicjson['parts'].length-1){
				complementstyle = ' lastverse ';
			}
			
			var part = musicjson['parts'][i];
			if (part['__type']=="chorus") {
				var txt = processchord( part['txt'].replace(/\\n/g,"<br />") );
				page +='<p class="verse'+complementstyle+'" ><b>'+txt+'</b></p>';
			} else if (part['__type']=="verse") {
				var txt = processchord( part['txt'].replace(/\\n/g,"<br />") );
				page +='<p class="verse'+complementstyle+'" >'+txt+'</p>';
				//$(contentID).append('<p class="verse" >'+part['txt'].replace(/\\n/g,"<br />").replace(/\[/g,'<span class="chord">').replace(/\]/g,'</span>').replace(/( )(?![^<]*>|[^<>]*<\/)/g,'<wbr>&nbsp;<wbr>')+'</p>');
			} else if (part['__type']=="intro") {
				page +='<p class="verse noPrint" ><span class="chord"><span class="intro-normal">intro:</span> '+part['txt'].replace(/\\n/g," ")+'</span>&nbsp;</p>';
				page +='<p class="intro noShow" ><span class="intro-normal">intro:</span> '+part['txt'].replace(/\\n/g," ")+'</p>';
			}
		}
	} else {
		if ( musicjson['parts'] != null )
		for (var i=0;i<musicjson['parts'].length;i++) {
			var complementstyle = "";
			//if (i == musicjson['parts'].length-1){
				//complementstyle = ' class="lastverse" ';
			//}
			
			var part = musicjson['parts'][i];
			if (part['__type']=="chorus") {
				var str = part['txt'].replace(/\\n/g,"<br />").replace(/(\[)(.*?)(\])/gi,'').trim();
				//console.log(str);
				if (str.length>0)
					page +='<p'+complementstyle+'><b>'+str+'</b></p>';
			} else if (part['__type']=="verse") {
				var str = part['txt'].replace(/\\n/g,"<br />").replace(/(\[)(.*?)(\])/gi,'').trim();
				//console.log(str);
				if (str.length>0)
					page +='<p'+complementstyle+'>'+str+'</p>';
			}
		}
	}
	
	var FooterLinks = "";
	
	if ( musicjson["audioUrl"] != null ){
		if (FooterLinks.length > 0)
			FooterLinks += " | ";
		FooterLinks += '<a href="' + musicjson["audioUrl"] + '" target="_blank" rel="external" >Audio</a>';
	}
	
	if ( musicjson["videoUrl"] != null ){
		if (FooterLinks.length > 0)
			FooterLinks += " | ";
		FooterLinks += '<a href="' + musicjson["videoUrl"] + '" target="_blank" rel="external" >Vídeo</a>';
	}
	
	if ( musicjson["chordsUrl"] != null ){
		if (FooterLinks.length > 0)
			FooterLinks += " | ";
		FooterLinks += '<a href="' + musicjson["chordsUrl"] + '" target="_blank" rel="external" >Cífra</a>';
	}
	
	if ( musicjson["scoreUrl"] != null ){
		if (FooterLinks.length > 0)
			FooterLinks += " | ";
		FooterLinks += '<a href="' + musicjson["scoreUrl"] + '" target="_blank" rel="external" >Partitura</a>';
	}
	
	page += '</div>';
	
	page += '<p class="noPrint" >'+FooterLinks+'</p>';
	page += '<br class="noPrint" />';
	
	
	
	$(contentID).append(page);
}
