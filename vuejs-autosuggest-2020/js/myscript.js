
function get_request_json( vurl, vcallback ){

	con = new XMLHttpRequest();
	con.onreadystatechange = function(){
		if( this.readyState == 4 && this.status == "200"){
			var contentType = this.getResponseHeader("Content-Type");
			console.log( contentType );
			if( contentType.match( /json/i ) || contentType.match( /javascript/i )  ){
				try{
					eval("vdata="+this.responseText);
					console.log( vdata );
					if( vdata.hasOwnProperty("status") || vdata.hasOwnProperty("fail") ){
						try{
							console.log(vcallback);
							vcallback( vdata );
						}catch(e){
							alert("Error in callback function!\n"+e);
						}
					}else{
						alert("Response Error:\n " + vdata["status"] );
					}
				}catch(e){
					alert("Error reading response! code.35353\n" + this.responseText);
				}
			}else{
				console.log("Server sending plain text, while expecting json");
				alert( "Server response Error. incorrect format!" );
				//vcallback( this.responseText );
			}
			//state_added("sucess");
		}else if( this.readyState == 4 && this.status == "403" ){
			alert("Session Expired or Authentication error!");
		}
	}
//	alert( vurl.indexOf( "?") );
	if( vurl.indexOf( "?") == -1 ){
		vurl = vurl + "?ajax_type=json";
	}else{
		vurl = vurl + "&ajax_type=json";
	}
//	alert( vurl );
	con.open( "GET", vurl, true );
	con.send();
}

function get_request( vurl, vcallback ){

	con = new XMLHttpRequest();
	con.onreadystatechange = function(){
		if( this.readyState == 4 && this.status == "200" ){
			try{
				vcallback( this.responseText );
			}catch(e){
				alert("Error in callback function!\n"+e);
			}
		}else if( this.readyState == 4 && this.status == "403" ){
			alert("Session Expired or Authentication error!");
		}

	}
	con.open( "GET", vurl, true );
	con.send();
}

function post_request_json( vurl, vdata, vcallback ){
	var vpostdata = "";
	if( typeof(vdata) == 'string' ){
		vpostdata = vdata;
	}else if( typeof(vdata) == "object" ){
		for( i in vdata ){
			vpostdata = vpostdata + i + "=" + encodeURIComponent( vdata[i] ) + "&";
		}
		vpostdata = vpostdata + "ajax_type=json"; 
	}else{
		console.log("Error in post request data!");
		return 0;
	}

	con = new XMLHttpRequest();
	con.onreadystatechange = function(){
		if( this.readyState == 4 && this.status == "200"){
			var contentType = this.getResponseHeader("Content-Type");
			console.log( contentType );
			if( contentType.match( /json/i ) || contentType.match( /javascript/i )  ){
				try{
					eval("vdata="+this.responseText);
					if( vdata.hasOwnProperty("status") || vdata.hasOwnProperty("fail") ){
						try{
							vcallback( vdata );
						}catch(e){
							alert("Error in callback function!\n"+e);
						}
					}else{
						alert("Response Error:\n " + vdata["status"] );
					}
				}catch(e){
					alert("Error reading response! code.35353\n" + this.responseText);
				}
			}else{
				alert( "Plain text response recieved: \n" + this.responseText );
				//vcallback( this.responseText );
			}
		}else if( this.readyState == 4 && this.status == "403" ){
			alert("Session Expired or Authentication error!");
		}
	}
	con.open( "POST", vurl, true );
	con.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	con.send( vpostdata );
}

function post_request( vurl, vdata, vcallback ){
	var vpostdata = "";
	if( typeof(vdata) == 'string' ){
		vpostdata = vdata;
	}else if( typeof(vdata) == "object" ){
		for( i in vdata ){
			vpostdata = vpostdata + i + "=" + encodeURIComponent( vdata[i] ) + "&";
		} 
	}else{
		console.log("Error in post request data!");
		return 0;
	}

	con = new XMLHttpRequest();
	con.onreadystatechange = function(){
		if( this.readyState == 4 && this.status == "200"){
			try{
				vcallback( this.responseText );
			}catch(e){
				alert("Error in callback function!\n"+e);
			}
		}else if( this.readyState == 4 && this.status == "403" ){
			alert("Session Expired or Authentication error!");
		}
	}
	con.open( "POST", vurl, true );
	con.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	con.send( vpostdata );
}

var pageWidth = 0; var pageHeight = 0; 
var pageVisibleWidth = 0; var pageVisibleHeight = 0; 
var pageScrollHeight = 0; var pageScrollWidth = 0; 
var isitIE = "y"; 
function FindSize(){
	if( window.innerHeight && window.scrollMaxY ){ isitIE ='n'; pageWidth = window.innerWidth + window.scrollMaxX;  pageHeight = window.innerHeight + window.scrollMaxY; }
	else if( document.body.scrollHeight > document.body.offsetHeight ){ isitIE = "n"; pageWidth = document.body.scrollWidth; pageHeight = document.body.scrollHeight; }
	else{ isitIE = 'y'; pageWidth = document.body.offsetWidth + document.body.offsetLeft; pageHeight = document.body.offsetHeight + document.body.offsetTop; }
	return isitIE ;
}
function FindVisibleSize()
{
	if( typeof( window.innerWidth ) == 'number' ) { pageVisibleWidth = window.innerWidth; pageVisibleHeight = window.innerHeight; }
	else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) { pageVisibleWidth = document.documentElement.clientWidth; pageVisibleHeight = document.documentElement.clientHeight; }
	else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) { pageVisibleWidth = document.body.clientWidth; pageVisibleHeight = document.body.clientHeight; }
}

