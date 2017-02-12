//
// Static init...
//

var googleAuth = null;
var ready = false;
var lastop = '';

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
							if (signedIN) {
								if ( lastop == 'gravar' )
									gravar();
							}
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
	}
}

function logout_google() {
	if (googleAuth != null) {
		//$('#logout_google').hide();
		if ( googleAuth.isSignedIn.get() )
			googleAuth.signOut();
	}
}

history.replaceState({}, null, "" );

var scriptindex = 0;
var musics = [];
var musicToShow=null;
var musicCustomTitle="";

var selectedScript = {
	'name':'',
	'list':[]
};

if (sessionStorage.selectedScript)
	selectedScript = JSON.parse(sessionStorage.selectedScript);

if (localStorage.musico == null)
	localStorage.musico = 'on';

//
// Functions...
//

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

function loadEnd() {
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

function HTML_FillScriptList(data) {
	$('#repertorio-list').empty();
	$('#repertorio-list').append( '<option>Repertório</option>' );
	$('#repertorio-list').append( '<option value="novo" >Novo</option>' );
	
	var html = '<optgroup label="Repertórios Cadastrados">';
	
	//console.log(sessionStorage.oldScriptID);
	for(var i=0;i<data.length;i++) {
		//console.log(data[i]['id']);
		if (sessionStorage.oldScriptID != null && sessionStorage.oldScriptID == data[i]['id'] )
			html += "<option value=\""+data[i]['id']+"\" selected>"+htmlEncode(data[i]['name'])+"</option>";
		else
			html += "<option value=\""+data[i]['id']+"\">"+htmlEncode(data[i]['name'])+"</option>";
	}
	html += '</optgroup>';
	
	$('#repertorio-list').append( html );
	
	$('#repertorio-list').selectmenu();
	$('#repertorio-list').selectmenu('refresh', true);
}

window.onbeforeunload = function(e) {
	
	//close all dialogs and options
	//history.replaceState({}, null, "" );
	/*
	if (oldRecord != null) {
		oldRecord['raw'] = $('#textarea-a').val();
		sessionStorage.oldRecord = JSON.stringify(oldRecord);
	}
	*/
	
	/*
	if (String(window.location).indexOf("#") == -1) {
		
		if (sessionStorage.selectedScript)
			delete sessionStorage.selectedScript;
		//if (localStorage.musico)
			//delete localStorage.musico;
		if (sessionStorage.oldScriptID)
			delete sessionStorage.oldScriptID;
		if (sessionStorage.scriptlistcache)
			delete sessionStorage.scriptlistcache;
		
		return;
	}
	*/
	
	if (selectedScript == null)
		selectedScript = {};
	
	selectedScript['name'] = $("#repertorio-name").val().trim();
	selectedScript['list'] = [];
	for(var i=0;i<musics.length;i++)
		selectedScript['list'].push( musics[i]['music'] );
	
	sessionStorage.selectedScript = JSON.stringify( selectedScript );
	
	//return true;
	
	//return 'Dialog text here.';
};

function btn_novo() {
	
	if ($('#repertorio-list').val() != 'novo')
		$('#repertorio-list').val("novo");
	//else
		//$('#repertorio-list').val('');
	$('#repertorio-list').selectmenu('refresh', true);
	
	
	
	$('#repertorio-name').val('');
	
	$('#repertorio-content').empty();
	$('#repertorio-content').append('<li data-role="list-divider">Sequência</li>');
	$('#repertorio-content').listview();
	$('#repertorio-content').listview('refresh', true);
	
	$('#options').panel('close');
	
	if ( sessionStorage.selectedScript )
		delete sessionStorage.selectedScript;
	
	if ( sessionStorage.oldScriptID )
		delete sessionStorage.oldScriptID;
	
	scriptindex = 0;
	musics = [];
	selectedScript = null;
	
}

function gravar_refresh() {
	
	//window.location.reload();
	//console.log('gravar_refresh...');
	
	scriptList({
		onScriptListJson:function(data, status) {
			sessionStorage.scriptlistcache = JSON.stringify(data);
			HTML_FillScriptList(data);
		}
	});
	
	$("#popupDialogReload").popup('close');
	$('#options').panel('close');
}

function gravarRequest(idtoken) {
	if ( selectedScript != null ) {
		
		selectedScript['name'] = $("#repertorio-name").val().trim();
		
		sessionStorage.selectedScript = JSON.stringify(selectedScript);
		
		scriptRecordByID({
			
			//userName:basicProfile.getName(),
			//userEmail:basicProfile.getEmail(),
			
			token: idtoken,
			
			id: sessionStorage.oldScriptID,
			name: selectedScript['name'],
			json: sessionStorage.selectedScript,
			onSuccess: function(data) {
				
				sessionStorage.oldScriptID = data['id'];
				sessionStorage.selectedScript = data['json'];
				selectedScript = JSON.parse(data['json']);
				
				$("#popupDialogReload").popup('open');
			}, 
			onFail: function(data) {
				if ( data['error'] != null && data['error'] == 'unauthorized')
					$("#error-authorization").popup('open');
				else
					$("#popupDialog").popup('open');
			}
		});
	} else {
		$("#popupDialog").popup('open');
	}
}

function gravar() {
	
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
		lastop = 'gravar';
		googleAuth.signIn( { prompt:'select_account' } );
	}
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

function repertorioDownloadRequest(idtoken) {
	
	var data = JSON.parse( sessionStorage.scriptlistcache );
	var ids = [];
	for(var i=0;i<data.length;i++) {
		var checked = $('#r_'+i).prop("checked");
		if (checked)
			ids.push(data[i]['id']);
	}
	
	//var jsonNames = JSON.stringify(names);
	//console.log( jsonNames );
	
	scriptExportJson({
		jsonScriptIDs:JSON.stringify(ids),
		token: idtoken,
		async:false,
		onScriptListJson: function(data,status){
			//console.log(JSON.stringify(data));
			
			var date = new Date();
			localDownload('lista_repertorios.json',JSON.stringify(data),'application/json','utf-8');
			//localDownload('lista_repertorios_'+date.yyyymmddhhmmss()+'.json',JSON.stringify(data),'application/json','utf-8');
			window.history.back();
			
		}
	});
	
}
  
function repertorioDownload() {
	
	if (selectedScript == null)
		return;
	
	if ( googleClientID == "" ) {
		
		repertorioDownloadRequest("no-google-login");
		
		return;
	}
	
	if (googleAuth == null)
		return;
	
	if ( googleAuth.isSignedIn.get() ) {
		
		var googleUser = googleAuth.currentUser.get();
		
		repertorioDownloadRequest(googleUser.getAuthResponse().id_token);
		
	
	} else {
		lastop = '';
		googleAuth.signIn( { prompt:'select_account' } );
	}
	/*
	var json = {
		'test':'test',
		'holla':'holla',
	};
	localDownload('repertorio.json',JSON.stringify(json),'application/json','utf-8');
	window.history.back();
	*/
}

function rebuildMusicNames() {
	
	for(var i=0;i<musics.length;i++) {
		$('#'+musics[i]['id']+'_a').text( String(i+1) + " " + musics[i]['music']['name']);
	}
	
	$('#repertorio-content').listview();
	$('#repertorio-content').listview('refresh', true);
	
}

function addmusic( music )
{
	$('#repertorio-content').append(
		'<li data-icon="false" id="_' + scriptindex + '" >' +
			'<a href="#" onclick="viewmusic(&quot;_' + scriptindex + '&quot;);"><h1 style="white-space:normal;padding-left:0.5em;text-indent:-0.5em;" ><small id="_'+scriptindex+'_a" >'+htmlEncode(music['name'])+'</small></h1></a>' +
			'<a href="#" onclick="removemusic(&quot;_' + scriptindex + '&quot;);">delete</a>' +
		'</li>'
	);
	
	musics.push( { 
		"id": '_' + scriptindex,
		"music": music
	} );
	
	scriptindex++;
	
	$('#repertorio-content').listview('refresh',true);
	
	if (selectedScript == null)
		selectedScript = {};
	
	selectedScript['name'] = $("#repertorio-name").val().trim();
	
	selectedScript['list'] = [];
	for(var i=0;i<musics.length;i++)
		selectedScript['list'].push( musics[i]['music'] );
	
	sessionStorage.selectedScript = JSON.stringify( selectedScript );
	
	
	rebuildMusicNames();
	
}

function viewmusic(musicid) {
	//alert('viewmusic');
	
	for(var i=0;i<musics.length;i++) {
		if (musics[i]['id'] == musicid) {
			
			musicToShow = musics[i]['music'];
			//musicToShow['visual-index'] = String(i+1) + '. ';
			musicCustomTitle = String(i+1) + '. ';// + musicToShow['name'];
			
			//console.log( $('#flipmenu').val() );
			
			if (localStorage.musico == 'on')
				$.mobile.changePage( "#visao-musico" );
			else
				$.mobile.changePage( "#visao-cantor" );
			
			break;
		}
	}
	
}

function removemusic(musicid) {
	
	//alert('removemusic');
	
	for(var i=0;i<musics.length;i++) {
		if (musics[i]['id'] == musicid) {
			musics.splice(i,1);
			break;
		}
	}
	
	selectedScript['name'] = $("#repertorio-name").val().trim();
	
	selectedScript['list'] = [];
	for(var i=0;i<musics.length;i++)
		selectedScript['list'].push( musics[i]['music'] );
	
	sessionStorage.selectedScript = JSON.stringify( selectedScript );
	
	$('#'+musicid).remove();
	
	
	rebuildMusicNames();
	
}

function HTML_fillMusicList(script) {
	
	scriptindex = 0;
	musics = [];
	
	//console.log( JSON.stringify( script ) );
	$("#repertorio-name").val( script['name'] );
	
	$('#repertorio-content').empty();
	$('#repertorio-content').append('<li data-role="list-divider">Sequência</li>');
	
	for (var i=0;i<script['list'].length;i++){
		
		$('#repertorio-content').append(
			'<li data-icon="false" id="_' + scriptindex + '" >' +
				'<a href="#" onclick="viewmusic(&quot;_' + scriptindex + '&quot;);"><h1 style="white-space:normal;padding-left:0.5em;text-indent:-0.5em;" ><small id="_'+scriptindex+'_a" >'+ String(i+1)+" " +htmlEncode(script['list'][i]['name'])+'</small></h1></a>' +
				'<a href="#" onclick="removemusic(&quot;_' + scriptindex + '&quot;);">delete</a>' +
			'</li>'
		);
		
		musics.push( { 
			"id": '_' + scriptindex,
			"music": script['list'][i]
		} );
		
		scriptindex++;
	}
	
	$('#repertorio-content').listview();
	$('#repertorio-content').listview('refresh', true);
	
	
}

function htmlEncode( html ) {
    return document.createElement( 'a' ).appendChild( 
        document.createTextNode( html ) ).parentNode.innerHTML;
}

function htmlDecode( html ) {
    var a = document.createElement( 'a' ); a.innerHTML = html;
    return a.textContent;
}

function fillMusicToAddList () {
	
	var data = JSON.parse(sessionStorage.allmusiccache);
	
	$('#select-musicas').empty();
	$('#select-musicas').append( '<option>Adicionar Música</option>' );
	for(var i=0;i<data.length;i++) {
		$('#select-musicas').append("<option value=\"" + i + "\">"+htmlEncode(data[i]['name'])+"</option>");
	}
	$('#select-musicas').selectmenu();
	$('#select-musicas').selectmenu('refresh', true);
	
}

$( document ).ready(function() {

	ready = true;
	setLogoutVisibility();

	$('#flip').val( localStorage.musico ).keyup();
	$('#flipmenu').val( localStorage.musico ).keyup();
	
	scriptList({
		onScriptListJson:function(data, status) {
			sessionStorage.scriptlistcache = JSON.stringify(data);
			HTML_FillScriptList(data);
		}
	});
	
	musicList( {
		onMusicListJson:function(data, status) {
			
			sessionStorage.allmusiccache = JSON.stringify(data);
			
			fillMusicToAddList();
		}
	});

	if (selectedScript != null){
		HTML_fillMusicList( selectedScript );
	}
	
	
	$('#repertorio-list').change(function () {
		
		var optionSelected = $(this).find('option:selected');
		var optValueSelected = optionSelected.val();
		
		if (optValueSelected == 'novo'){
			
			btn_novo();
			
		} else {
			scriptGetByID({
				id: optValueSelected ,
				onScriptJson: function(data, status) {
					
					sessionStorage.oldScriptID = data['id'];
					
					sessionStorage.selectedScript = data['json'];
					selectedScript = JSON.parse(data['json']);
					
					HTML_fillMusicList(selectedScript);
				}
			});
		}
	});
	
	
	$('#select-musicas').change(function () {
		
		var optionSelected = $(this).find('option:selected');
		var optValueSelected = parseInt(optionSelected.val());
		
		//console.log('Selected: '+optValueSelected);
		
		$('#select-musicas').val('');
		$('#select-musicas').selectmenu('refresh', true);
		
		var data = JSON.parse(sessionStorage.allmusiccache);
		var music = data[optValueSelected];
		
		addmusic(music);
		
	});
	
	
	$('#flipmenu').change(function () {
		
		var optionSelected = $(this).find('option:selected');
		var optValueSelected = optionSelected.val();
		
		localStorage.musico = optValueSelected;
		
		$('#flip').val( localStorage.musico ).keyup();
		
	});
	
	$('#flip').change(function () {
		
		var optionSelected = $(this).find('option:selected');
		var optValueSelected = optionSelected.val();
		
		localStorage.musico = optValueSelected;
		
		$('#flipmenu').val( localStorage.musico ).keyup();
		
	});
	
	
	$('#visao-cantor').on('pagebeforeshow',function(){
		
		musicGetJsonByID({
			id:musicToShow['id'],
			onMusicJson: function(data, status) {
				if (data['title'] != null){
					musicToShow['name'] = data['title'];
					rebuildMusicNames();
					data['title'] = musicCustomTitle + data['title'];
					document.title = data['title'] + ' - versão do cantor';
					renderMusic( data, '#visao-cantor-content', false, true );
				} else {
					$('#visao-cantor-content').empty();
					$('#visao-cantor-content').append('<p>A música <b>' + htmlEncode(musicToShow['name']) + '</b> não foi encontrada no banco de dados.</p><p>Ela pode ter sido renomeada.</p>');
				}
			}
		})
		
	});
	
	
	$('#visao-musico').on('pagebeforeshow',function(){
		
		musicGetJsonByID({
			id:musicToShow['id'],
			onMusicJson: function(data, status) {
				if (data['title'] != null){
					musicToShow['name'] = data['title'];
					rebuildMusicNames();
					data['title'] = musicCustomTitle + data['title'];
					document.title = data['title'] + ' - versão do músico';
					renderMusic( data, '#visao-musico-content', true, true );
				} else {
					$('#visao-musico-content').empty();
					$('#visao-musico-content').append('<p>A música <b>' + htmlEncode(musicToShow['name']) + '</b> não foi encontrada no banco de dados.</p><p>Ela pode ter sido renomeada.</p>');
				}
			}
		})
		
	});
	
	
	$('#exportar').on('pagebeforeshow',function(){
		
		
		$('#options').panel('close');
		
		var data = JSON.parse( sessionStorage.scriptlistcache );
		
		$('#repertorio-exportar-list').controlgroup("container").empty();
		for(var i=0;i<data.length;i++) {
			var id = 'r_'+i;
			$('#repertorio-exportar-list').controlgroup("container").append(
				'<input type="checkbox" name="'+id+'" id="'+id+'">' +
				'<label for="'+id+'">'+htmlEncode(data[i]['name'])+'</label>'
			);
		}
		
		//$("[data-role=controlgroup]").enhanceWithin().controlgroup("refresh");
		$('#repertorio-exportar-list').enhanceWithin().controlgroup("refresh");
		
	});
	
	
	
	$('#visao-impressao').on('pagebeforeshow',function(){
		
		$('#visao-impressao-parent').empty();
		$('#summary-impressao').empty();
		$('#visao-impressao-title').text( '' );
		document.title = '';
		
		//
		//save the current information
		//
		if (selectedScript == null)
			selectedScript = {};
		
		selectedScript['name'] = $("#repertorio-name").val().trim();
		selectedScript['list'] = [];
		for(var i=0;i<musics.length;i++)
			selectedScript['list'].push( musics[i]['music'] );
		
		sessionStorage.selectedScript = JSON.stringify( selectedScript );
		
		
		if (selectedScript == null)
			return;
		
		var musicsToQuery = [];
		
		for (var i=0;i<selectedScript['list'].length;i++)
			musicsToQuery.push( selectedScript['list'][i]['id'] );
		
		musicGetJsonList({
			jsonMusicIDs:JSON.stringify(musicsToQuery),
			async:false,
			onMusicListJson: function(data,status){
				//console.log(JSON.stringify(data));
				if (localStorage.musico == 'on') {
					document.title = selectedScript['name'] + ' - versão do músico';
					$("#visao-impressao-subtitle").text('versão do músico');
				} else {
					document.title = selectedScript['name'] + ' - versão do cantor';
					$("#visao-impressao-subtitle").text('versão do cantor');
				}
				
				$('#visao-impressao-title').text( selectedScript['name'] );
				$('#summary-impressao').append(generateSummary({'list':data}));
				
				//$('#visao-impressao-title').parent().parent().css('display','');
				
				for(var i=0;i<data.length;i++){
					
					var music = data[i];
					music['title'] = String(i + 1) + '. ' + music['title'];

					$('#visao-impressao-parent').append('<div class="ui-body ui-body-a FontPTSerif noborderprint zeromarginpaddingprint" id="m'+ String(i) +'" ></div><br class="noPrint" />');
					
					if (localStorage.musico == 'on')
						renderMusic( music, '#m'+ String(i) , true ,false );
					else
						renderMusic( music, '#m'+ String(i) , false ,false );
					
				}
				
			}
		});
	});
	
	
	$('#visao-impressao').on('pageshow',function(){
		//window.print();
	});
	
	
});

function exportarPDF_Request(musico,idtoken){
	
	$('#options').panel('close');
	
	//
	//save the current information
	//
	if (selectedScript == null)
		selectedScript = {};
	
	selectedScript['name'] = $("#repertorio-name").val().trim();
	selectedScript['list'] = [];
	for(var i=0;i<musics.length;i++)
		selectedScript['list'].push( musics[i]['music'] );
	
	sessionStorage.selectedScript = JSON.stringify( selectedScript );
	
	var musicsToQuery = [];
	for (var i=0;i<selectedScript['list'].length;i++)
		musicsToQuery.push( selectedScript['list'][i]['id'] );
	
	pdfExportRedirect({
		scriptName: selectedScript['name'],
		musicianVersion: musico, //(localStorage.musico == 'on'),
		jsonMusicIDs: JSON.stringify(musicsToQuery),
		token: idtoken
	});
	
}


function exportarPDF(musico){
	
	if (selectedScript == null)
		return;
	
	
	if ( googleClientID == "" ) {
		
		exportarPDF_Request(musico,"no-google-login");
		
		return;
	}
	
	if (googleAuth == null)
		return;
	
	if ( googleAuth.isSignedIn.get() ) {
		var googleUser = googleAuth.currentUser.get();
		
		exportarPDF_Request(musico,googleUser.getAuthResponse().id_token);
		
	} else {
		lastop = '';
		googleAuth.signIn( { prompt:'select_account' } );
	}
	
	
}
