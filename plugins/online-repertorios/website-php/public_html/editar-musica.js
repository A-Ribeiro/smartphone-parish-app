var googleAuth = null;
var ready = false;

function onLoadCallback() {
	//console.log('onload google api...');

	if (typeof gapi !== 'undefined' && googleClientID != "")
	gapi.load(
		'auth2', 
		function() {
			gapi.auth2
				.init({client_id: googleClientID})
				.then(function(auth2) {
					googleAuth = gapi.auth2.getAuthInstance();
					
					googleAuth.isSignedIn.listen(
						function(signedIN) {
							setLogoutVisibility();
							if (signedIN)
								gravar();
							else
								$('#options').panel('close');
						}
					);
					
					setLogoutVisibility();
					
				});
		}
	);

}

function setLogoutVisibility(){
	if (ready && googleAuth != null) {
		if ( googleAuth.isSignedIn.get() ) {
			$('#logout_google').css('display','block');
			
			var googleUser = googleAuth.currentUser.get();
			var basicProfile = googleUser.getBasicProfile();
			
			//console.log( basicProfile.getName() );
			//console.log( basicProfile.getEmail() );
			$('#logout-email').text(basicProfile.getEmail());
		}
		else
			$('#logout_google').css('display','none');
		
		$('#options-list').listview();
		$('#options-list').listview('refresh', true);
	}
}

function logout_google() {
	if (googleAuth != null) {
		//$('#logout_google').hide();
		if ( googleAuth.isSignedIn.get() )
			googleAuth.signOut();
	}
}

// device events
function deviceBackPress() {
	window.history.back();
}

$(document).bind("mobileinit", function(){
	$.extend(  $.mobile , {
		ajaxEnabled: false
	});
});

function randomInt(min, max) {
	return parseInt(Math.floor(Math.random() * (max - min + 1)) + min);
}

function localParam() {
	var paramList = window.location.href.split("?");
	if (paramList.length == 2)
		return paramList[1];
	else
		return null;
}


function loadEnd() {
/*
	var param = localParam();
	if (param != null){
		//scroll to the param
		var element = $("li#"+param);
		if (element != null ) {
			
			$('html,body').animate({scrollTop: $(element).offset().top});
			//document.document.documentElement.scrollTop = $(element).offset().top;
			//document.body.scrollTop = $(element).offset().top;
		}
	}
	*/
}

function getParametersHash() {
	var searchString = window.location.search.substring(1),
		params = searchString.split("&"),
		hash = {};
	if (searchString == "") return {};
	for (var i = 0; i < params.length; i++) {
		var val = params[i].split("=");
		hash[unescape(decodeURIComponent(val[0]))] = unescape(decodeURIComponent(val[1])).split('+').join(' ');
	}
	return hash;
}

function htmlEncode( html ) {
    return document.createElement( 'a' ).appendChild( 
        document.createTextNode( html ) ).parentNode.innerHTML;
}

function htmlDecode( html ) {
    var a = document.createElement( 'a' ); a.innerHTML = html;
    return a.textContent;
}

function fillList(data) {
	
	$('#optgroup-20').empty();
	
	for(var i=0;i<data.length;i++) {
		if (oldRecord != null && oldRecord['id'] == data[i]['id'] )
			$('#optgroup-20').append("<option value=\""+ data[i]['id'] +"\" selected>"+htmlEncode(data[i]['name'])+"</option>");
		else
			$('#optgroup-20').append("<option value=\""+ data[i]['id'] +"\">"+htmlEncode(data[i]['name'])+"</option>");
	}
	$('#select-custom-20').selectmenu();
	$('#select-custom-20').selectmenu('refresh', true);
	
	/*
	$('#optgroup-20').empty();
	
	for(var i=0;i<data.length;i++) {
		if (oldRecord != null && oldRecord['name'] == data[i]['name'] )
			$('#optgroup-20').append("<option value=\""+data[i]['name'].replace(/"/g,'&quot;')+"\" selected>"+htmlEncode(data[i]['name'])+"</option>");
		else
			$('#optgroup-20').append("<option value=\""+data[i]['name'].replace(/"/g,'&quot;')+"\">"+htmlEncode(data[i]['name'])+"</option>");
	}
	$('#select-custom-20').selectmenu();
	$('#select-custom-20').selectmenu('refresh', true);
	*/
	
}

