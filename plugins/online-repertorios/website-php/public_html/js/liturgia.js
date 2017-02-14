// device events
function deviceBackPress() {
	//android.forwardBackPress();
	//alert("android.forwardBackPress");
	//window.history.back();
	document.location.href='../../content/noticia.html';
}

$(document).bind("mobileinit", function(){
	//$.mobile.changePage.defaults.changeHash = false;
	//$.mobile.hashListeningEnabled = false;
	//$.mobile.pushStateEnabled = false;//this is the main problem...
	$.extend(  $.mobile , {
		ajaxEnabled: false
	});
});
