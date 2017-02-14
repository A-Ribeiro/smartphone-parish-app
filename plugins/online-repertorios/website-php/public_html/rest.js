
var __requesturl__ = "repertorio.php";
if ( String(document.location).startsWith("file://") )
	__requesturl__ = "https://repertorio.000webhostapp.com/repertorio.php";

var __requesturlpdf__ = "pdfrender.php";
if ( String(document.location).startsWith("file://") )
	__requesturlpdf__ = "https://repertorio.000webhostapp.com/pdfrender.php";

//http://rosettacode.org/wiki/LZW_compression
//LZW Compression/Decompression for Strings
var LZW = {
    compress: function (uncompressed) {
        "use strict";
        // Build the dictionary.
        var i,
            dictionary = {},
            c,
            wc,
            w = "",
            result = [],
            dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[String.fromCharCode(i)] = i;
        }
 
        for (i = 0; i < uncompressed.length; i += 1) {
            c = uncompressed.charAt(i);
            wc = w + c;
            //Do not use dictionary[wc] because javascript arrays 
            //will return values for array['pop'], array['push'] etc
           // if (dictionary[wc]) {
            if (dictionary.hasOwnProperty(wc)) {
                w = wc;
            } else {
                result.push(dictionary[w]);
                // Add wc to the dictionary.
                dictionary[wc] = dictSize++;
                w = String(c);
            }
        }
 
        // Output the code for w.
        if (w !== "") {
            result.push(dictionary[w]);
        }
        return result;
    },
 
 
    decompress: function (compressed) {
        "use strict";
        // Build the dictionary.
        var i,
            dictionary = [],
            w,
            result,
            k,
            entry = "",
            dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary.push(String.fromCharCode(i));
        }
 
        w = String.fromCharCode(compressed[0]);
        result = w;
        for (i = 1; i < compressed.length; i += 1) {
            k = compressed[i];
            if (dictionary[k]) {
                entry = dictionary[k];
            } else {
                if (k == dictSize) {
                    entry = w + w.charAt(0);
                } else {
                    return null;
                }
            }
 
            result += entry;
 
            // Add w+entry[0] to the dictionary.
			
            dictionary.push( w + entry.charAt(0) );
			dictSize++;
 
            w = entry;
        }
		
        return result;
    }
};
/*
, // For Test Purposes
    comp = LZW.compress("TOBEORNOTTOBEORTOBEORNOT"),
    decomp = LZW.decompress(comp);
document.write(comp + '<br>' + decomp);
*/


function unescape_utf8_ascii_safe(string) {
	//return JSON.parse('"' + string.replace(/\"/g, '\\"') + '"');
	//return JSON.parse(string);
	
	string = string.replace(/\:u([0-9a-f]{4})/g, function (whole, group1) {
		return String.fromCharCode(parseInt(group1, 16));
	})
	.replace(/\: /g, ":" )
	;
	//.replace(/\\\\/g,'\\');
	
	return string;
	
}

function escape_utf8_ascii_safe(s) {
	s = s
		//.replace(/\\/g,'\\\\')
		
		.replace(/\:/g, ": " )
		.replace(/[\u007F-\uFFFF]/g, function(chr) {
			return ":u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
		})
		
		;
	
	//s = JSON.stringify(s);
	return s;
}





//base 62
var DEFAULT_CHARACTER_SET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var characterSet=[];
function setCharacterSet(chars) {
	var arrayOfChars = chars.split(""), uniqueCharacters = [];
	if(arrayOfChars.length != 62) throw Error("You must supply 62 characters");
	arrayOfChars.forEach(function(char){
		if(!~uniqueCharacters.indexOf(char)) uniqueCharacters.push(char);
	});
	if(uniqueCharacters.length != 62) throw Error("You must use unique characters.");
	characterSet = arrayOfChars;
};

function encode(integer){
	if (integer === 0) {return '0';}
	var s = '';
	while (integer > 0) {
		s = characterSet[integer % 62] + s;
		integer = Math.floor(integer/62);
	}
	return s;
};

function decode(base62String){
	var val = 0, base62Chars = base62String.split("").reverse();
	base62Chars.forEach(function(character, index){
		val += characterSet.indexOf(character) * Math.pow(62, index);
	});
	return val;
};


function CompressUTF8_to_LZW_Base62_String( str ) {
	//base 62 charset...
	if (characterSet.length == 0)
		setCharacterSet(DEFAULT_CHARACTER_SET);
	
	var int_array_lzw_json = LZW.compress(escape_utf8_ascii_safe(str));
	
	//convert to base 62
	var ints = int_array_lzw_json;
	var hexstr = "";
	for(var i=0; i < ints.length; i++) {
		if (i>0)
			hexstr += ';';
		//hexstr += ints[i].toString(36);
		hexstr += encode(ints[i]);
	}
	
	return hexstr;
}

