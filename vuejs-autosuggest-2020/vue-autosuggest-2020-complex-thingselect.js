document.write(`<style>
.vauto5t { border: 1px solid #cdcdcd; border-radius:2px; cursor:pointer;}
.vauto5t .kv { display:block; padding:2px 5px; }
.vauto5t .kk { width:30px; text-align:center; float:right; padding:2px 5px; border-left:1px solid #f0f0f0; background-color:#f8f8f8; font-weight:bold; }
.vauto5t .kkk { width:30px; text-align:center; float:right; padding:2px 5px; border-left:1px solid #f0f0f0; background-color:#ffaa77; font-weight:bold; color:black; }
.vauto5tt { padding:2px 5px; width:100%; padding-left:20px; border: 1px solid #cdcdcd; border-radius:2px; }
.vauto5{ padding:2px 5px; border-bottom:1px solid #e0e0e0; cursor:pointer; }
.vauto5 span{ color:red;}
.vauto5f{ background-color:#f0f0f0; border-bottom:1px solid orange; }
.vauto5p {background-color:white; border:1px solid #cdcdcd; width:inherit; box-shadow:2px 2px 2px #99bb99; }

.vauto5col {padding:2px 5px; border:1px solid #cdcdcd; border-radius:2px; cursor:pointer; margin-bottom:2px; background-color:white;}
.vauto5col:hover { background-color:#f0f0f0; }

</style>`);
Vue.component('thingselect', {
	data: function(){
		return {
                	"col"			: "",
                	"main_col"		: "",
			"vselected"		: {},
			"vselected_data"	: {},
			"field"			: {},
			"vajax_url"		: document.location.href,
			"vkeyword"		: "",
			"other_option"		: false,
			"vself_referral"	: false,
			"vselected_html"	: "Select Thing",
			"vcalled"		: false,
			"vcalled_keyword"	: "",
			"vshow_keyword"		: "",
			"vlist_loaded"		: {},
			"vlist"			: {},
			"vshow"			: false,
			"su"			: [],
			"sui"			: 0,
			"suip"			: 0,
			"search_field"		: "key",
			"vclass"		: "vauto5",
			"varrow"		: "&or;",
			"strict"		: false,
		}
	},
	template: `
	<div style=" width:100%; z-index:1;" >
		<div class="vauto5t" v-on:click="showit" ><span class='kk' v-html="varrow" ></span><span v-if="vselected['cid']" class='kkk' v-on:click="unselect" >&#9747;</span><span class="kv" v-html="vselected_html"></span></div>
		<div class="vauto5p" style="position:absolute;  background-color:white; z-index:5000; min-height:100px;" v-show="vshow"  v-on:mouseleave="closepop" >
			<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="30" viewBox="0 0 50 50" style="fill:#000000; position:absolute; padding:2px; "><path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path></svg>
			<input ref="suu" class="vauto5tt" type="text" v-model="vkeyword" v-on:keyup="vtyped($event)" >
			<div style="background-color:white; max-height:250px; overflow:auto;" >
				<div v-bind:ref="'su'+i" v-bind:class="{'vauto5':true,'vauto5f':v['f']}" v-for="v,i in su" v-html="v['v']" v-on:click="select_su(v)" v-on:mouseenter="v['f']=true" v-on:mouseleave="v['f']=false" ></div>
				<div v-if="other_option" style="padding:10px;" >
					<div class="mb-2">Add item in collection: </div>
					<div class="vauto5col" v-for="c,i in field['i_of']" v-on:click='select_col(c)' >
						<span v-if="c['selected']" class='kkk' >&#9747;</span>
						<span class="kv" v-html="c['v']"></span>
					</div>
					<div v-show='!vself_referral'>
						<div class="mb-2">Find other collection: </div>
						<colselect v-model="col" v-bind:field_name="field['n']" v-on:selected="select_col2" ></colselect>
						<div>&nbsp;-</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	`,
	watch: {
		vkeyword: function(){
			this.vsearch();
		}
	},
	props: ['vajax_url','field','vselected_data','main_col'],
	mounted: function(){
		console.log(this.main_col);
		//console.log( "autosuggest Mounted: " + this.field['n'] );
		this.Update_Data_format();
		if(this.field["mtx"] == "yes"){
			this.vself_referral = true;
		}
		//this.dosearch();
		//console.log( this.vlist_loaded );
		//console.log( JSON.stringify(this.field,null,5) );
	},
	methods: {
		showit: function(){
			if( this.vshow == false ){
				this.vshow = true;
				if( this.vselected.hasOwnProperty("id") ){
					this.varrow= "&and;";
				}else{
					this.varrow= "&and;";
				}
				//setTimeout(function(v){ console.log( v.$refs ); v.$refs.suu[0].focus();},500,this);
				this.$nextTick(() => this.$refs["suu"].focus());
			}else{
				this.vshow = false;
				this.varrow= "&or;";
			}
		},
		unselect: function(){
			this.vselected = {};
			this.vkeyword = "";
			this.hideit();
			this.vselected_html = "&nbsp;-";
			this.inform_parent();
		},
		ucwords: function( v ){
			str = v.toLowerCase();
			return v.replace( /(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, function(s){ return s.toUpperCase(); } );
		},
		select_col: function( c ){
			console.log( "selected existng collection: " + JSON.stringify(c,null,4) );
			this.select_coll( c['v'], c['_id'] );
		},
		select_col2: function( c ){
			//console.log( "selected new collection sub auto suggest: " + JSON.stringify(c,null,4) );
			this.select_coll( c['name'], v['id'] );
			this.field['i_of'][ v['id'] ] = {
		               "v": c['name'],
		               "_id": c['id'],				
			}
		},
		select_coll: function( col_name, col_id ){
			this.vkeyword = this.ucwords(this.vkeyword);
			this.vselected = {
				"t":"r",  // type
				"key":this.vkeyword,  // permuted key
				"mkey":this.vkeyword, // main key
				"c": col_name, // col name
				"col": col_id,  // col thing
				"cid": "new",  //record id
			};
			//console.log(this.vselected);
			this.vselected_html = "<a taget=\"_blank\" href=\""+this.getlink()+"\" >" + this.vkeyword + "</a> in " + col_name;
			this.vkeyword = "";
			this.hideit();
			this.inform_parent();		
		},
		select_su: function( v ){
			if( v != undefined ){
				this.vselected = this.vlist[ v.id ];
				//console.log("Selected Item: " + JSON.stringify(this.vselected,null,4) );
				this.vkeyword = "";
				try{
					this.vselected_html = "<a taget=\"_blank\" href=\""+this.getlink()+"\" >" + this.vselected['key'] + "</a> in " + this.vselected['c'];
				}catch(e){
					console.log("Error select su: " + v.id);
				}
				this.hideit();
			}
			this.inform_parent();
		},
		selected_Data_Update : function(){
			p = {
				v 	: this.vselected['mkey'],
				_id	: this.vselected['cid'],
				i_of 	: this.vselected['col'],
				i_of_v	: this.vselected['c']
			};

			this.vselected_data = {};
			this.vselected_data = p;
		},
		Update_Data_format : function(){
			this.vkeyword = "";
			this.vselected = {};
			if(this.vselected_data["_id"] != "new" && this.vselected_data["_id"] != undefined){
				p = {
					"t"	:	"r",				// type
					"key"	:	this.vselected_data['v'],  	// permuted key
					"mkey"	:	this.vselected_data['v'], 	// main key
					"c"	: 	this.vselected_data["i_of_v"],	// col name
					"col"	:	this.vselected_data["i_of"],  	// col id
					"cid"	:	this.vselected_data['_id'],  	//record id
				};
				this.vselected = p;
				this.vkeyword = this.vselected_data['v'];
				this.vselected_html = "<a taget=\"_blank\" href=\""+this.getlink()+"\" >" + this.vkeyword + "</a> in " + this.vselected_data['i_of_v'];
			}
			
		},
		inform_parent: function(){
			this.selected_Data_Update();
			this.$emit("selected", this.vselected_data, this.field['n'] );
		},
		hideit: function(){
			this.vshow=false;
			this.sui = 0;
			this.suip = 0;
			this.su = [];
			this.varrow= "&or;";
		},
		vtyped: function(event){
			this.vsearch();
			if( event.keyCode == 13  || event.keyCode == 10 ){ // up
				if( this.sui > 0 ){
					this.select_su( this.su[ this.sui-1 ] );
				}else{
					
				}
			}
			if( event.keyCode == 37  || event.keyCode == 38 ){ // up
				if( this.sui > 0 ){
					this.su[ this.sui-1 ]['f'] = false;
					this.suip = this.sui;
					this.sui--;
					this.su[ this.sui-1 ]['f'] = true;
					this.dofocusup( this.sui );
				}
			}
			if( event.keyCode == 39 || event.keyCode == 40 ){ // down
				if( this.sui < this.su.length ){
					if( this.sui > 0 ){
						this.su[ this.sui-1 ]['f'] = false;
					}
					this.suip = this.sui;
					this.sui++;
					this.su[ this.sui-1 ]['f'] = true;
					this.dofocusdown( this.sui );
				}
			}
		},
		dofocusdown: function(v ){
			if( this.sui > 3 ){
				var sui = this.sui-3;
				this.$refs[ "su"+sui ][0].scrollIntoView();
			}		
		},
		dofocusup: function(v ){
			if( this.sui > 3 ){
				var sui = this.sui-3;
				this.$refs[ "su"+sui ][0].scrollIntoView();
			}else{
				this.$refs[ "su0" ][0].scrollIntoView();
			}
		},
		vsearch: function(){
			if( this.vshow_keyword != this.vkeyword && this.vkeyword != "" ){
				this.dosearch();
			}else{
				if( this.vkeyword == "" ){
					this.su = [];
				}
				if( this.su.length < 5 && this.vkeyword != "" ){
					if( this.strict == false ){
					this.other_option = true;
					}
				}else{
					this.other_option = false;
				}
			}
		},
		venter: function(){
		},
		vleave: function(){
		},
		prepare_list: function(){
			this.vshow_keyword = this.vkeyword;
			var vsu = [];
			this.sui = 0;
			l = this.vkeyword.length;
			vk = this.vkeyword.toLowerCase();
			cnt = 0;
			vreg = new RegExp("^"+vk, "i");
			for( i in this.vlist ){
				v = this.vlist[i];
				vi = this.vlist[i][ this.search_field ];
				if( vi.substr(0,l).toLowerCase() == vk ){
					vs = vi.match( vreg );
					if( vs != null ){
						vkk = vi.replace( vs[0], "<span>" + vs[0] + "</span>" );
					}else{
						vkk = vi;
					}
					vkk = vkk + " in " + v["c"];
					vsu.push( {"v": vkk, "id": v['cid'], "f": false } );
					cnt++;
					if( cnt>50){break;}
				}  
			}
			this.su = vsu;
			if( this.su.length < 5 && this.vkeyword != "" ){
				if( this.strict == false ){
				this.other_option = true;
				}
			}else{
				this.other_option = false;
			}
		},
		dosearch: function(){
			this.vajax_url = document.location.href;
			//this.vajax_url = "/apis/get_browse_add.php";
			vajax_data = {"action": "search","key": this.vkeyword}
			if(this.vself_referral){
				vajax_data["thing"] = this.main_col;
			}
			//console.log(vajax_data);
			if( this.vcalled == false ){
				if( this.vlist_loaded.hasOwnProperty( this.vkeyword ) == false ){
					this.vcalled_keyword = this.vkeyword;
					this.vcalled = true;
					axios.post(this.vajax_url,vajax_data ).then(response => {
						this.vcalled = false;
						this.vlist_loaded[ this.vcalled_keyword ] = 1;
						for( i in response.data['data'] ){
							v = response.data['data'][i];
							this.vlist[ v['cid'] ] = v;
						}
						//console.log(this.vlist);
						this.prepare_list();
					});
				}else{
					this.prepare_list();
				}
			}
		},
		getlink: function(){
			v = this.vselected;
			vd = v['c'].replace(/\W+/,'');
			vurl = '/browse/'+v['col']+'/'+vd+'/'+v['cid'];
			return vurl;
		},
		closepop: function(){
		//	setTimeout(function(v){v.vshow=false;},1000,this);
		}		
	},

});