var oldRecord = null;
if (sessionStorage.oldRecord)
	oldRecord = JSON.parse(sessionStorage.oldRecord);

window.onbeforeunload = function(e) {
	
	
	/*
	if (String(window.location).indexOf("#") == -1) {
		
		if (sessionStorage.oldRecord)
			delete sessionStorage.oldRecord;
		if (sessionStorage.list)
			delete sessionStorage.list;
		if (sessionStorage.lastmodify)
			delete sessionStorage.lastmodify;
		
		return;
	}
	*/
	
	
	//close all dialogs and options
	//history.replaceState({}, null, "" );
	
	if (oldRecord != null) {
		oldRecord['raw'] = $('#textarea-a').val();
		sessionStorage.oldRecord = JSON.stringify(oldRecord);
	}
	
	//return true;
	
	//return 'Dialog text here.';
};

history.replaceState({}, null, "" );

$( document ).ready(function() {
	
	ready = true;
	setLogoutVisibility();
	
	
	// visao events
	$('#visao-cantor').on('pagebeforeshow',function(){
		var raw = $('#textarea-a').val().replace(/\r/g,"");
		$('#visao-cantor-content').empty();
		
		var music = createJSONFromTextArea(raw);
		
		document.title = music['title'] + ' - versão do cantor';
		
		renderMusic( music, '#visao-cantor-content', false );
	});
	$('#visao-musico').on('pagebeforeshow',function(){
		var raw = $('#textarea-a').val().replace(/\r/g,"");
		$('#visao-musico-content').empty();
		
		var music = createJSONFromTextArea(raw);
		
		document.title = music['title'] + ' - versão do músico';
		
		renderMusic( music, '#visao-musico-content', true );
	});



	if (oldRecord != null) {
		$('#options-btn').css('visibility','visible');
		if ($('#textarea-a').val().length == 0)
			$('#textarea-a').val(oldRecord['raw']).keyup();
		if (oldRecord['name'] == null)
			$('#select-custom-20').val("_c_r_i_a_r_");
	}
	
	if (sessionStorage.list) {
		
		//console.log("using session data..." );
		fillList( JSON.parse(sessionStorage.list) );
		
		
		var now = new Date();
		var lastmodify = new Date(sessionStorage.lastmodify);
		if ( now.getTime() - lastmodify.getTime() > 30*1000 ){  // 30 segundos
			//clear list cache...
			//console.log("time expired ... clearing list" );
			if (sessionStorage.list)
				delete sessionStorage.list;
		}
		
	} else
		musicList( {
			onMusicListJson:function(data, status) {
				sessionStorage.lastmodify = new Date();
				sessionStorage.list = JSON.stringify(data);
				fillList(data);
			}
		});
		/*
		$.ajax({
			async:false,
			type: "POST",
			//url: "repertorio.php",
			url: requesturl,
			//cache: false,
			data: { "data":JSON.stringify({"op":"music-list"}) },
			success: function (data,status) {
				
				
				sessionStorage.lastmodify = new Date();
				//console.log("store data in session " + sessionStorage.lastmodify);
				sessionStorage.list = JSON.stringify(data);
				
				fillList(data);
				
				//alert(JSON.stringify(data));
			},
			error: function (data,status) {
			}
		});
		*/
	
	$('#select-custom-20').change(function () {
		
		var optionSelected = $(this).find('option:selected');
		//var optTextSelected = optionSelected.text();
		var optValueSelected = optionSelected.val();
		
		//alert(optValueSelected);
		if (optValueSelected == "_c_r_i_a_r_") {
			
			oldRecord = {
				'raw':"{musica-titulo:Nova Música}\n"+
					"{musica-autor:Autor da Música}\n"+
					"\n"+
					"{refrão:\n"+
					"[F]Exemplo de re[F#m]frão\n"+
					"Com [C]cifra\n"+
					"}\n"+
					"\n"+
					"{verso:\n"+
					"[C]Exemplo de [F]ver[F#m]so\n"+
					"Com [C]cifra\n"+
					"}\n"+
					"\n"+
					"//entrada, perdão, glória, aclamação, salmo, ofertório,\n"+
					"// santo, consagração, amém, cordeiro, comunhão, final\n"+
					"// meditativo\n"+
					"//{musica-categoria:entrada, final}\n"+
					"\n"+
					"//advento, natal, comum, quaresma, semana-santa, páscoa\n"+
					"//{musica-tempo-liturgico:}\n"+
					"\n"+
					"//{musica-link-cifra:}\n"+
					"//{musica-link-partitura:}\n"+
					"//{musica-link-audio:}\n"+
					"//{musica-link-video:}\n"
			};
			sessionStorage.oldRecord = JSON.stringify(oldRecord);
			
			//$('#save-btn').css('visibility','visible');
			//$('#options-btn').css('visibility','hidden');
			$('#options-btn').css('visibility','visible');
			
			$('#textarea-a').val( oldRecord['raw'] ).keyup();
		} else {
			
			
			musicGetByID({
				id: optValueSelected , 
				onMusicJson: function(data, status) {
					//console.log("Reached...");
					oldRecord = data;
					sessionStorage.oldRecord = JSON.stringify(oldRecord);
					$('#textarea-a').val(data['raw']).keyup();
				}
			});
			
			/*
			musicGet({
				name: optValueSelected , 
				onMusicJson: function(data, status) {
					console.log("Reached...");
					oldRecord = data;
					sessionStorage.oldRecord = JSON.stringify(oldRecord);
					$('#textarea-a').val(data['raw']).keyup();
				}
			});
			*/
			/*
			$.ajax({
				async:false,
				type: "POST",
				//url: "repertorio.php",
				url: requesturl,
				//cache: false,
				data: { "data":JSON.stringify({"op":"music-get","name":optValueSelected}) },
				success: function (data,status) {
					//console.log("get: "+JSON.stringify(data));
					
					oldRecord = data;
					sessionStorage.oldRecord = JSON.stringify(oldRecord);
					
					$('#textarea-a').val(data['raw']).keyup();
					
					//alert(JSON.stringify(data));
				},
				error: function (data,status) {
				}
			});
			*/
			
			//$('#save-btn').css('visibility','hidden');
			$('#options-btn').css('visibility','visible');
		}
		
		
	});
	
	
	//toggleFullScreen(document.body);
});