function DecompressLZW_Base62_to_UTF8_String( str ){
	//base 62 charset...
	if (characterSet.length == 0)
		setCharacterSet(DEFAULT_CHARACTER_SET);
	
	var int_array_lzw_json = [];
	
	str = str.split(";");
	for(var i=0; i < str.length; i++) {
		int_array_lzw_json.push( decode( str[i] ) );
	}
	
	return unescape_utf8_ascii_safe(LZW.decompress(int_array_lzw_json));
}


function testServerCompression( params ){
	
	var async = false;
	if (params.async != null)
		async = params.async;
	
	if (params.json == null)
		params.json = '[{"name":"Rep 1","list":[{"title":"Chuva de Graça (B)","author":"Eliana Ribeiro","parts":[{"__type":"intro","txt":"B  F#/A  G#m  E  B  F#/A  E"},{"__type":"verse","txt":"Chuva de g[B]raça  pedimos a [F#]ti\\nChuva de g[G#m]raça derrama em [E]nós\\nChuva de g[B]raça neste lu[F#]gar\\nder[E]rama!"},{"__type":"verse","txt":"[B]Há uma chuva de g[F#]raça aqui\\n[G#m]Está chovendo sob[E]re todos nós\\n[B]E quem mais se entreg[F#]ar\\nMais se molhar[E]á"},{"__type":"verse","txt":"[B]Há uma semente pra germin[F#]ar\\n[G#m]E muitos frutos a s[E]e produzir\\n[B]Na terra do coraç[F#]ão\\nDerrama tua g[E]raça"},{"__type":"verse","txt":"Chuva de g[B]raça  pedimos a [F#]ti\\nChuva de g[G#m]raça derrama em n[E]ós\\nChuva de g[B]raça neste lug[F#]ar\\nder[E]rama!"},{"__type":"verse","txt":"[B]Ô,     ô,      ô,     [F#]ô,        [G#m] ô,     ô,     [E]ô,     ô\\n[B]Ô,     ô,      ô,     [F#]ô,        [G#m] ô,     ô,     [E]ô,     ô"}],"celebrationCategory":[],"liturgyCategory":[],"chordsUrl":null,"scoreUrl":null,"audioUrl":null,"videoUrl":null},{"title":"Poderoso Deus (C)","author":"Tony Alysson","parts":[{"__type":"verse","txt":"[C]Sopra Espírito de [G/B]Deus\\n[Am]Sobre o clamor da Ig[F]reja\\nLi[C]bera Tua unção de mi[G/B]lagres\\nSobre n[Am]ós.   [F]"},{"__type":"verse","txt":"Queremos [Am]ver sin[G/B]ais\\nda [Am]manifestação do Teu po[F]der\\nPois quem [Am]crer ve[G/B]rá\\na [Am]gloria do Senhor aconte[F]cer"},{"__type":"verse","txt":"Poderoso [G/B]Deus, e [C]Rei,  [G/B]\\nLibera [Am]tua unção de cura\\nnes[F]se lugar\\n\\nPoderoso D[C]eus, e [G/B]Rei,\\nLibera [Am]tua unção de cura\\nnes[F]se lugar."}],"celebrationCategory":[],"liturgyCategory":[],"chordsUrl":null,"scoreUrl":null,"audioUrl":null,"videoUrl":null}]}]';
	
	//test escaping...
	console.log( "escaped: " + escape_utf8_ascii_safe(params.json) );
	console.log( "unescaped: " + unescape_utf8_ascii_safe(escape_utf8_ascii_safe(params.json)) );
	
	console.log( "escaped/unescaped checked: " + (params.json == unescape_utf8_ascii_safe(escape_utf8_ascii_safe(params.json))) );
	
	//base 62 charset...
	if (characterSet.length == 0)
		setCharacterSet(DEFAULT_CHARACTER_SET);
	
	var encodedjson = escape_utf8_ascii_safe(params.json);
	console.log("encoded json: " + encodedjson);
	var int_array_lzw_json = LZW.compress(encodedjson);
	console.log("int array: " + String(int_array_lzw_json));
	var back = unescape_utf8_ascii_safe(LZW.decompress(int_array_lzw_json));
	console.log("back: " + String(back));
	
	console.log('localcompress : '+ (String(back) == String(params.json)) );
	
	//convert to base 62
	var ints = int_array_lzw_json;
	var hexstr = "";
	for(var i=0; i < ints.length; i++) {
		if (i>0)
			hexstr += ';';
		//hexstr += ints[i].toString(36);
		hexstr += encode(ints[i]);
	}
	
	$.ajax({
		async:async,
		type: "POST",
		url: __requesturl__,
		//cache: false,
		data: { "data":JSON.stringify({"op":"check-compression","lzw-json": hexstr }) },
		
		success: function(data,status){
			
			console.log("encoded json: " + String(data[1]));
			console.log("int array: " + String(int_array_lzw_json));
			console.log("back: " + String(data[2]));
			
			console.log("int array check: " + (String(data[0]) == String(int_array_lzw_json)) );
			console.log("ascii encoded utf-8 check: " + (String(data[1]) == String(encodedjson)) );
			console.log("original utf-8 check: " + (String(data[2]) == String(params.json)) );
			
			console.log("original utf-8 check2: " + ( (String(data[2]) == String(data[3])) && (String(data[2]) == String(params.json)) ) );
			
			//console.log("compression data check: " + (data[0] == params.json) );
		},
		
		//success: params.onSuccess ,
		error: params.onFail
	});
	
}


