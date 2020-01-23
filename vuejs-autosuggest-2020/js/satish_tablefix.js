<script>
var gcnt = 0;
var csslist = ["border-top", "border-left", "border-right", "border-bottom", "border", "padding", "white-space", "text-align", "box-sizing", "vertical-align", "font-weight", "border-collapse", "font-size", "font-style", "color", "font-variant", "display", "border-spacing", "border-color", "margin", "font-family", "background-color" ];
function createTree( vmain, vnew, vlevel ){
	var vlist = vmain.childNodes;
	//console.log( vlevel + ": ChildNodes: " + vlist.length );
	gcnt++;
	if( gcnt > 200 ){
		console.log("count readhed");
		return 0;
	}
	for(var vi=0;vi<vlist.length;vi++){
		var v = vlist[vi];
		//console.log( vlevel + ": " + vi + ": " +  v.nodeName );
		//if( v.nodeName != "#text" )
		{
			if( v.nodeName == "#text" ){
				//console.log( vlevel + ": " + vi + ": " + v.nodeValue );
				var vt = document.createTextNode( v.nodeValue );
				vnew.appendChild( vt );
			}else{
				var vt = document.createElement(v.nodeName);
				if( v.nodeName=="TD" ||  v.nodeName == "TH" || v.nodeName == "TABLE" || v.nodeName == "TR" ){
					//$(vt).width( $(v).width() );
					//$(vt).height( $(v).height() );
					$(vt).innerHeight( $(v).innerHeight() );
					$(vt).outerWidth( $(v).outerWidth() );
					console.log( v.innerHTML );
					console.log( $(v).width() + ": " + $(v).height() );
				}
				for( iss in csslist ){
					try{
					if( $(v).css( csslist[iss] ) ){
						$(vt).css( csslist[iss], $(v).css( csslist[iss] ) );
					}
					}catch(e){}
				}
				vnew.appendChild( vt );
				createTree( v, vt, vlevel+1 );
			}
		}
	}
	vlevel++;
}
function createTree2( vmain, vnew, vlevel ){
	var vlist = vmain.childNodes;
	//console.log( vlevel + ": ChildNodes: " + vlist.length );
	gcnt++;
	if( gcnt > 200 ){
		console.log("count readhed");
		return 0;
	}
	for(var vi=0;vi<vlist.length;vi++){
		var v = vlist[vi];
		//console.log( vlevel + ": " + vi + ": " +  v.nodeName );
		//if( v.nodeName != "#text" )
		{
			if( v.nodeName == "#text" ){
				//console.log( vlevel + ": " + vi + ": " + v.nodeValue );
				var vt = document.createTextNode( v.nodeValue );
				vnew.appendChild( vt );
			}else{
				f = true;
				if( v.nodeName == "TD" || v.nodeName == "TH" ){
					//console.log( $(v).hasClass("fixed") );
					if( $(v).hasClass("fixed") == false ){
						f = false;
					}
				}
				if( f ){
				var vt = document.createElement(v.nodeName);
				if( v.nodeName=="TD" ||  v.nodeName == "TH" || v.nodeName == "TABLE" || v.nodeName == "TR" ){
					//$(vt).width( $(v).width() );
					//$(vt).height( $(v).height() );
					$(vt).innerHeight( $(v).innerHeight() );
					$(vt).outerWidth( $(v).outerWidth() );

				}
				for( iss in csslist ){
					try{
					if( $(v).css( csslist[iss] ) ){
						$(vt).css( csslist[iss], $(v).css( csslist[iss] ) );
					}
					}catch(e){}
				}
				vnew.appendChild( vt );
				createTree2( v, vt, vlevel+1 );
				}
			}
		}
	}
	vlevel++;
}
$(document).ready(function(){

	$( window ).scroll(function(){
		x = $(this).scrollTop();
		y = $(this).scrollLeft();
		console.log( "Scrolled:" + x+":"+y );
		$("#fixedTHead_inner").css( "margin-left", "-"+y+"px" ); 
		//$("#fixedTHead2_inner").css( "margin-left", "-"+y+"px" );
		$("#fixedLeft_inner").css( "margin-top", "-"+x+"px" );
		$("#footerdiv").css('margin-left', y+"px");
		
		theight = $(document).height();
		ftop = theight - 100 - window.innerHeight;
		if( x > ftop ){
			console.log("foootter");
			//$("#footerdiv").css('position','fixed');
		}else{
			//$("#footerdiv").css('position','absolute');
		}
		
	  });
	  console.log( "Height: " + $(document).height() );
	  console.log( "Height: " + window.innerHeight );

	vmainc = document.getElementsByClassName("satfixed");
	pos = $(vmainc).position();
	for(vi=0;vi<vmainc.length;vi++){
		vele = vmainc[vi];
		vlist = vele.childNodes;
		for(vi2=0;vi2<vlist.length;vi2++){
			var v = vlist[vi2];
			if( v.nodeName == "THEAD" ){

				var vt2 = document.createElement("div");
				vt2.style.backgroundColor = 'white';
				vt2.style.position = 'fixed';
				vt2.style.top = pos.top+"px"; 
				vt2.style.left = pos.left+"px";
				vt2.style.zIndex = 57;
				vt2.style.overflow = 'hidden';
				vt2.style.borderRight = '1px solid #cdcdcd';
				//$(vt2).width( $(v).width() );
				$(vt2).height( $(v).height() );
				vt2.id = "fixedTHead2";
				vt2.className="fixedTHead2";
				document.body.appendChild( vt2 );

				var vt3 = document.createElement("table");
				vt3.style.backgroundColor = 'white';
				vt3.id = "fixedTHead2_inner";
				vt3.className="fixedTHead2_inner";
				//$(vt3).width( $(v).width() );
				$(vt3).height( $(v).height() );
				vt2.appendChild( vt3 );
				createTree2( v, vt3, 1, true );

				var vt1 = document.createElement("div");
				vt1.style.backgroundColor = 'white';
				vt1.style.position = 'fixed';
				vt1.style.top = pos.top+"px"; 
				vt1.style.left = pos.left+"px";
				vt1.style.zIndex = 55;
				vt1.style.overflow = 'hidden';
				$(vt1).width( $(v).width() );
				$(vt1).height( $(v).height() );
				vt1.id = "fixedTHead";
				vt1.className="fixedTHead";
				document.body.appendChild( vt1 );

				var vt = document.createElement("table");
				vt.style.backgroundColor = 'white';
				vt.id = "fixedTHead_inner";
				vt.className="fixedTHead_inner";
				$(vt).width( $(v).width() );
				$(vt).height( $(v).height() );
				vt1.appendChild( vt );
				createTree( v, vt, 1, true );

			}else if( v.nodeName == "TBODY" ){
				var vt1 = document.createElement("div");
				vt1.style.backgroundColor = 'white';
				pos2 = $(v).position();
				vt1.style.position = 'fixed';
				vt1.style.top = (pos.top+pos2.top)+"px"; 
				vt1.style.left = (pos.left+pos2.left)+"px";
				vt1.style.overflow = 'hidden';
				vt1.style.zIndex = 54;
				vt1.style.borderRight = '1px solid #cdcdcd';
				vt1.id = "fixedLeft";
				vt1.className="fixedLeft";
				document.body.appendChild( vt1 );
								
				var vt = document.createElement("table");
				vt.style.backgroundColor = 'white';
				pos2 = $(v).position();
				vt.id = "fixedLeft_inner";
				vt.className="fixedLeft_inner";
				vt1.appendChild( vt );
				createTree2( v, vt, 1, true );
			}
		}
	}
	//vt = document.createElement("");
});
</script>