document.write(`<style>
.vasm_itm { border: 1px solid #cdcdcd; border-radius:2px; cursor:pointer; margin-bottom:2px;}
.vasm_itm .kv { display:block; padding:2px 5px; }
.vasm_itm .kk { width:30px; text-align:center; float:right; padding:2px 5px; border-left:1px solid #f0f0f0; background-color:#ffaa77; font-weight:bold; color:black; }

.vasm_t { border: 1px solid #cdcdcd; border-radius:2px; cursor:pointer;}
.vasm_t .kv { display:block; padding:2px 5px; }
.vasm_t .kk { width:30px; text-align:center; float:right; padding:2px 5px; border-left:1px solid #f0f0f0; background-color:#f8f8f8; font-weight:bold; }
.vasm_t .kkk { width:30px; text-align:center; float:right; padding:2px 5px; border-left:1px solid #f0f0f0; background-color:#ffaa77; font-weight:bold; color:black; }
.vasm_tt { padding:2px 5px; width:100%; padding-left:20px; border: 1px solid #cdcdcd; border-radius:2px; }
.vasm_{ padding:2px 5px; border-bottom:1px solid #cdcdcd; cursor:pointer; }
.vasm_ span{ color:red;}
.vasm_f{ background-color:#f0f0f0; border-bottom:1px solid orange; }
.vasm_p {background-color:white; border:1px solid #cdcdcd; width:inherit;}
.vasm_td{ max-width:200px; overflow:auto; white-space:nowrap;}
.vasm_td{ max-width:200px; max-height:50px; resize:both; overflow:auto; }
.vasm_td::-webkit-scrollbar { width: 5px; height: 5px;}
.vasm_td::-webkit-scrollbar-track { background: #fff1f1;}
.vasm_td::-webkit-scrollbar-thumb { background: #fdd; }
.vasm_td::-webkit-scrollbar-thumb:hover { background: #555;}

</style>`);
Vue.component('simplemultiselect', {
	data: function(){
		return {
			"vselected":[],
			"voptions": {
				"api_url":"?",
				"api_params": {
					"action": "search_simple",
					"keyword": "#SEARCH_KEYWORD#",
					"extra": "extra",
				},
				"api_method": "GET",
				"data": {
					"search_field": "name",
					"multi_column": false,
					"columns": { 
						"name": "Name",
					},
				},
				"search_key": "name",
				//"default_list": [],  // required for default data
			},
			"vkeyword": "",
			"vplaceholder": "Select Thing",
			"vselected_html": "Select Thing",
			"vcalled": false,
			"vcalled_keyword": "",
			"vshow_keyword": "",
			"vlist_loaded": {},
			"vlist": [],
			"vlist_keys": {},
			"vshow": false,
			"su": [],
			"sui": 0,
			"suip": 0,
			"vclass": "vauto5",
			"varrow": "&or;"			
		}
	},
	watch: {
		vkeyword: function(){
			//console.log(this.vkeyword);
		}
	},
	props: ['voptions','vselected','vplaceholder'],
	mounted: function(){
		/*console.log( "autosuggest Mounted" );
		console.log( this.vlist_loaded );*/
		setTimeout(this.initialized,500);
	},
	methods: {
		initialized: function(){
			if( this.voptions.hasOwnProperty("default_list") ){
				if( this.voptions["default_list"].hasOwnProperty("length") ){
					this.prepare_list( this.voptions["default_list"] );
				}else{
					this.voptions["default_list"] = [];
				}
			}
			if( this.vselected.hasOwnProperty("length")==false ){
				this.vselected = [];
			}
		},
		copyit: function(v){
			return JSON.parse(JSON.stringify(v));
		},
		showit: function(){
			if( this.vshow == false ){
				this.vshow = true;
				this.varrow= "&and;";
				//setTimeout(function(v){ console.log( v.$refs ); v.$refs.suu[0].focus();},500,this);
				this.$nextTick(() => this.$refs["suu"].focus());
				console.log( this.vlist.length );
				if( this.vlist.length ){
					this.show_list();
				}
			}else{
				this.vshow = false;
				this.varrow= "&or;";
			}
		},
		delete_item: function( vi ){
			this.vselected.splice( vi, 1 );
			this.inform_parent();
		},		
		select_su: function(vi){
			v = this.su[ vi ].valueOf();
			delete(v["_f"]);
			delete(v["_v"]);
			this.vselected.push(v);
			console.log( "selected: " + JSON.stringify(this.vselected) );			
			this.vkeyword = "";
			this.hideit();
			this.inform_parent( this.vselected );
		},
		inform_parent: function(){
			v = this.vselected.valueOf();
			this.$emit("selected", v);
		},
		hideit: function(){
			this.vshow=false;
			this.sui = 0;
			this.suip = 0;
			this.su = [];
			this.varrow= "&or;";
		},
		vtyped: function(event){
			//console.log( event.keyCode );
			if( event.keyCode == 13  || event.keyCode == 10 ){ // up
				if( this.sui > 0 ){
					console.log( "Selected index: " + this.sui );
					this.select_su( this.sui-1 );
				}else{
					
				}
			}else if( event.keyCode == 37  || event.keyCode == 38 ){ // up
				if( this.sui > 0 ){
					this.su[ this.sui-1 ]['_f'] = false;
					this.suip = this.sui;
					this.sui--;
					this.su[ this.sui-1 ]['_f'] = true;
					this.dofocusup( this.sui );
				}
			}else if( event.keyCode == 39 || event.keyCode == 40 ){ // down
				if( this.sui < this.su.length ){
					if( this.sui > 0 ){
						this.su[ this.sui-1 ]['_f'] = false;
					}
					this.suip = this.sui;
					this.sui++;
					this.su[ this.sui-1 ]['_f'] = true;
					this.dofocusdown( this.sui );
				}
			}else{
				this.vsearch();
			}
		},
		dofocusdown: function(v ){
			if( this.sui > 3 ){
				var sui = this.sui-3;
				//console.log( this.$refs);
				this.$refs[ "su"+sui ][0].scrollIntoView();
				//console.log( "su"+sui );
				//console.log( this.$refs[ "su"+sui ][0] );
			}		
		},
		dofocusup: function(v ){
			if( this.sui > 3 ){
				var sui = this.sui-3;
				//console.log( this.$refs);
				this.$refs[ "su"+sui ][0].scrollIntoView();
				//console.log( "su"+sui );
				//console.log( this.$refs[ "su"+sui ][0] );
			}else{
				this.$refs[ "su0" ][0].scrollIntoView();
			}
		},
		vsearch: function(){
			if( this.vshow_keyword != this.vkeyword && this.vkeyword != "" ){
				this.show_list();
				this.dosearch();
			}else if( this.voptions["default_list"].length ){
				this.show_list();
			}
		},
		venter: function(){
		},
		vleave: function(){
		},
		prepare_list: function( vnewdata ){
			var vsearch_field = this.voptions["data"]["search_field"];
			if( this.voptions["data"]["unique_field"] ){
				var vu = this.voptions["data"]["unique_field"];
			}else{
				var vu = this.voptions["data"]["search_field"];
			}
			for( i in vnewdata ){
				v = vnewdata[i];
				if( v.hasOwnProperty( vu ) && v.hasOwnProperty( this.voptions["data"]["search_field"] ) ){
					if( this.vlist_keys.hasOwnProperty( v[ vu ] ) == false ){
						this.vlist.push( v );
						this.vlist_keys[ v[ vu ] ] =1;
					}
				}else{
					console.log("autosuggest-simple-value does not match schema");
					console.log( this.voptions["data"]["search_field"] + " " + vu );
					console.log( JSON.stringify(v) );
					console.log( v.hasOwnProperty("id") );
					console.log( v.hasOwnProperty("city") );
				}
			}
			console.log( "vdata added: " + this.vlist.length );
			for(i=0;i<this.vlist.length;i++){
				for(i=0;i<this.vlist.length-1;i++){
					if( this.vlist[i][ vsearch_field ] > this.vlist[i+1][ vsearch_field ] ){
						t = this.vlist[i];
						this.vlist[i] = this.vlist[i+1];
						this.vlist[i+1] =t;
					}
				}
			}
			this.show_list();
		},
		show_list: function(){
			var vsearch_field = this.voptions["data"]["search_field"];
			this.vshow_keyword = this.vkeyword;
			var vsu = [];
			this.sui = 0;
			l = this.vkeyword.length;
			if( l || this.voptions["default_list"].length ){
				vk = this.vkeyword.toLowerCase();
				cnt = 0;
				vreg = new RegExp("^"+vk, "i");
				for( i in this.vlist ){
					v = this.vlist[i];
					vi = v[ vsearch_field ];
					if( vi.substr(0,l).toLowerCase() == vk ){
						vs = vi.match( vreg );
						if( vs != null ){
							vkk = vi.replace( vs[0], "<span>" + vs[0] + "</span>" );
						}else{
							vkk = vi;
						}
						v[ "_v" ] = vkk;
						v["_f"] = false; 
						vsu.push( this.copyit(v) );
						cnt++;
						if( cnt>50){break;}
					}  
				}
			}
			this.su = vsu;
		},
		dosearch: function(){
			if( this.voptions.hasOwnProperty("api_url") ){

			if( this.voptions.hasOwnProperty("api_method") == false || this.voptions.hasOwnProperty("api_params") == false ){
				console.log("simple auto suggest api details missing");
			}else{

			var vdata = this.copyit(this.voptions["api_params"]);
			for( i in vdata ){
				if( vdata[i] == "#SEARCH_KEYWORD#" ){
					vdata[i] = this.vkeyword;
				}
			}
			//this.vajax_url = document.location.href;
			if( this.vcalled == false && this.vkeyword !="" ){
				if( this.vlist_loaded.hasOwnProperty( this.vkeyword ) == false ){
					this.vcalled_keyword = this.vkeyword;
					this.vcalled = true;
					if( this.voptions['api_method'] == "GET" ){
						var qs =[];
						for( i in vdata ){
							qs.push(i+"="+encodeURIComponent(vdata[i]) );
						}
						var qss = qs.join("&");
						var vurl = this.voptions["api_url"];
						if( vurl.indexOf("?") == -1 ){
							vurl = vurl + "?" + qss;
						}else{
							vurl = vurl + "&" + qss;
						}
						axios.get(vurl).then(response => {
							this.vcalled = false;
							this.vlist_loaded[ this.vcalled_keyword ] = 1;
							this.prepare_list(response.data['data']);
						});
					}else{
						if( this.voptions["api_content-type"] == "json"){
							axios.post(this.voptions["api_url"],vdata)
							     .then(response => {
								this.vcalled = false;
								this.vlist_loaded[ this.vcalled_keyword ] = 1;
								this.prepare_list( response.data['data'] );
							});
						}else{
							var qs =[];
							for( i in vdata ){
								qs.push(i+"="+encodeURIComponent(vdata[i]) );
							}
							var qss = qs.join("&");
							axios.post(this.voptions["api_url"],qss,{'headers':{'content-type':'application/x-www-form-urlencoded' } } )
							     .then(response => {
								this.vcalled = false;
								this.vlist_loaded[ this.vcalled_keyword ] = 1;
								this.prepare_list( response.data['data'] );
							});
						}
					}
				}else{
					this.prepare_list();
				}
			}
			
			}
			}
		}
	},
	template: `
	<div style=" width:100%; z-index:1;" >
		<div class="vasm_itm" v-for="v,i in vselected" ><span class='kk' v-on:click="delete_item(i)" >&#9747;</span><span class="kv" >{{ v[ voptions['data']['search_field'] ] }}</span></div>
		<div class="vasm_t" v-on:click="showit" ><span class='kk' v-html="varrow" ></span><span class="kv" v-html="vselected_html"></span></div>
		<div class="vasm_p" style="position:absolute;  background-color:white; z-index:5000; min-height:100px;" v-show="vshow" >
			<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="30" viewBox="0 0 50 50" style="fill:#000000; position:absolute; padding:2px; "><path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path></svg>
			<input ref="suu" class="vasm_tt" type="text" v-model="vkeyword" v-on:keyup="vtyped($event)" >
			<div style="background-color:white; max-height:250px; overflow:auto;" >
				<div v-if="voptions['data']['multi_column']==false"   v-bind:ref="'su'+i" v-bind:class="{'vasm_':true,'vasm_f':v['_f']}" v-for="v,i in su" v-html="v['_v']"  v-on:mouseenter="v['_f']=true" v-on:mouseleave="v['_f']=false" v-on:click="select_su(i)" ></div>
				<table v-if="voptions['data']['multi_column']" class='table table-sm' >
				<tr v-bind:ref="'su'+i" v-bind:class="{'vasm_':true,'vasm_f':v['_f']}" v-for="v,i in su"  v-on:mouseenter="v['_f']=true" v-on:mouseleave="v['_f']=false" v-on:click="select_su(i)" >
				<td><div class="vasm_td" v-html="v['_v']"></div></td><td v-for="z,n in voptions['data']['columns']" ><div class="vasm_td" v-html="v[n]"></div></td>
				</tr>
				</table>
			</div>
		</div>
	</div>
	`
});
//v-on:click="select_su(i)"