function dumpfile_window_location_download_file() {
	window.location = __requesturl__+'?data={"op":"json-dump"}';
}

/*
params = {
	token:'google API auth token from browser',
	json:JSON.stringify(['']),
	async:false,
	onSuccess: function(data,status){},
	onFail: function(data,status){},
}
*/
function dumpfile_download( params ) {
	var async = false;
	if (params.async != null)
		async = params.async;
	
	$.ajax({
		async:async,
		type: "POST",
		url: __requesturl__,
		//cache: false,
		data: { "data":JSON.stringify({
			"op":"json-dump",
			"token": params.token }) 
		},
		
		success: function (data,status) {
			if ( data['error'] != null ) {
				if (params.onFail != null)
					params.onFail(data,status);
			} else {
				if (params.onSuccess != null)
					params.onSuccess(data,status);
			}
		} ,
		error: params.onFail
	});
	
}

/*
params = {
	token:'google API auth token from browser',
	json:JSON.stringify(['']),
	async:false,
	onSuccess: function(data,status){},
	onFail: function(data,status){},
}
*/
function dumpfile_restore( params ) {
	var async = false;
	if (params.async != null)
		async = params.async;
	
	var compressedstring = CompressUTF8_to_LZW_Base62_String(params.json);
	//var backString = DecompressLZW_Base62_to_UTF8_String(compressedstring);
	//console.log('backcompression test: ' + ( backString == params.json ));
	
	$.ajax({
		async:async,
		type: "POST",
		url: __requesturl__,
		//cache: false,
		data: { "data":JSON.stringify({
			"op":"json-restore",
			"compressed-json": compressedstring,
			"token": params.token }) 
		},
		
		success: function (data,status) {
			if ( data['error'] != null ) {
				if (params.onFail != null)
					params.onFail(data,status);
			} else {
				if (params.onSuccess != null)
					params.onSuccess(data,status);
			}
		} ,
		error: params.onFail
	});
	
}

//
// music calls
//

/*
params = {
	async:false,
	onMusicListJson: function(data,status){},
	onFail: function(data,status){},
}
*/
function musicList( params ) {
	var async = false;
	if (params.async != null)
		async = params.async;
	
	$.ajax({
		async:async,
		type: "POST",
		url: __requesturl__,
		//cache: false,
		data: { "data":JSON.stringify({"op":"music-list"}) },
		success: params.onMusicListJson,
		error: params.onFail
	});
}

/*
params = {
	id:36,
	async:false,
	onMusicJson: function(data,status){},
	onFail: function(data,status){},
}
*/
function musicGetByID( params ) {
	var async = false;
	if (params.async != null)
		async = params.async;

	$.ajax({
		async:async,
		type: "POST",
		url: __requesturl__,
		//cache: false,
		data: { "data":JSON.stringify({"op":"music-get-by-id","id": params.id }) },
		success: params.onMusicJson ,
		error: params.onFail
	});
}


function postAndRedirect(url, postData)
{
	if ($('#__redirection'))
		$('#__redirection').remove();
	
	var postFormStr = "<form id='__redirection' method='POST' action='" + url + "' data-ajax='false' target='_blank' >\n";
	for (var key in postData)
	{
		if (postData.hasOwnProperty(key))
		{
			postFormStr += "<input type='hidden' name='" + key + "' value='" + postData[key] + "'></input>";
		}
	}
	postFormStr += "</form>";
	var formElement = $(postFormStr);
	$('body').append(formElement);
	$(formElement).submit();
}

function pdfExportRedirect(params) {
	
	postAndRedirect(__requesturlpdf__, { 
		"data":JSON.stringify({
			"jsonMusicIDs":params.jsonMusicIDs,
			"musicianVersion":params.musicianVersion,
			"scriptName":params.scriptName,
			"token":params.token
		}) 
	});
}