function toggleFullScreen(elem) {
    // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || 
		(document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || 
		(document.mozFullScreen !== undefined && !document.mozFullScreen) || 
		(document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        if (elem.requestFullScreen) {
            elem.requestFullScreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
		/*
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
		*/
    }
}

var index;

function processContent(startPattern, endPattern, lines) //ref int index
{
	var line = lines[index];
	if (!line.startsWith(startPattern))
	{
		//console.log(" erro processando entrada: " + startPattern);
		return "[[ERROR!!!]]";
	}
	line = line.substring(startPattern.length);
	var result = "";
	while (!line.endsWith(endPattern) && index < lines.length)
	{
		if (result.length > 0)
			result += "\\n";
		result += line;
		index++;
		line = lines[index];
	}
	if (result.length > 0)
		result += "\\n";
	result += line;
	if (result.endsWith(endPattern))
		result = result.substring(0, result.length - endPattern.length);
	else
	{
		//console.log(" erro processando entrada: " + startPattern);
		return "[[ERROR!!!]]";
	}
	
	result = result.trim();
	
	while (result.endsWith('\\n'))
		result = result.substring(0,result.length-2);
	while (result.startsWith('\\n'))
		result = result.substring(2,result.length);
	
	
	return result;
}

function createJSONFromTextArea(raw) {
	
	var lines = raw.split("\n");
	var json={
		'title':'',
		'author':'',
		'parts':[],
		'celebrationCategory':[],
		'liturgyCategory':[],
		'chordsUrl':null,
		'scoreUrl':null,
		'audioUrl':null,
		'videoUrl':null
	};
	
	for (index = 0; index < lines.length; index++)
		lines[index] = lines[index].trim();
	
	for (index = 0; index < lines.length; index++)
	{
		var line = lines[index];
		if (line.startsWith("//"))
			continue;
		if (line.startsWith("{musica-titulo:"))
			json['title'] = processContent("{musica-titulo:", "}", lines).trim();
		else if (line.startsWith("{musica-autor:"))
			json['author'] = processContent("{musica-autor:", "}", lines).trim();
		else if (line.startsWith("{intro:"))
			json['parts'].push( { 
				'__type':'intro',
				'txt':processContent("{intro:", "}", lines).trim()
			} );
		else if (line.startsWith("{refrão:"))
			json['parts'].push( { 
				'__type':'chorus',
				'txt':processContent("{refrão:", "}", lines).trim() 
			} );
		else if (line.startsWith("{verso:"))
			json['parts'].push( { 
				'__type':'verse',
				'txt':processContent("{verso:", "}", lines).trim()
			} );
		else if (line.startsWith("{musica-categoria:"))
		{
			var aux = processContent("{musica-categoria:", "}", lines).split(",");
			for(var idx =0; idx < aux.length; idx++)
			{
				var s = aux[idx].trim();
				if (s.length > 0)
					json['celebrationCategory'].push(s);
			}
		}
		else if (line.startsWith("{musica-tempo-liturgico:"))
		{
			var aux = processContent("{musica-tempo-liturgico:", "}", lines).split(",");
			for(var idx =0; idx < aux.length; idx++)
			{
				var s = aux[idx].trim();
				if (s.length > 0)
					json['liturgyCategory'].push(s);
			}
		}
		else if (line.startsWith("{musica-link-cifra:"))
			json['chordsUrl'] = processContent("{musica-link-cifra:", "}", lines).trim();
		else if (line.startsWith("{musica-link-partitura:"))
			json['scoreUrl'] = processContent("{musica-link-partitura:", "}", lines).trim();
		else if (line.startsWith("{musica-link-audio:"))
			json['audioUrl'] = processContent("{musica-link-audio:", "}", lines).trim();
		else if (line.startsWith("{musica-link-video:"))
			json['videoUrl'] = processContent("{musica-link-video:", "}", lines).trim();
		else if (line.length > 0)
		{
			//console.log("Erro! Formato invalido...");
		}
	}
	
	return json;
}

function gravar_refresh() {
	//if (sessionStorage.list) delete sessionStorage.list; window.location.reload();
	console.log('gravar_refresh...');
	musicList( {
		onMusicListJson:function(data, status) {
			sessionStorage.lastmodify = new Date();
			sessionStorage.list = JSON.stringify(data);
			fillList(data);
		}
	});
	
	$("#popupDialogReload").popup('close');
	$('#options').panel('close');
}

function gravarRequest(idtoken) {
	var raw = $('#textarea-a').val().replace(/\r/g,"");
	json = createJSONFromTextArea(raw);
	
	var id = null;
	if (oldRecord != null && oldRecord['id'] != null)
		id = oldRecord['id'];
	
	//console.log(JSON.stringify(oldRecord));
	
	musicRecordByID({
		
		//userName:basicProfile.getName(),
		//userEmail:basicProfile.getEmail(),
		
		token: idtoken,
		
		id: id,
		name: json['title'], 
		raw: raw,
		json: JSON.stringify(json),
		onSuccess: function(data) {

			oldRecord['id'] = data['id'];
			oldRecord['name'] = data['name'];
			oldRecord['raw'] = data['raw'];
			oldRecord['json'] = data['json'];
			
			sessionStorage.oldRecord = JSON.stringify(oldRecord);
			
			$("#popupDialogReload").popup('open');
		}, 
		onFail: function(data) {
			//console.log(JSON.stringify(data));
			if ( data['error'] != null && data['error'] == 'unauthorized')
				$("#error-authorization").popup('open');
			else
				$("#popupDialog").popup('open');
		}
	});
}

function gravar() {
	console.log("gravar...");
	if ( googleClientID == "" ) {
		gravarRequest("no-google-login");
		return;
	}
	
	if (googleAuth == null)
		return;
	
	if ( googleAuth.isSignedIn.get() ) {
		
		var googleUser = googleAuth.currentUser.get();
		//var basicProfile = googleUser.getBasicProfile();
			
		gravarRequest(googleUser.getAuthResponse().id_token);
		
	} else {
		googleAuth.signIn( { prompt:'select_account' } );
	}
}


function handlePlatformFile(files) {
	var file = files[0];
	var reader = new FileReader();
	// Handle errors load
	reader.onload = function(event){
		
		var data = event.target.result;
		
		$('#textarea-a').val( data.replace(/\r/g,'') ).keyup();
		
		//$('#options').panel('close');
		
		$("#upfile-platform").val('');
		
		//window.location.reload();
	};
	// Read file into memory as UTF-8
	reader.readAsText(file);
}

function handleCifraClubFile (files) {
	var file = files[0];
	var reader = new FileReader();
	// Handle errors load
	reader.onload = function(event){
		//$('#textarea-a').val( "" ).keyup();
		
		var data = event.target.result;
		lines = data.replace(/\r/g,'').split('\n');
		
		var text = "";
		var verse = "";
		var chords = false;
		var refraomark = false;
		var latestrefrao = "";
		
		for (var i=0;i<lines.length;i++) {
			if (lines[i].toLowerCase().indexOf('acordes') != -1) {
				//console.log("end reading...");
				break;
			}
			
			if (i == 0){
				var author_title = [ lines[i].substring(0,lines[i].indexOf('-')), lines[i].substring(lines[i].indexOf('-')+1,lines[i].length) ];
				if (author_title.length >=2)
					text += "{musica-titulo:"+author_title[1].trim()+"}\n\n";
				else
					text += "{musica-titulo:digitar título}\n\n";
				if (author_title.length >=1)
					text += "{musica-autor:"+author_title[0].trim()+"}\n\n";
				else
					text += "//{musica-autor:}\n\n";
				continue;
			}
			
			if (lines[i].trim().length == 0){
				if (verse.length > 0){
					if (refraomark) {
						latestrefrao = '{refrão:\n'+verse+'\n}\n\n';
						text += '{refrão:\n'+verse+'\n}\n\n';
					}
					else
						text += '{verso:\n'+verse+'\n}\n\n';
				}
				verse = "";
				chords = true;
				refraomark = false;
				continue;
			}
			
			//check intro position...
			if (i == 2){
				var aux = lines[i].toLowerCase();
				if ( aux.indexOf("intr") != -1 ) {
					aux = lines[i].split("intr");
					if (aux.length > 1) {
						aux = aux[1].replace('.',' ');
						lines[i] = lines[i].split("intr")[0];
						while (!lines[i].endsWith(' ') && lines[i].length > 0){
							lines[i] = lines[i].substring(0,lines[i].length-1);
						}
					}
					else if (aux.length == 1)
						aux = aux[0].replace('.',' ');
					aux = String(aux);
					if (aux.length > 0){ 
						aux = aux.substring(aux.indexOf(' '));
						text += '{intro:'+aux.trim()+'}\n\n';
					}
				}
				
				
				
			}
			
			if (chords) {
			
				if (lines[i+1].trim().length == 0){
					//isolated line
					//console.log("isolated: "+lines[i]);
					
					if ( lines[i].toLowerCase().indexOf('refrão') != -1 && latestrefrao.length > 0 && i > 2 )
						text += latestrefrao;
					
					i++;
					continue;
				}
				
				if (lines[i].toLowerCase().indexOf("refrão") != -1) {
					//console.log("... mark refrao...");
					refraomark = true;
					continue;
				}
				
				var chordtxt = lines[i];
				var versetxt = lines[i+1];
				i++;
				//console.log("verse: "+versetxt);
				
				while (chordtxt.length<versetxt.length)
					chordtxt += ' ';
				while (versetxt.length<chordtxt.length)
					versetxt += ' ';
				
				var output = "";
				var j=0;
				var k=0;
				while ( j < versetxt.length ){
					if ( k == j && chordtxt[k] != ' ' ){
						output += '[';
						while ( k < versetxt.length && chordtxt[k] != ' ' ) {
							output += chordtxt[k];
							k++;
						}
						output += ']';
					}
					output += versetxt[j];
					j++;
					if (k<j)
						k = j;
				}
				if (output.startsWith(' '))
					output = '<wbr>'+output;
				if (verse.length > 0)
					verse += '\n';
				verse += output.trim();
			}
			
		}
		
		if (verse.length > 0){
			if (refraomark)
				text += '{refrão:\n'+verse+'\n}\n\n';
			else
				text += '{verso:\n'+verse+'\n}\n\n';
		}
		
		text += '//entrada, perdão, glória, aclamação, salmo, ofertório,\n';
		text += '// santo, consagração, amém, cordeiro, comunhão, final\n';
		text += '// meditativo\n';
		text += '//{musica-categoria:entrada, final}\n\n';

		text += '//advento, natal, comum, quaresma, semana-santa, páscoa\n';
		text += '//{musica-tempo-liturgico:}\n\n';
		
		text += '//{musica-link-cifra:}\n';
		text += '//{musica-link-partitura:}\n';
		text += '//{musica-link-audio:}\n';
		text += '//{musica-link-video:}\n\n';
		
		$('#textarea-a').val( text ).keyup();
		//$('#options').panel('close');
		
		$("#upfile").val('');
		
		//window.location.reload();
	};
	// Read file into memory as UTF-8
	reader.readAsText(file);
}


// example: 
//   localDownload('repertorio.json','json content','application/json','utf-8')
function localDownload(filename,text,_type,charset){
	// Set up the link
	var link = document.createElement("a");
	link.setAttribute("target","_blank");
	if(Blob !== undefined) {
		var blob = new Blob([text], {encoding: charset,
									type: _type + ";charset=" + charset });
		link.setAttribute("href", URL.createObjectURL(blob));
	} else {
		link.setAttribute("href","data:"+_type+",charset="+charset+"," + encodeURIComponent(text));
	}
	link.setAttribute("download",filename);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

Date.prototype.yyyymmddhhmmss = function() {
	var yyyy = this.getFullYear();
	var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
	var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
	var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
	var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
	var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
	return "".concat(yyyy).concat('-').concat(mm).concat('-').concat(dd).concat('_').concat(hh).concat('h').concat(min).concat('m').concat(ss).concat('s');
};

function downloadTXT() {
	
	$data = $('#textarea-a').val( ).replace(/\r/g,'').replace(/\n/g,'\r\n');
	
	localDownload('download.txt', $data ,'text/plain','utf-8');
	
	//var date = new Date();
	//localDownload('download_'+date.yyyymmddhhmmss()+'.txt', $('#textarea-a').val( ),'text/plain','utf-8');
}

