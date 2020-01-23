document.write(`<style>
.vauto5t { border: 1px solid #cdcdcd; border-radius:2px; cursor:pointer;}
.vauto5t .kv { display:block; padding:2px 5px; }
.vauto5t .kk { width:30px; text-align:center; float:right; padding:2px 5px; border-left:1px solid #f0f0f0; background-color:#f8f8f8; font-weight:bold; }
.vauto5tt { padding:2px 5px; width:100%; padding-left:20px; border: 1px solid #cdcdcd; border-radius:2px; }
.vauto5{ padding:2px 5px; border-bottom:1px solid #cdcdcd; cursor:pointer; }
.vauto5 span{ color:red;}
.vauto5f{ background-color:#f0f0f0; border-bottom:1px solid orange; }
.vauto5p {background-color:white; border:1px solid #cdcdcd; width:inherit;}
</style>`);
Vue.component('colselect', {
	data: function(){
		return {
			"field_name": "",
			"vajax_url": document.location.href,
			"new_collection_url": "/?action=create_new_collection",
			"vkeyword": "",
			"other_option": false,
			"vselected": {},
			"vselected_data":{},
			"vselected_html": "Select Collection",
			"vcalled": false,
			"vcalled_keyword": "",
			"vshow_keyword": "",
			"vlist_loaded": {},
			"vlist": {},
			"vshow": false,
			"su": [],
			"sui": 0,
			"suip": 0,
			"search_key": "name",
			"vclass": "vauto5",
			"varrow": "&or;"
		}
	},
	watch: {
		vkeyword: function(){
			//console.log(this.vkeyword);
			this.vsearch();
		}
	},
	props: ['field_name'],
	mounted: function(){
		/*console.log( "autosuggest Mounted" );
		console.log( this.vlist_loaded );*/
	},
	methods: {
		showit: function(){
			if( this.vshow == false ){
				this.vshow = true;
				this.varrow= "&and;";
				//setTimeout(function(v){ console.log( v.$refs ); v.$refs.suu[0].focus();},500,this);
				this.$nextTick(() => this.$refs["suu"].focus());
			}else{
				this.vshow = false;
				this.varrow= "&or;";
			}
		},
		select_su: function(v,i){
			this.vselected = this.vlist[ v.id ];
			this.vkeyword = "";
			this.vselected_html = this.vlist[ v.id ][ this.search_key ];
			this.hideit();
			this.inform_parent(this.vselected);
		},
		inform_parent: function(){
			this.$emit("selected", this.vselected);
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
				this.dosearch();
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
				vi = this.vlist[i][ this.search_key ];
				if( vi.substr(0,l).toLowerCase() == vk ){
					vs = vi.match( vreg );
					if( vs != null ){
						vkk = vi.replace( vs[0], "<span>" + vs[0] + "</span>" );
					}else{
						vkk = vi;
					}
					vsu.push( {"v": vkk, "id": v['id'], "f": false } );
					cnt++;
					if( cnt>50){break;}
				}  
			}
			this.su = vsu;
			if( this.su.length < 5 ){
				this.other_option = true;
			}else{
				this.other_option = false;
			}
		},
		dosearch: function(){
			this.vajax_url = "/apis/get_browse_add.php";
			vajax_data = {"action": "get_collections","key": this.vkeyword}
			//this.vajax_url = document.location.href;
			if( this.vcalled == false ){
				if( this.vlist_loaded.hasOwnProperty( this.vkeyword ) == false ){
					this.vcalled_keyword = this.vkeyword;
					this.vcalled = true;
					axios.post(this.vajax_url,vajax_data)
					     .then(response => {
						this.vcalled = false;
						this.vlist_loaded[ this.vcalled_keyword ] = 1;
						for( i in response.data['data'] ){
							v = response.data['data'][i];
							this.vlist[ v['id'] ] = v;
						}
						//console.log( JSON.stringify(this.vlist,null,4) );
						this.prepare_list();
					});
				}else{
					this.prepare_list();
				}
			}
		}
	},
	template: `
	<div style=" width:100%; z-index:1;" >
		<div class="vauto5t" v-on:click="showit" ><span class='kk' v-html="varrow" ></span><span class="kv" v-html="vselected_html"></span></div>
		<div class="vauto5p" style="position:absolute;  background-color:white; z-index:5000; min-height:100px;" v-show="vshow" >
			<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="30" viewBox="0 0 50 50" style="fill:#000000; position:absolute; padding:2px; "><path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path></svg>
			<input ref="suu" class="vauto5tt" type="text" v-model="vkeyword" v-on:keyup="vtyped($event)" >
			<div style="background-color:white; max-height:250px; overflow:auto;" >
				<div v-bind:ref="'su'+i" v-bind:class="{'vauto5':true,'vauto5f':v['f']}" v-for="v,i in su" v-html="v['v']"  v-on:mouseenter="v['f']=true" v-on:mouseleave="v['f']=false" v-on:click="select_su(v,i)" ></div>
				<div v-if="other_option" >
					<a target="_blank" v-bind:href="new_collection_url">Click here to create new collection</a>
				</div>
			</div>
		</div>
	</div>
	`
});
//v-on:click="select_su(i)"