/*
params = {
	jsonMusicIDs:JSON.stringify([34,35,36]),
	async:false,
	onMusicListJson: function(data,status){},
	onFail: function(data,status){},
}
*/
function musicGetJsonList(params) {
	var async = false;
	if (params.async != null)
		async = params.async;
	
	$.ajax({
		async:async,
		type: "POST",
		url: __requesturl__,
		//cache: false,
		data: { "data":JSON.stringify({"op":"music-get-json-list","jsonMusicIDs":params.jsonMusicIDs}) },
		success: params.onMusicListJson,
		error: params.onFail
	});
}


/*
params = {
	id:36,
	async:false,
	onMusicJson: function(data,status){},
	onFail: function(data,status){},
}
*/
function musicGetJsonByID( params ) {
	var async = false;
	if (params.async != null)
		async = params.async;
	
	$.ajax({
		async:async,
		type: "POST",
		url: __requesturl__,
		//cache: false,
		data: { "data":JSON.stringify({"op":"music-get-json-by-id","id":params.id}) },
		success: params.onMusicJson,
		error: params.onFail
	});
}

/*
params = {
	token:'google API auth token from browser',
	id:'if the music is in the DB.. the ID will cause an update and not an insert',
	name:'music name',
	raw:'raw text',
	json:JSON.stringify(["json string"]),
	async:false,
	onSuccess: function(data){},
	onFail: function(data){},
}
*/
function musicRecordByID( params ) {
	
	var async = false;
	if (params.async != null)
		async = params.async;
	
	var sendparams = {
		"op":"music-record-by-id",
		"name":params.name,
		"raw":params.raw,
		"json":params.json,
		"token":params.token
	};
	
	if (params.id != null)
		sendparams['id'] = params.id;
	
	$.ajax({
		async:async,
		type: "POST",
		url: __requesturl__,
		//cache: false,
		data: { "data":JSON.stringify(sendparams) },
		success: function (data,status) {
			if (data['success'] != null && data['success'] == true) {
				params['id'] = data['id'];
				if (params.onSuccess != null)
					params.onSuccess(params);
			} else {
				if (params.onFail != null)
					params.onFail(data);
			}
		},
		error: function (data,status) {
			if (params.onFail != null)
				params.onFail({'error':'internal server'});
		}
	});
}

//
// script calls
//

/*
params = {
	async:false,
	onScriptListJson: function(data,status){},
	onFail: function(data,status){},
}
*/
function scriptList( params ) {
	var async = false;
	if (params.async != null)
		async = params.async;
	
	$.ajax({
		async:async,
		type: "POST",
		url: __requesturl__,
		//cache: false,
		data: { "data":JSON.stringify({"op":"script-list"}) },
		success: params.onScriptListJson,
		error: params.onFail
	});
}

/*
params = {
	id:36,
	async:false,
	onScriptJson: function(data,status){},
	onFail: function(data,status){},
}
*/
function scriptGetByID( params ) {
	var async = false;
	if (params.async != null)
		async = params.async;
	
	$.ajax({
		async:async,
		type: "POST",
		url: __requesturl__,
		//cache: false,
		data: { "data":JSON.stringify({"op":"script-get-by-id","id":params.id}) },
		success: params.onScriptJson,
		error: params.onFail
	});
}

/*
params = {
	jsonScriptIDs:JSON.stringify([34,35,36]),
	async:false,
	onScriptListJson: function(data,status){},
	onFail: function(data,status){},
}
*/
function scriptExportJson( params ) {
	var async = false;
	if (params.async != null)
		async = params.async;
	
	$.ajax({
		async:async,
		type: "POST",
		url: __requesturl__,
		//cache: false,
		data: { 
			"data":JSON.stringify({
				"op":"script-export-json",
				"token":params.token,
				"jsonScriptIDs":params.jsonScriptIDs
			}) 
		},
		success: params.onScriptListJson,
		error: params.onFail
	});
}

/*
params = {
	token:'google API auth token from browser',
	id:'if the music is in the DB.. the ID will cause an update and not an insert',
	name:'music name',
	json:JSON.stringify(["json string"]),
	async:false,
	onSuccess: function(data){},
	onFail: function(data){},
}
*/
function scriptRecordByID( params ) {
	var async = false;
	if (params.async != null)
		async = params.async;
	
	var sendparams = {
		"op":"script-record-by-id",
		"name":params.name,
		"json":params.json,
		"token":params.token
	};
	
	if (params.id != null) {
		sendparams['id'] = params.id;
	}
	
	$.ajax({
		async:async,
		type: "POST",
		url: __requesturl__,
		//cache: false,
		data: { "data":JSON.stringify(sendparams) },
		success: function (data,status) {
			if (data['success'] != null && data['success'] == true) {
				params['id'] = data['id'];
				if (params.onSuccess != null)
					params.onSuccess(params);
			} else {
				if (params.onFail != null)
					params.onFail(data);
			}
		},
		error: function (data,status) {
			if (params.onFail != null)
				params.onFail({'error':'internal server'});
		}
	});
}

