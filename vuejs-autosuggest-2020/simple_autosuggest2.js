document.write("<style>\
	.autosuggest_ajax{position:absolute;background-color:white;border:1px solid green;height:120px;overflow: auto;z-index:105;margin-top:1px;display: block;min-width:100px; }\
	.active{background-color:  rgb(240, 224, 224)!important;cursor: pointer;}\
	.item{background: green!important;}\
</style>");
//removed v-on:blur="show_selected_data"  in input box
function simple_autosuggest(target_id,vlist){
	if(!vlist['autosuggestion_width']){
		vlist['autosuggestion_width'] = "100%";
	}
	var app = new Vue({
	    	el: '#'+target_id,
	    	data: function(){
					sub_options = 	{
								"form_field_name"	: "singlevalue",
								"select_key" 		: "id",
								"select_name" 		: "name",
								"search_key" 		: "name",
								"ajax_url" 		: "?action=search_keys&keyword=#KEYWORD#",
								"min_length_to_search"	: 0,
								"selected_item"		: {},
								"class"			: "form-control input-sm form-control-sm",
								"strict"		: "false"
						    	};
					for( i in vlist ){
						sub_options[ i ] = vlist[i];
					}
					return	{
							ShowTemplate 		: true,
							options			: sub_options,
							target_id 		: target_id,
							data_list 		: [],
							suggestions_position 	: 0,
							min_length_to_search	: 0,
							suggestion_keyword 	: "",
							suggestion_show_status 	: false,
							selected_item 		: {
											name 	: "",
											id 	: ""
										  },
							suggestion_keyword_id	: "",
							ajax_list 		: {},
							ajax_list_data 		: [],
							activeclassname		: "active",
							external_events		: {},
							Placeholder 		: ((vlist["Placeholder"] ) ?vlist["Placeholder"]:''),
						}
				},
			template:'<div style="width:'+vlist['width']+'" v-if="ShowTemplate">\
					<input type="text" name="'+target_id+'" id="field_'+target_id+'" autocomplete="off" :placeholder="Placeholder" v-on:focus="show_suggestion_box"  v-on:keyup="suggestion_box_key_event" v-on:keypress="suggestion_box_keypress_event" v-on:click="show_suggestion_box" v-on:blur="show_selected_data"  v-model="suggestion_keyword" class="'+vlist.class+'" data-id="'+target_id+'">\
					<input type="hidden" name="'+target_id+'_id" id="field_'+target_id+'"  v-model="suggestion_keyword_id">\
					<div id="'+target_id+'_list" class="autosuggest_ajax" style="width:'+vlist['autosuggestion_width']+'!important" v-if="suggestion_show_status" >\
						<div v-for="data in data_list" :id="data.id"  v-on:click="select_suggestion(data.id)" v-on:mouseover="highlight_suggestion(data.id)"  v-on:mouseout="remove_suggestion(data.id)"  v-bind:class="{active: data.selected}" v-if="data.e">\
							<span class="text-danger">{{data.fn}}</span>{{data.name.substr( data.fn_length, data.name.length ) }}\
						</div>\
					</div>\
				  </div>',
			mounted(){
			},
			created(){
			},
			beforeDestroy() {
		  	},
			methods:{
				select_event(){
					//console.log("called select_event");
					if( this.external_events["select_event"] ){
						s = this.external_events["select_event"];
						p = {"name":this.selected_item["name"],"id":this.selected_item["id"]}
						s( this.selected_item );
					}
				},
				change_ajax_url(vurl2){
					//console.log("called change_ajax_url");
					this.options["ajax_url"] = vurl2;
				},
				add_event: function(eventname, vfunction){
					//console.log("called add_event");
					this.external_events[eventname] = vfunction;
				},
				hide_suggestion_box(e){
					//console.log("called hide_suggestion_box");
					setTimeout(this.hide_suggestion_box2(), 50000);
				},
				hide_suggestion_box2(){
					//console.log("called hide_suggestion_box2");
					this.suggestion_show_status = false;
				},
				highlight_suggestion(v){
					//console.log("highlight_suggestion");
					t = this.data_list;
					for(i in t){
						if( t[i]["id"] == v ){
							t[i].selected = true;
						}else{
							t[i].selected = false;
						}

					}
					this.data_list = [];
					this.data_list = t;
				},
				remove_suggestion(v){
					//console.log("called remove_suggestion");
					t = this.data_list;
					for(i in t){
						t[i].selected = false;
					}
					this.data_list = [];
					this.data_list = t;
				},
				select_suggestion(vid){
					//console.log("clicked");
					if( vid == "undefined" || vid == false || !vid ){
						var rec = {"id":"-new-item-", "name":this.suggestion_keyword};
					}else{
						for( i in this.data_list ){
							if(this.data_list[i]["id"] == vid ){
								var rec = this.data_list[ i ];
							}
						}
					}
					this.selected_item = rec;
					this.suggestion_keyword = rec.name;
					this.suggestion_keyword_id = rec.id;
					this.hide_suggestion_box(e);
					this.suggestions_position = 0;
					this.select_event();
					//console.log(this.selected_item);
				},
				show_suggestion_box(e){
					//console.log("called show_suggestion_box");
					vtxt = this.suggestion_keyword;
					if( vtxt ){
						this.suggestion_keyword = vtxt;
						this.suggestions_position = 0;
						this.fill_suggestion_box( vtxt );
						this.search_keywords( vtxt );
						this.suggestion_show_status= true;
					}
				},
				show_selected_data(e){
					setTimeout(this.show_selected_data2(), 50000);
				},
				show_selected_data2(){
					//console.log(this.selected_item);
					if(!this.selected_item["name"]){
						if(this.options["strict"] == "true"){
							var rec = {"id":"-new-item-", "name":this.suggestion_keyword};
							this.selected_item = rec;
							this.suggestion_keyword = rec.name;
							this.suggestion_keyword_id = rec.id;
						}else{
							this.suggestion_keyword = "";
							this.suggestion_keyword_id = "";
						}
						this.select_event();
					}
					this.hide_suggestion_box();
					this.suggestions_position = 0;
				},
				fill_suggestion_box(){
					//console.log("called fill_suggestion_box");
					vtxt = this.suggestion_keyword;
					vtxt2 = vtxt;
					vtxt = vtxt.toLowerCase();
					vstr = "";
					if( this.suggestion_keyword != "" ){
			                	var searched_record_ids = []; 
			                	vpre = /(.*)/i;
			                	pp = this.suggestion_keyword;
			                	pp = pp.replace(/(\W)/g, function(s,s1){return String.fromCharCode(92)+s;} )
			                	eval("vpre=/^"+pp+"/i"); 
				                search_field_name = this.data_list[ "search_key" ];
				                select_field_name = this.data_list[ "select_name"];
						select_field_key = this.data_list[ "select_key"];
						vvcnt = 0;
						for( vid in this.data_list ){
							if( vvcnt > 50 ){ console.log("Search Broke"); break; }
							e =this.data_list[ vid ].valueOf();
							rec = this.data_list[ vid ];
							//console.log(rec);
							var rec_id = rec[ "id" ];
							var rec_name2 = rec[ "name" ];
							var rec_name = rec[ "name" ].toLowerCase();
							e = rec_name.search( vpre );
							if( e == -1 ){
								this.data_list[vid]["e"] = false;
							}else{
								vvcnt++;
								searched_record_ids.push( rec_id );
								fna = rec_name2.substr( e, vtxt2.length );
								v1  = rec_name2.replace( fna, "<span style='color:red;'>"+fna+"</span>" );
								rec[ search_field_name ] = v1; 
								this.data_list[vid]["fn"] = fna;
								this.data_list[vid]["fn_length"] = fna.length;
							}
						}
						pp = this.suggestion_keyword;
						pp = pp.replace(/(\W)/g, function(s,s1){return String.fromCharCode(92)+s;} )
			                	eval("vpre=/"+pp+"/i");
						for( vid in this.data_list ){
							if( vvcnt > 50 ){ console.log("Search Broke"); break; }
							e =this.data_list[ vid ].valueOf();
							rec = this.data_list[ vid ];
							var rec_id = rec[ "id" ];
							var rec_name2 = rec[ "name" ];
							var rec_name = rec[ "name" ].toLowerCase();
							e = rec_name.search( vpre );
							this.data_list[vid]["e"] = true;
							if( searched_record_ids.indexOf( rec_id ) == -1 ){
								e = rec_name.search( vpre );
								if( e == -1 ){
									this.data_list[vid]["e"] = false;
								}else{
									vvcnt++;
									searched_record_ids.push( rec_id );
									fna = rec_name2.substr( e, vtxt2.length );
									this.data_list[vid]["fn"] = fna;
									this.data_list[vid]["fn_length"] = fna.length;
									v1 = rec_name2.replace( fna, "<span style='color:red;'>"+fna+"</span>" );
									rec[ search_field_name ] = v1; 
								}
							}
						}
					}
				},
				suggestion_box_key_event(e){
					//console.log("called suggestion_box_key_event");
					if( e.keyCode == 27 ){
						//console.log("caleced 27");
						this.hide_suggestion_box();
					}else if( e.keyCode == 38 ){ //up
						//console.log("called Up");
						this.suggestions_position--;
						this.highlight_suggestion_item( this.suggestions_position );			
					}else if( e.keyCode == 40 ){ //down
						//console.log("called down");
						if( this.suggestion_show_status == false ){
							this.suggestion_keyword = "";
							this.show_suggestion_box();
						}else{
							this.suggestions_position++;
							this.highlight_suggestion_item( this.suggestions_position );
							
						}
					}else if( e.keyCode == 13 || e.keyCode == 10 ){
					} 
					if( ( e.keyCode >= 48 && e.keyCode <= 122 ) || e.keyCode == 8 || e.keyCode == 46 ){
						//console.log("s");
						this.show_suggestion_box();
						this.selected_item = {name:"",id:"",v:"",_id:""};
					}
				},
				get_selected_item_id (){
					//console.log("called get_selected_item_id");
					if( this.suggestions_position ){
						return this.data_list[ this.suggestions_position-1 ].id;
					}else{
						return false;
					}
				},
				suggestion_box_keypress_event(e){
					//console.log("Called Suggestion Box Key Press event");
					if( e.keyCode == 13 || e.keyCode == 10 ){
						e.preventDefault();
						if( this.suggestion_show_status ){
							this.select_suggestion( this.get_selected_item_id() );
						} 
					} 
				},
				highlight_suggestion_item( vpos ){
					//console.log("Called highlight_suggestion_item");
					var vp = vpos;						
					if( vp > this.data_list.length){
						vp = this.data_list.length;
						this.suggestions_position = 1;
					}

					if( vp < 1 ){
						vp = 1;
						this.suggestions_position = 1; 
					} 
					t = this.data_list;
					for(i in t){
						if( i == (this.suggestions_position -1) ){
							t[i].selected = true;
						}else{
							t[i].selected = false;
						}
					}
					this.data_list = [];
					this.data_list = t;
				},
				search_required( vtxt ){
					if( vtxt.length > 1 ){
						vtxt2 = vtxt.substr(0, vtxt.length-1);
						if( this.ajax_list[ vtxt2 ] == undefined ){
							return true;
						}
						if( this.ajax_list[ vtxt2 ] > 50 ){
							return true;
						}else{
							return false;
						}
					}else{
						return true;
					}
				},
				search_keywords(vtxt){
					if( vtxt.length  >= this.min_length_to_search){
						if( this.search_required( vtxt ) ){
							if( this.ajax_list[ vtxt ] == undefined ){
								console.log("Finding...");
								this.ajax  = new XMLHttpRequest;
								this.ajax.vid = this.vid;
								this.ajax.parent = this;
								this.ajax.onreadystatechange = function ( ){
									if (this.readyState == 4 && this.status == 200) {
										eval("list="+this.responseText);
										this.parent.data_list = [];
										this.parent.ajax_response = list;
										this.parent.load_keyword(vtxt);
									}else if(this.readyState == 4 && this.status != 200 ){
										console.log("ERROR: AJAX RESPONSE " +this.status );
									}
								}
								vurl = this.options["ajax_url"].replace("#KEYWORD#", vtxt );
								this.ajax.open( "GET", vurl, true );
								this.ajax.send();
							}
						}
					}
				},
				load_keyword(vsearched_keyword){
					if( this.ajax_list[ vsearched_keyword ] == undefined ){
						this.ajax_list[ vsearched_keyword ] = 1;
						this.data_list = [];
						resp_list = this.ajax_response;
						select_field_key = this.options["select_key"];
						search_field_name = this.options["search_key"];
						newrec_added = 0;
						for( i in resp_list ){
							this.ajax_list[ vsearched_keyword ]++;
							d = resp_list[i];
							d["fn_length"]  = 0;
							d["e"] = true;
							f = false;
			                		for(j in this.data_list){
								dd = this.data_list[j ];
			                   		 	if( d[select_field_key] == dd[select_field_key] ){
									f = true;
									break;
								}
							}
							if( f == false ){
								//d["selected"] = true;
								this.data_list.push( d );
								newrec_added++;
							}
						}
						if( newrec_added ){			
							for(i=0;i<this.data_list.length;i++){
								for(j=0;j<this.data_list.length-1;j++){
									d1 = this.data_list[  j  ][ search_field_name ];
									d2 = this.data_list[ j+1 ][ search_field_name ];
									if( d1 > d2 ){
										t = this.data_list[j];
										this.data_list[j] = this.data_list[j+1];
										this.data_list[j]["fn_length"]  = 0;
										this.data_list[j]["e"] = true;
										this.data_list[j+1] = t;
									}
								}
							}
						}
					}
					this.fill_suggestion_box();
				},

			}
		});
	return app;
}