document.write("<style>\
	.modal_class{position: fixed;top:0px;right: 0;left: 0;bottom: 0;background-color: rgba(0,0,0,0.5);z-index:111}\
	</style>");
function table_static(target_vid,vlist){
	target_id = "table_"+target_vid;
	table_app = new Vue({
		el	: '#'+target_id,
	    	data	:{
	    		Fields			: ((vlist["fields"])    ? vlist["fields"] : []),
	    		Name			: ((vlist["Name"])   	? vlist["Name"] : []),
	    		ShowAdd			: ((vlist["ShowAdd"])   ? vlist["ShowAdd"] : false),
	    		ShowEdit		: ((vlist["ShowEdit"])  ? vlist["ShowEdit"] : false),
	    		ShowDelete		: ((vlist["ShowDelete"])? vlist["ShowDelete"] : false),
	    		Insert_Action_Name	: ((vlist["insert_action"])? vlist["insert_action"] : ""),
	    		delete_action		: ((vlist["delete_action"])? vlist["delete_action"] : ""),
	    		delete_action_type	: ((vlist["delete_action_type"])? vlist["delete_action_type"] : "no"),
	    		TotalRecords 		: 0,
			Start 			: 0,
			End 			: 0,
			currentPage 		: 1,
			PerPage 		: 10,
			totalPages 		: 1,
			showPrev		: "",
			showNext		: "",
			DisplayRecords 		: [],
			vueapps 		: [],
			Fields_cnt 		: ((vlist["fields"])?((Object.keys(vlist["fields"]).length)+1): 0),
			successMsg		: "",
			errorMsg		: "",
			showAddModal		: false,
			showEditModal		: false,
			showDeleteModal		: false,
			Heading 		: "",
			Records			: ((vlist["Records"])  ? vlist["Records"] : []),
			NewRecord		: {},
			currentRecord		: {},
			page 			: vlist["page"],
			page_action 		: vlist["page_action"],
			ColThing		: vlist["Thing"],
			ColField 		: target_vid,
			Rec_Id 			: vlist["Rec_Id"],
			Sub_Rec_Id 		: "",
	    	},
	    	template: `<div class="card mt-2">
				<div class="card-body">
					<div class="row">
						<div class="col-lg-6">{{Name}}</div>
						<div class="col-lg-6">
							<button v-on:click="show_add_modal" type="button" v-if="ShowAdd" class="btn btn-sm btn-info float-right">Add</button>
						</div>
					</div>
					<div class="row p-2">
						<div class="col-6">
							<div v-if="TotalRecords > 10">Displaying: {{Start}} to {{End}} of {{TotalRecords}}</div>
						</div>
						<div class="col-6">
							<button v-on:click="get_page('next')" v-if="showNext" class="btn btn-sm btn-primary float-right ml-2">Next</button>
							<button v-on:click="get_page('prev')" v-if="showPrev" class="btn btn-sm btn-primary float-right ml-2">Prev</button>
						</div>
					</div>
					<div class="table-responsive m-2">
						<table class="table table-striped table-bordered  table-sm">
							<thead>
								<tr>
									<th class="table-light" v-for="field in Fields">{{field.d}}</th>
									<th class="table-light" v-if='ShowAdd'>Action</th>
								</tr>
							</thead>
							<tbody>
								<tr v-if="TotalRecords==0">
									<td :colspan="Fields_cnt" align="center">No data available</td>
								</tr>
								<tr v-for="record in DisplayRecords">
									<td v-for="field in Fields">
										<div v-if="record[field.n] != undefined" v-html="LoadRecordData(record[field.n]['d'],record[field.n]['d_t'],record['initial_id'],field.n)"></div>
										<div v-else>-</div>
									</td> 
									<td v-if="ShowAdd">
										<div v-if="page=='edit'">
											<a :href="'/browse/'+ColThing+'/edit/'+Rec_Id+'/#'+ColField" class="btn btn-sm btn-secondary"><i class="fa fa-edit"></i></i></a> | 
											<a :href="'/browse/'+ColThing+'/edit/'+Rec_Id+'/#'+ColField" class="btn btn-sm btn-secondary"><i class="fa fa-trash"></i></a>
										</div>
										<div v-else>
											<a :href="'#'+ColField" class="btn btn-sm btn-secondary" v-on:click="show_edit_modal(record.initial_id)"><i class="fa fa-edit"></i></i></a> | 
											<a :href="'#'+ColField" class="btn btn-sm btn-secondary" v-on:click="show_delete_modal(record.initial_id)"><i class="fa fa-trash"></i></a>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="modal_class" v-if="showDeleteModal">
						<div class="modal-dialog" role="document">
							<div class="modal-content">
								<div class="modal-body pt-4">
									<button type="button" class="close" @click="showDeleteModal=false">
										<span aria-hidden="true">&times;</span>
									</button>
									<h4>Are you sure to delete this record?</h4><p>&nbsp;</p>
									<div>
										<button class="btn btn-sm btn-outline-secondary float-right ml-3" @click="showDeleteModal=false">Cancel</button>
										<button class="btn btn-sm btn-primary float-right ml-3"  @click="delete_record">&nbsp;&nbsp;&nbsp;&nbsp;Ok&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="modal_class" v-if="showAddModal">
						<div class="modal-dialog modal-lg" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title">{{Heading}}</h5>
									<button type="button" class="close" v-on:click="hide_edit_modal">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div class="modal-body pt-4">
									<div v-for="field in Fields" class="form-group row p-1">
										<div class="col-4">{{field.d}}</div>
										<div class="col-7">
											<div v-if="field.f_t == 'string'">
												<div v-if="field.v_t == 's'">
													<input type="text" class="form-control form-control-sm ml-1"  autocomplete='off' :placeholder="'Please Enter ' +field.d" v-model="currentRecord[field.n]" v-on:blur="check_data(field.n)" style="width: 91%">
												</div>
												<div v-else>
													<table cellpadding="5" cellspacing="5">
														<tr  v-for="i in field.count">
															<td><input type="text" :ref="'fields_'+i+'_'+field.n"  class="form-control form-control-sm"  autocomplete='off' :placeholder="'Please Enter ' +field.d" v-model="currentRecord[field.n][i]" v-on:blur="check_data(field.n,i)"></td>
															<td  width="5%" align="center">
																<button v-if="i != field.count " type="button" v-on:click="Remove_Data(field.n,i)" class='btn btn-sm btn-danger'>&times;</button>
																<input   v-if="field['count'] < field['v_t_l'] && i== field['count']" type="button" value="+" v-on:click="get_fields(field.n)"  class='btn btn-primary btn-sm' >
															</td>
														</tr>
													</table>
												</div>
											</div>
											<div v-else-if="field.f_t == 'int' || field.f_t == 'float'" >
												<div v-if="field.v_t == 's'">
													<input type="number" class="form-control form-control-sm ml-1"  autocomplete='off' :placeholder="'Please Enter ' +field.d" v-model="currentRecord[field.n]" v-on:blur="check_data(field.n)" style="width: 92%">
												</div>
												<div v-else>
													<table cellpadding="5" cellspacing="5">
														<tr  v-for="i in field.count">
															<td><input type="number" :ref="'fields_'+i+'_'+field.n"  class="form-control form-control-sm"  autocomplete='off' :placeholder="'Please Enter ' +field.d" v-model="currentRecord[field.n][i]" v-on:blur="check_data(field.n,i)"></td>
															<td  width="5%" align="center">
																<button v-if="i != field.count " type="button" v-on:click="Remove_Data(field.n,i)" class='btn btn-sm btn-danger'>&times;</button>
																<input   v-if="field['count'] < field['v_t_l'] && i== field['count']" type="button" value="+" v-on:click="get_fields(field.n)"  class='btn btn-primary btn-sm' >
															</td>
														</tr>
													</table>
												</div>
											</div>
											<div v-else-if="field.f_t == 'boolean'" >
												<div v-if="field.v_t == 's'">
													<input type="radio" :id="'fields_'+field.n+'_yes'" v-on:change="update_boolean(field.n,'yes')" value="yes" v-model="currentRecord[field.n]">
													<label :for="'fields_'+field.n+'_yes'">Yes</label>
													<br>
													<input type="radio" :id="'fields_'+field.n+'_no'" v-on:change="update_boolean(field.n,'no')" value="no" v-model="currentRecord[field.n]">
													<label :for="'fields_'+field.n+'_no'">No</label>
												</div>
												<div v-else>
													<table cellpadding="5" cellspacing="5">
														<tr  v-for="i in field.count">
															<td><input type="radio" :name="'fields['+field.n+']['+i+']'" v-on:change="check_data(field.n)" v-model="currentRecord[field.n][i]" :id="'fields_'+i+'_'+field.n+'_yes'" value="yes" ><label :for="'fields_'+i+'_'+field.n+'_yes'"> YES </label></td>
															<td><input type="radio" :name="'fields['+field.n+']['+i+']'" v-on:change="check_data(field.n)" v-model="currentRecord[field.n][i]" :id="'fields_'+i+'_'+field.n+'_no'" value="no" ><label :for="'fields_'+i+'_'+field.n+'_no'"> NO </label></td>
															<td  width="5%" align="center">
																<button v-if="i != field.count " type="button" v-on:click="Remove_Data(field.n,i)" class='btn btn-sm btn-danger'>&times;</button>
																<input   v-if="field['count'] < field['v_t_l'] && i== field['count']" type="button" value="+" v-on:click="get_fields(field.n)"  class='btn btn-primary btn-sm' >
															</td>
														</tr>
													</table>
												</div>
											</div>
											<div v-else-if=" field.f_t == 'text' || field.f_t == 'textarea' || field.f_t == 'blob'" >
												<div v-if="field.v_t == 's'">
													<textarea class="form-control form-control-sm ml-1"  autocomplete='off' :placeholder="'Please Enter ' +field.d" v-model="currentRecord[field.n]" v-on:change="check_data(field.n)" style="width: 92%"></textarea>
												</div>
												<div v-else>
													<table cellpadding="5" cellspacing="5" width="100%">
														<tr  v-for="i in field.count">
															<td><textarea :ref="'fields_'+i+'_'+field.n"  class="form-control form-control-sm"  autocomplete='off' :placeholder="'Please Enter ' +field.d" v-model="currentRecord[field.n][i]" v-on:blur="check_data(field.n,i)"></textarea></td>
															<td  width="5%" align="center">
																<button v-if="i != field.count " type="button" v-on:click="Remove_Data(field.n,i)" class='btn btn-sm btn-danger'>&times;</button>
																<input   v-if="field['count'] < field['v_t_l'] && i== field['count']" type="button" value="+" v-on:click="get_fields(field.n)"  class='btn btn-primary btn-sm' >
															</td>
														</tr>
													</table>
												</div>
											</div>
											<div v-else-if="field.f_t == 'collection'" >
												<div v-if="field.v_t == 's'">
													<div v-if="field.AddNewData == '' ">
														<table  style="width: 100%">
															<tr>
																<td width="90%"  valign='top'>
																	<select v-model="currentRecord[field.n]" class="form-control form-control-sm" v-on:change="update_col(field.n)">
																		<option value="">Select {{field.d}}</option>
																		<option v-for="vtype in field.specific_values" :value="vtype.id" >{{vtype.name}}</option>
																	</select>
																</td>
															</tr>
														</table>
													</div>
													<div v-else style="width:80%">
														<select v-model="currentRecord[field.n]" class="form-control form-control-sm" v-on:change="update_col(field.n)">
															<option value="">Select {{field.d}}</option>
															<option v-for="vtype in field.specific_values" :value="vtype.id" >{{vtype.name}}</option>
														</select>
													</div>
												</div>
												<div v-else>
													<select multiple="true"  v-model="currentRecord[field.n]" v-on:change="update_col(field.n)">
													    <option v-for="item in field.specific_values" :value="item.id">{{item.name}}</option>
													</select>
												</div>
											</div>
											<div v-else-if="field.f_t == 'date' || field.f_t == 'datetime' || field.f_t == 'time' || field.f_t == 'numeric'" >
												<div v-if="field.v_t == 's'">
													<input :type="field.data_type" :ref="'fields_'+field.n" class="form-control form-control-sm ml-2" style="width: 91%"  autocomplete='off'  :placeholder="'Please Enter ' +field.d"  v-model="currentRecord[field.n]" v-on:blur="check_ranges(field.n)">
												</div>
												<div v-else>
													<table cellpadding="5" cellspacing="5" width="100%">
														<tr  v-for="i in field.count">
															<td><input :type="field.data_type" :ref="'fields_'+i+'_'+field.n" class="form-control form-control-sm"  autocomplete='off' :placeholder="'Please Enter ' +field.d"  v-model="currentRecord[field.n][i]" v-on:blur="check_ranges(field.n,i)"></td>
															<td  width="5%" align="center">
																<button v-if="i != field.count " type="button" v-on:click="Remove_Data(field.n,i)" class='btn btn-sm btn-danger'>&times;</button>
																<input   v-if="field['count'] < field['v_t_l'] && i== field['count']" type="button" value="+" v-on:click="get_fields(field.n)"  class='btn btn-primary btn-sm' >
															</td>
														</tr>
													</table>
												</div>
												<small class="text-mute" v-if="field.f_list">
													<div v-if='field.f_list["max"]' class="ml-2">Note: Max Range For {{field.d}} is {{field.f_list["max"]}}</div>
													<div v-if='field.f_list["min"]' class="ml-2">Note: Min Range For {{field.d}} is {{field.f_list["min"]}}</div>
												</small>
											</div>
											<div v-else-if="field.f_t == 'date_range' || field.f_t == 'datetime_range' || field.f_t == 'time_range' || field.f_t == 'numeric_range'" >
												<div v-if="field.v_t == 's'">
													<table cellpadding=5 cellspacing=5 width="93%">
														<tr>
															<td>FROM:<input :type="field.data_type" class="form-control form-control-sm"  autocomplete='off'  :placeholder="'Please Enter ' +field.d"  v-model="currentRecord[field.n]['from']" v-on:blur="check_range_types(field.n,'from')"></td>
															<td>TO:  <input :type="field.data_type" class="form-control form-control-sm"  autocomplete='off'  :placeholder="'Please Enter ' +field.d"  v-model="currentRecord[field.n]['to']"   v-on:blur="check_range_types(field.n,'to')"></td>
														</tr>
													</table>
												</div>
												<div v-else>
													<table cellpadding="5" cellspacing="5" width="100%">
														<tr  v-for="i in field.count">
															<td>FROM:<input :type="field.data_type" :ref="'fields_'+i+'_'+field.n+'_from'" class="form-control form-control-sm"  autocomplete='off'  :placeholder="'Please Enter ' +field.d"  v-model="currentRecord[field.n][i]['from']" v-on:blur="check_range_types(field.n,'from')"></td>
															<td>TO:  <input :type="field.data_type" :ref="'fields_'+i+'_'+field.n+'_to'"   class="form-control form-control-sm"  autocomplete='off'  :placeholder="'Please Enter ' +field.d"  v-model="currentRecord[field.n][i]['to']" v-on:blur="check_range_types(field.n,'to')"></td>
															<td  width="5%" align="center" valign='bottom'>
																<button v-if="i != field.count " type="button" v-on:click="Remove_Data(field.n,i)" class='btn btn-sm btn-danger'>&times;</button>
																<input   v-if="field['count'] < field['v_t_l'] && i== field['count']" type="button" value="+" v-on:click="get_fields(field.n)"  class='btn btn-primary btn-sm' >
															</td>
														</tr>
													</table>
												</div>
												<small class="text-mute" v-if="field.f_list">
													<div v-if='field.f_list["max"][1]' class="ml-2">Note: From Max Range For {{field.d}} is {{field.f_list["max"][1]}}</div>
													<div v-if='field.f_list["min"][1]' class="ml-2">Note: From Min Range For {{field.d}} is {{field.f_list["min"][1]}}</div>
													<div v-if='field.f_list["max"][2]' class="ml-2">Note: To Max Range For   {{field.d}} is {{field.f_list["max"][2]}}</div>
													<div v-if='field.f_list["min"][2]' class="ml-2">Note: To Min Range For   {{field.d}} is {{field.f_list["min"][2]}}</div>	
												</small>
											</div>
											<div v-else-if="field.f_t == 'i_of' && field.mtx == 'yes'">
												<div v-if="field.v_t == 's'">
													<table cellpadding="5" cellspacing="5" width="93%">
														<tr>
															<td><div :id="field.keyword_box_name"></div></td>
														</tr>
													</table>
												</div>
												<div v-else>
													<table cellpadding="5" cellspacing="5">
														<tr  v-for="i in field.count">
															<td><div :id="field.keyword_box_name+'_'+i"></div></td>
															<td  width="5%" align="center">
																<button v-if="i != field.count " type="button" v-on:click="Remove_Data(field.n,i)" class='btn btn-sm btn-danger'>&times;</button>
																<input   v-if="field['count'] < field['v_t_l'] && i== field['count']" type="button" value="+" v-on:click="get_fields(field.n)"  class='btn btn-primary btn-sm' >
															</td>
														</tr>
													</table>
												</div>
											</div>
											<div v-else-if="field.f_t == 'i_of' && field.mtx != 'yes'">
												<div v-if="field.v_t == 's'">
													<table cellpadding="5" cellspacing="5" width="93%">
														<tr>
															<td><div :id="field.col_box_name"></div></td>
															<td><div :id="field.keyword_box_name"></div></td>
															<td>
																<button type="button" v-if="currentRecord[field.n]['id'] == '-new-item-'" class="btn btn-sm btn-primary" v-on:click="save_instance_of(field.n)">Save</button>
															</td>
														</tr>
													</table>
												</div>
												<div v-else>
													<table cellpadding="5" cellspacing="5" width="100%">
														<tr  v-for="i in field.count">
															<td><div :id="field.col_box_name+'_'+i"></div></td>
															<td><div :id="field.keyword_box_name+'_'+i"></div></td>
															<td width="5%" align="center">
																<button v-if="i != field.count " type="button" v-on:click="Remove_Data(field.n,i)" class='btn btn-sm btn-danger'>&times;</button>
																<input  v-if="field['count'] < field['v_t_l'] && i== field['count']" type="button" value="+" v-on:click="get_fields(field.n)"  class='btn btn-primary btn-sm' >
															</td>
														</tr>
													</table>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>`,
		beforeMount(){
			this.initialize();
		},	
		methods :{
			initialize(){
				/*if(this.ShowAdd){
					if(target_vid == vlist["page2"]){
						console.log(target_vid+"=="+vlist["page2"])
						if(this.page_action == "add"){
							this.show_add_modal();
						}else if(this.page_action == "edit"){
							this.show_edit_modal();
						}else if(this.page_action == "delete"){
							this.show_delete_modal();
						}
					}
				}*/
				this.Update_Records_list();
			},
			Update_Records_list(){
				this.TotalRecords = (Object.keys(this.Records).length);
				this.totalPages =  Math.ceil(this.TotalRecords/this.PerPage);
				vrec = [];
				for( i in this.Records){
					this.Records[i]["initial_id"] = i;
					vrec.push(this.Records[i]);
				}
				this.DisplayRecords = vrec.slice( ( (this.currentPage-1)* this.PerPage) ,( (this.currentPage)* this.PerPage));
			},
			showbtn(){
				if(this.currentPage != 1){
					this.showPrev = true;
				}else{
					this.showPrev = false;
				}
				if( this.currentPage !=  this.totalPages && this.totalPages > 1 ){
					this.showNext = true;
				}else{
					this.showNext = false;	
				}
				this.start = ( (this.currentPage-1) * this.PerPage)+1;
				if( (this.start + this.PerPage) > this.TotalRecords ){
					this.end = this.TotalRecords;
				}else{
					this.end = this.start + this.PerPage-1;
				}
			},
			get_page(vpage){
				if( vpage == "next" ){
					this.currentPage = this.currentPage + 1;
					if( this.currentPage !=  this.totalPages && this.totalPages > 1 ){
						this.showNext = true;
					}else{
						this.showNext = false;	
					}
				}else{
					this.currentPage = this.currentPage - 1;
					if(this.currentPage != 1){
						this.showPrev = true;
					}else{

						this.showPrev = false;
					}
				}
				this.initialize();
			},
			show_delete_modal(vid){
				this.Sub_Rec_Id =  vid;
				this.showDeleteModal = true;
			},
			delete_record(){

				if(this.delete_action_type == "no"&& this.Sub_Rec_Id && this.delete_action ){
					vurl="?";
	 				myrecords = {}; 
					myrecords = {
						key		: this.ColThing,
						key_field 	: this.ColField,
						key_id 		: this.Rec_Id,
						sub_key_id 	: this.Sub_Rec_Id,
					};
					vdata = JSON.stringify(myrecords);
					vpostdata="action="+this.delete_action+"&data="+encodeURIComponent(vdata);
					post_request_json(vurl,vpostdata,this.InsertData_Response);
				}else if( this.delete_action_type == "yes" && this.delete_action && this.Sub_Rec_Id){
					vurl="?";
	 				myrecords = {}; 
					myrecords = {
						key		: this.ColThing,
						key_field 	: this.ColField,
						key_id 		: this.Rec_Id,
						sub_key_id 	: this.Sub_Rec_Id,
					};
					vdata = JSON.stringify(myrecords);
					vpostdata="action=delete_table_data&data="+encodeURIComponent(vdata);
					post_request_json(vurl,vpostdata,this.InsertData_Response);
				}
			},
			hide_edit_modal(){
				this.showAddModal = false;
				this.Sub_Rec_Id = "";
				setTimeout(this.Update_hide_Modal_data,200);
			},
			Update_hide_Modal_data(){
				this.NewRecord = [];
				this.currentRecord = [];
			},
			show_add_modal(){
				this.Heading = "Adding Record in "+this.Name;
				this.showAddModal = true;
				this.selectData();
			},
			show_edit_modal(vrec_id){
				this.Heading = "Editing Record in "+this.Name;
				this.showAddModal = true;
				this.Sub_Rec_Id = vrec_id;
				this.NewRecord = this.Records[vrec_id];
				this.selectData();
			},
			selectData(){
				for( i in this.Fields){
					this.Initialize_Add_CurrentRecord(i);
				}
				setTimeout(this.Initialze_linked_autosuggest,100);
			},
			Initialize_Add_CurrentRecord(vfield){
				v = this.Fields[vfield];
				field_type = v["f_t"];
				var type = "";
				if( field_type == "date" || field_type == "datetime"  || field_type == "time"  || field_type == "numeric" || field_type == "date_range" || field_type == "datetime_range"  || field_type == "time_range"  || field_type == "numeric_range"   ){
					if( field_type == "date" || field_type == "date_range" ){
						type = "date";
					}else if( field_type == "datetime" || field_type == "datetime_range" ){
						type = "datetime-local";
					}else if(field_type == "time" || field_type == "time_range"){
						type = "time";
					}else if(field_type == "numeric" || field_type == "numeric_range"){
						type = "number";
					}
				}else if( field_type == "image_upload"){
					type = "Image";
				}else if( field_type == "document_upload"  ){
					type = "Document";
				}
				this.Initialze_fields(vfield,"data_type",type);	
				if( field_type == "numeric" && v['f_list']){
					f_list = [];
					if( v['f_list']['max'] && v['f_list']['min'] ){
						f_list['max'] = parseInt(v['f_list']['max']);
						f_list['min'] = parseInt(v['f_list']['min']);
					}else if( v['f_list']['max'] && !v['f_list']['min'] ){
						f_list['max'] = parseInt(v['f_list']['max']);
					}else if( !v['f_list']['max'] && v['f_list']['min'] ){
						f_list['min'] = parseInt(v['f_list']['min']);
					}
					this.Initialze_fields(vfield,"f_list",f_list);	
				}
				if( field_type == "numeric_range" && v['f_list']){
					f_list = [];f_list['max'] ={};f_list['min'] ={};
					f_list['max'][1] = "";
					f_list['min'][1] = "";
					f_list['max'][2] = "";
					f_list['min'][2] = "";
				 	if( v['f_list']['max'][1] && v['f_list']['min'][1] ){

						f_list['max'][1] = parseInt(v['f_list']['max'][1]);
						f_list['min'][1] = parseInt(v['f_list']['min'][1]);

					}else if( v['f_list']['max'][1] && !v['f_list']['min'][1]){

						f_list['max'][1] = parseInt(v['f_list']['max'][1]);
					
					}else if( !v['f_list']['max'][1] && v['f_list']['min'][1] ){

						f_list['min'][1] = parseInt(v['f_list']['min'][1]);
					}
					if( v['f_list']['max'][2] && v['f_list']['min'][2] ){

						f_list['max'][2] = parseInt(v['f_list']['max'][2]);
						f_list['min'][2] = parseInt(v['f_list']['min'][2]);

					}else if( v['f_list']['max'][2] && !v['f_list']['min'][2]){

						f_list['max'][2] = parseInt(v['f_list']['max'][2]);

					}else if( !v['f_list']['max'][2] && v['f_list']['min'][2]){

						f_list['min'][2] = parseInt(v['f_list']['min'][2]);

					}
					this.Initialze_fields(vfield,"f_list",f_list);	
				}
				
				if( v["v_t"] == "m" && !v["v_t_l"] ){
					this.Initialze_fields(vfield,"v_t_l",100);
				}
				if( v["f_t"] == "i_of" ){
					vrec = [];
					if(v["v_t"] == "m"){
						cnt =1;
						if( this.NewRecord && this.NewRecord[vfield] != undefined && this.NewRecord[vfield]['d'].length != 0 ){
							for(p in this.NewRecord[vfield]['d']){
								cp = this.NewRecord[vfield]['d'][p];
								vrec[cnt]  =  { name : cp["v"],"id" :cp["_id"],i_of:cp["i_of"],i_of_v:v["i_of"][cp["i_of"]]["v"]};
								cnt++;
							}
							this.Initialze_fields(vfield,"count",cnt-1);
						}else{
							vrec[cnt]  =  { name : "","id" :"",i_of:"",i_of_v:""};
							if(v["mtx"] == "yes"){
								vrec[cnt]  =  { name : "","id" :"",i_of:this.ColThing,i_of_v:this.ColName};
							}
						}
					}else{
						vrec =  { name : "","id" :"",i_of:"",i_of_v:""};
						if( this.NewRecord && this.NewRecord[vfield] != undefined && this.NewRecord[vfield]['d'].length != 0 ){
							cp   = this.NewRecord[vfield]['d'];
							vrec = { name : cp["v"],"id" :cp["_id"],i_of:cp["i_of"],i_of_v:v["i_of"][cp["i_of"]]["v"]};
						}else{
							if(v["mtx"] == "yes"){
								vrec =  { name : "","id" :"",i_of:this.ColThing,i_of_v:this.ColName};
							}
						}
					}
					this.Initialze_Data(vfield,vrec);
					console.log(this.currentRecord);
				}else if( v["f_t"] == "image_upload" || v["f_t"] == "document_upload"  ){
					this.images[v["n"]] = "";
					if(v["v_t"] == "s"){
						vrec= {"f":"","v":""};
						if( this.NewRecord && this.NewRecord[vfield] != undefined){
							c = this.NewRecord[vfield];
							vrec= {"f":c["f"],"v":c["v"]};
						}
					}else{
						vrec = [];
						cnt1 = 1;
						if( this.NewRecord && this.NewRecord[vfield]  != undefined){
							vrec = [];
							pc = 0;
							for( pi in this.NewRecord[vfield] ){
								c = this.NewRecord[vfield][pi];
								vrec[cnt1]= {"f":c["f"],"v":c["v"],"s":c["s"]};
								cnt1++;
								this.Initialze_fields(vfield,"count",(this.Fields[vfield]["count"]+1));
								pc = parseInt(c["s"]);
							}
							pc = pc+1;
							vrec[cnt1]= {"f":"","v":"","s":pc};
							
						}else{
							pc=1;
							vrec[cnt1]= {"f":"","v":"","s":1};
						}
						this.Initialze_fields(vfield,"sno_field",pc);
					}
					this.Initialze_Data(vfield,vrec);
				}else if(field_type == 'date_range' || field_type== 'datetime_range' || field_type== 'time_range' || field_type== 'numeric_range' ){
					if( v["v_t"] == "m" ){
						vrec = [];
						cnt =1;
						if( this.NewRecord[vfield] != undefined && this.NewRecord[vfield]['d'].length != 0 ){
							for(p in this.NewRecord[vfield]['d']){
								vrec[cnt] = {};
								c = this.NewRecord[vfield]['d'][p];

								vrec[cnt] =  { "from" :c["v"]["from"],"to":c["v"]["to"]};
								cnt++;
							}
							this.Initialze_fields(vfield,"count",cnt-1);
						}else{
							vrec[cnt] = {"from":"","to":""};	
						}
					}else{
						vrec = {"from":"","to":""};
						if( this.rec_cnt != 0 && this.NewRecord[vfield] != undefined && this.NewRecord[vfield]['d'].length != 0){
							c = this.NewRecord[vfield]['d'];
							vrec =  { "from" :c["v"]["from"],"to":c["v"]["to"]};
						}	
					}
					this.Initialze_Data(vfield,vrec);
				}else if(v["f_t"] == "collection"){
					specific_values = [];
					for(i in v["s_list"]){
						pc = {name:v["s_list"][i],id:v["s_list"][i]};
						specific_values.push(pc);
					}
					this.Initialze_fields(vfield,"specific_values",specific_values);
					this.Initialze_fields(vfield,"AddNewData",'');
					if( v["v_t"] == "m" ){
						vrec = [];
						if( this.NewRecord[vfield] != undefined && this.NewRecord[vfield].length != 0 ){
							cnt =0;
							for(p in this.NewRecord[vfield]){
								c = this.NewRecord[vfield][p];
								vrec[cnt] = c["v"];
								cnt++;
							}
						}
					}else{
						vrec = "";
						if( this.rec_cnt != 0 && this.NewRecord[vfield] != undefined){
							c = this.NewRecord[vfield];
							vrec = c["v"];
						}	
					}
					this.Initialze_fields(vfield,"multiple",true)
					this.Initialze_Data(vfield,vrec);
				}else{
					if( v["v_t"] == "m" ){
						vrec = [];
						if( this.NewRecord[vfield] != undefined && this.NewRecord[vfield]['d'].length != 0 ){
							cnt =1;
							for(p in this.NewRecord[vfield]['d']){
								c = this.NewRecord[vfield]['d'][p];
								vrec[cnt] = c["v"];
								cnt++;
							}
							this.Initialze_fields(vfield,"count",cnt-1);
						}
						this.Initialze_Data(vfield,vrec);
					}else{
						vrec = "";
						if( v["f_t"] == "boolean" ){
							vrec = "no";
						}
						if( this.rec_cnt != 0 && this.NewRecord[vfield] != undefined){
							c = this.NewRecord[vfield]['d'];
							vrec = c["v"];
						}	
						this.Initialze_Data(vfield,vrec);
					}
					this.Initialze_Data(vfield,vrec);
				}
			},
			Initialze_fields(vfield,vpro,vdata){
				var fields = this.Fields;
				fields[vfield][vpro] = vdata;
				this.Fields = [];
				this.Fields = fields;
			},
			Initialze_Data(vfield,vdata){
				var items = this.currentRecord;
				items[vfield] 	 = vdata;
				this.currentRecord = [];
				this.currentRecord = items;
			},
			Initialze_linked_autosuggest(){
				for( p in this.Fields){
					if(this.Fields[p]["f_t"] == "i_of"){
						setTimeout(this.Initialze_linked_autosuggest2,100,p);
					}
				}
			},
			Initialze_linked_autosuggest2(p){
				setTimeout(this.Initialze_Autosuggest,100,p);
			},
			Initialze_Autosuggest(vfield){
				vrec = [];
				v = this.Fields[vfield];
				if( this.Fields[vfield]["v_t"] == "s" ){
					var box_name  = this.Fields[vfield]["col_box_name"];
					var box_name2 = this.Fields[vfield]["keyword_box_name"];
					vrec = this.currentRecord[vfield]; 
					this.Initialze_Autosuggest_Instance(vfield,box_name,box_name2,vrec,"","s");
					if( vrec != undefined ){
						setTimeout(this.fill_linked_autosuggest_data,100,vrec,box_name,box_name2,vfield);
					}
				}else{
					for( p in this.currentRecord[vfield]){
						vrec[p] = this.currentRecord[vfield][p]; 
					}
					for (var i = 1; i <= this.Fields[vfield]["count"]; i++) {
						this.Initialze_Autosuggest_Instance_Multi(vfield,i,vrec);
					}
				}
			},
			Initialze_Autosuggest_Instance(vfield,box_name,box_name2,vrec,vrow,vtype){
				strict = false;
				if(this.Fields[vfield]["mtx"] != "yes"){
					table_app.vueapps[ box_name ] = simple_autosuggest( box_name, {
							"type"  		: "text",
							"class" 		: "form-control form-control-sm",
							"ajax_url"	 	: "?action=search_random_collection&keyword=#KEYWORD#",
							"select_key" 		: "id",
							"select_name" 		: "name",
							"search_key" 		: "name",
							"autosuggestion_width" 	: "40%",
							"strict"		: strict,
						}
					);
					table_app.vueapps[ box_name ].add_event( "select_event", function(details){
						if( details["id"] ){
							table_app.vueapps[ box_name2 ].change_ajax_url("?action=search_random_keywords&source_col="+details["id"]+"&keyword=#KEYWORD#");
						}
					});
				}
				table_app.vueapps[ box_name2 ]= simple_autosuggest( box_name2, {
						"type"  		: "text",
						"class" 		: "form-control form-control-sm",
						"ajax_url"	 	: "?action=search_random_keywords&source_col=''&keyword=#KEYWORD#",
						"select_key" 		: "id",
						"select_name" 		: "name",
						"search_key" 		: "name",
						"autosuggestion_width" 	: "40%",
						"strict"		: "true",
					}
				);
				table_app.vueapps[ box_name2 ].add_event( "select_event", function(details){
					console.log(details);
					console.log(table_apps[target_vid]);
					field_i_of = table_apps[target_vid]["Fields"][vfield];
					if(field_i_of["mtx"] != undefined && field_i_of["mtx"] == "yes"){
						details2 = {"id":table_apps[target_vid][ColThing],"name":table_apps[target_vid][ColName]};
					}else{
						details2 = table_app.vueapps[ box_name ]["selected_item"];					
					}
					c =  { name : details["name"],"id" :details["id"],"i_of":details2["id"],"i_of_v":details2["name"]};

					table_apps[target_vid].get_instance_data(c,field_i_of["mtx"],field_i_of["v_t"],vrec,vrow,vfield,target_vid,details["id"]);
				});
			},
			get_instance_data(c,mtx_type,vtype,vrec,vrow,vfield,vid,i_of_rec_id){
				p = c;	
				if( vtype == "m"){
					vrec[vrow] = {};
					vrec[vrow] = p;
					this.Initialze_Data(vfield,vrec);
				}else{
					vrec = p;
					this.Initialze_Data(vfield,vrec);
				}
				if(i_of_rec_id != "-new-item-"){
					this.Update_Record(vfield);
				}
			},
			save_instance_of(vfield){
				this.Update_Record(vfield);
			},
			Initialze_Autosuggest_Instance_Multi(vfield,row,vrec){
				var box_name  = v["col_box_name"]+"_"+row;
				var box_name2 = v["keyword_box_name"]+"_"+row;
				setTimeout(this.Initialze_Autosuggest_Instance,100,vfield,box_name,box_name2,vrec,row,"m");
				if( vrec[row] != undefined ){
					setTimeout(this.fill_linked_autosuggest_data,100,vrec[row],box_name,box_name2,vfield);
				}
			},
			fill_linked_autosuggest_data(vrec,box_name,box_name2,vfield){
				vrec_col =  { name : vrec["i_of_v"],"id" :vrec["i_of"],v : vrec["i_of_v"],"_id" :vrec["i_of"],};
				vrec_key =  { name : vrec["name"],"id" :vrec["id"],v : vrec["name"],"_id" :vrec["_id"],};
				if(this.Fields[vfield]["mtx"] != "yes"){
					table_app.vueapps[ box_name ].suggestion_keyword = vrec_col["v"];
					table_app.vueapps[ box_name ].suggestion_keyword_id = vrec_col["_id"];
					table_app.vueapps[ box_name ].selected_item = vrec_col;
				}
				table_app.vueapps[ box_name2 ].suggestion_keyword = vrec_key["v"];
				table_app.vueapps[ box_name2 ].suggestion_keyword_id = vrec_key["_id"];
				table_app.vueapps[ box_name2 ].selected_item = vrec_key;
			},
			get_fields(vfield){
				v = this.Fields[vfield];
				count  = v["count"];
				if( v['count'] <= v['v_t_l'] ){
					count  = v["count"]+1;
					this.Initialze_fields(vfield,"count",count);
				}
				if(v["f_t"] == 'date_range' || v["f_t"]== 'datetime_range' || v["f_t"]== 'time_range' || v["f_t"]== 'numeric_range' ){
					if(v["v_t"] == "m" ){
						p = this.currentRecord[ vfield ];
						p[ v["count"] ] = { "from" :"","to":""};
						this.Initialze_Data(vfield,p);
						vp = "fields_"+v["count"]+"_"+vfield+"_from";
						setTimeout(this.set_focus,100,vp);
					}
				}else if( v["f_t"] == "boolean"){
				}else if( v["f_t"] == "i_of" ){
					vrec = [];
					for( p in this.currentRecord[vfield]){
						vrec[p] = this.currentRecord[vfield][p]; 
					}
					if(vrec[count] == undefined){
						vrec[count]  =  { name : "","id" :"",i_of:"",i_of_v:""};
						if(this.Fields[vfield]["mtx"] == "yes"){
							vrec[count]  =  { name : "","id" :"",i_of:this.ColThing,i_of_v:this.ColName};
						}
					}
					
					this.Initialze_Autosuggest_Instance_Multi(vfield,count,vrec);
				}else{
					vp = "fields_"+v["count"]+"_"+vfield;
					setTimeout(this.set_focus,100,vp);
				}
			},
			set_focus(vfield){
				this.$refs[vfield][0].focus();
			},
			update_boolean(vfield,value){
				this.Update_currentRecord(vfield,value);
				this.check_data(vfield);
			},
			update_boolean2(vfield,value,row){
				
			},
			check_ranges(vfield){
				this.Initialze_Data(vfield,this.currentRecord[vfield]);
				v = this.Fields[vfield];
				if( v["v_t"] == "s" ){
					if( v["f_t"] == "numeric" ){
						this.currentRecord[vfield] = parseInt(this.currentRecord[vfield]);
					}
					if( v['f_list'] && v['f_list']['max'] &&  v['f_list']['min'] ){
						if(this.currentRecord[vfield] && ( ( this.currentRecord[vfield] < v['f_list']['max'] ) && (this.currentRecord[vfield] > v['f_list']['min'] ) ) ){
							this.check_data(vfield);
						}else{
							this.currentRecord[vfield] = "";
							this.Initialze_Data(vfield,this.currentRecord[vfield]);								
						}	
					}else if(v['f_list'] && v['f_list']['max'] && !v['f_list']['min'] ){
						if(this.currentRecord[vfield] &&  ( this.currentRecord[vfield] < v['f_list']['max'] ) ){
							this.check_data(vfield);
						}else{
							this.currentRecord[vfield] = "";
							this.Initialze_Data(vfield,this.currentRecord[vfield]);								
						}
					}else if(v['f_list'] && !v['f_list']['max'] && v['f_list']['min'] ){
						if(this.currentRecord[vfield] &&(this.currentRecord[vfield] > v['f_list']['min'] ) ){
							this.check_data(vfield);
						}else{
							this.currentRecord[vfield] = "";
							this.Initialze_Data(vfield,this.currentRecord[vfield]);								
						}
					}else{
						this.check_data(vfield);
					}
				}else{
					pc = [];
					cnt = 0;
					for( p in this.currentRecord[vfield]){
						if( v["f_t"] == "numeric" ){
							this.currentRecord[vfield][p] = parseInt(this.currentRecord[vfield][p]);
						}
						if( v['f_list'] && v['f_list']['max'] && v['f_list']['min'] ){
							if(this.currentRecord[vfield][p] && ( ( this.currentRecord[vfield][p] < v['f_list']['max'] ) && (this.currentRecord[vfield][p] > v['f_list']['min'] ) ) ){
								pc[cnt] = this.currentRecord[vfield][p];
								cnt++;
							}	
						}else if(v['f_list'] && v['f_list']['max'] && !v['f_list']['min'] ){
							if(this.currentRecord[vfield][p] && ( this.currentRecord[vfield][p] < v['f_list']['max']  ) ){
								pc[cnt] = this.currentRecord[vfield][p];
								cnt++;
							}
						}else if(v['f_list'] && !v['f_list']['max'] && v['f_list']['min'] ){
							if(this.currentRecord[vfield][p] && ( this.currentRecord[vfield][p] > v['f_list']['min'] )){
								pc[cnt] = this.currentRecord[vfield][p];
								cnt++;
							}
						}else{
							pc[cnt] = this.currentRecord[vfield][p];
							cnt++;
						}
					}
					this.Initialze_Data(vfield,pc);
					this.check_data(vfield);
				}
			},
			check_range_types(vfield,vfield_type){
				this.Initialze_Data(vfield,this.currentRecord[vfield]);
				v = this.Fields[vfield];
				vf_list = v['f_list'];
				type = 1;
				type2 = 2;
				vfield_type_2 = "to";
				if( vfield_type == "to" ){
					type = 2;
					type2 = 1;
					vfield_type_2 = "from";
				}
				if( v["v_t"] == "s" ){
					if( v["f_t"] == "numeric" ){
						this.currentRecord[vfield][vfield_type] = parseInt(this.currentRecord[vfield][vfield_type]);
					}
					vrec = this.currentRecord[vfield][vfield_type];
					if( vf_list && vf_list['max'][type] &&  vf_list['min'][type] ){
						if( vrec && ( ( vrec < vf_list['max'][type] ) && ( vrec > vf_list['min'][type] ) ) ){
							this.check_data(vfield);
						}else{
							this.currentRecord[vfield][vfield_type] = "";
							this.Initialze_Data(vfield,this.currentRecord[vfield]);								
						}	
					}else if(vf_list && vf_list['max'][type] && !vf_list['min'][type] ){
						if( vrec &&  ( vrec < vf_list['max'][type] ) ){
							this.check_data(vfield);
						}else{
							this.currentRecord[vfield][vfield_type] = "";
							this.Initialze_Data(vfield,this.currentRecord[vfield]);								
						}
					}else if(vf_list && !vf_list['max'][type] && vf_list['min'][type] ){
						if( vrec && (vrec > vf_list['min'][type] ) ){
							this.check_data(vfield);
						}else{
							this.currentRecord[vfield][vfield_type] = "";
							this.Initialze_Data(vfield,this.currentRecord[vfield]);								
						}
					}else{
						this.check_data(vfield);
					}
				}else{
					pc = [];
					cnt = 1;
					pc[cnt] = {};
					pc[cnt][vfield_type] = "";
					pc[cnt][vfield_type_2] = "";
					for( p in this.currentRecord[vfield]){
						vrec = this.currentRecord[vfield][p][vfield_type];
						vrec2 = this.currentRecord[vfield][p][vfield_type_2];
						if( v["f_t"] == "numeric" ){
							vrec = parseInt(vrec);
						}
						if( vf_list && vf_list['max'][type] &&  vf_list['min'][type] ){
							pc[cnt] = {};
							pc[cnt][vfield_type_2] = vrec2;
							if( vrec && ( ( vrec < vf_list['max'][type] ) && ( vrec > vf_list['min'][type] ) ) ){
								pc[cnt][vfield_type] = vrec;
							}else{
								pc[cnt][vfield_type] = "";
							}	
							cnt++;
						}else if(vf_list && vf_list['max'][type] && !vf_list['min'][type] ){
							pc[cnt] = {};
							pc[cnt][vfield_type_2] = vrec2;
							if(vrec && ( vrec < vf_list['max'][type] ) ){
								pc[cnt] = {};
								pc[cnt][vfield_type] = vrec;
							}else{
								pc[cnt][vfield_type] = "";
							}	
							cnt++;
						}else if(vf_list && !vf_list['max'][type] && vf_list['min'][type] ){
							pc[cnt] = {};
							pc[cnt][vfield_type_2] = vrec2;
							if( (vrec > vf_list['min'][type] ) ){
								pc[cnt][vfield_type] = vrec;
							}else{
								pc[cnt][vfield_type] = "";
							}	
							cnt++;
						}else{
							pc[cnt] = {};
							pc[cnt][vfield_type] = vrec;
							pc[cnt][vfield_type_2] = vrec2;
							cnt++;
						}
					}
					this.Initialze_Data(vfield,pc);
					this.check_data(vfield);
				}
			},
			check_data(vfield){
				this.Update_currentRecord(vfield,this.currentRecord[vfield]);
			},
			Update_currentRecord(vfield,vdata,vid=''){
				var items = this.currentRecord;
				items[vfield] 	 = vdata;
				this.currentRecord = [];
				this.currentRecord = items;
				this.Update_Record(vfield);
			},
			Update_Record(vfield){
				vdata = {};
				this.Error = "";
				verror = 1;
				fields_details = table_apps[target_vid]["Fields"][vfield];
				if( fields_details["v_t"] =="s" ){
					if( this.currentRecord[vfield] == "" ){
						verror++;
					}else{
						vdata[vfield] = this.currentRecord[vfield];
					}
				}else{
					p =[];
					for( ip in this.currentRecord[vfield]){
						if( ip  != 0 && this.currentRecord[vfield][ip] == ""){
							verror++;
						}else{
							p.push(this.currentRecord[vfield][ip]);
						}
					}
					if(verror == 1){
						vdata[vfield] = p;
					}
				}
				if( verror == 1 ){
					daata = {
							key		: this.ColThing,
							key_field 	: this.ColField,
							key_id 		: this.Rec_Id,
							Sub_Rec_Id 	: this.Sub_Rec_Id,
							fields 		: vdata,
						}
					vpostdata = {
						action 		: this.Insert_Action_Name,
						data 		: JSON.stringify(daata),
					};
					vurl="?";
					post_request_json(vurl,vpostdata,this.InsertData_Response);
				}
			},
			InsertData_Response(vdata){
				console.log(vdata);
				this.Error  = "";
				if( vdata["status"] == "success" ){
					this.showDeleteModal = false;
					this.Sub_Rec_Id = vdata["details"]["sub_record_id"];
					this.Successmsg = true;
					setTimeout(this.update_success_msg,500,false);
					this.Records = vdata["details"]["record"];
					this.Update_Records_list();
					
				}else{
					this.Successmsg = false;
					this.Error = vdata["details"]["reason"];
				}
			},
			LoadRecordData(vrecord,vtype,vid,vfield){
				vm = "";
				if(vtype[0] == "linked"){
					vm = this.Instance_of(vrecord,vtype[1],vid);
				}else if(vtype[0] == "file"){
					f_t = this.Fields[vfield]["f_t"];
					vm = this.UploadUrl(vrecord,vtype[1],vid,f_t);
				}else{
					vm = this.String(vrecord,vtype[1],vid);
				}
				return vm;
			},
			UploadUrl(vdata,vtype,vid,f_t){
				pm  = "";
				if(vtype == "single"){
					if( vdata && vdata["f"]){
						pm = this.GetUploadUrl(f_t,"no",vdata["f"],vdata["v"]);
					}else{
						pm = "-";
					}
				}else{
					for( i  in vdata){
						if( vdata[i] && vdata[i]["f"]){
							pm = pm + "<div>"+ this.GetUploadUrl(f_t,"no",vdata[i]["f"],vdata[i]["v"])+"</div>";
						}
					}
				}
				return pm;
			},
			GetUploadUrl(f_t,thumb,vsource,vname){
				if( f_t == "image_upload" ){
					p = "image_uploads";
					if(!vname){ vname ="Image";}
				}else{
					p = "pdf_uploads";
					if(!vname){ vname ="Document";}
				}

				Url = "https://wikia2z-test.s3.ap-south-1.amazonaws.com/"+p+"/"+vsource;
				if(Url){
					vurl = "<a target='_balnk' href='"+Url+"'>"+vname+"</a>";
				}
				return vurl;
			},
			Instance_of(vdata,vtype,vid){
				vstr = "";
				if(vtype == "single"){
					vrecord = vdata;
					if( vrecord &&  vrecord["v"] ){
						vstr = "<div class='text-nowrap'>"+this.GetUrl(vrecord["i_of"],vrecord["v"],vrecord["_id"])+"</div>";;
					}else{
						vstr = "<div class='text-nowrap'>"+vdata+"</div>";
					}
				}else{
					for( i  in vdata ){
						vrecord = vdata[i];
							if( vrecord &&  vrecord["v"] ){
							vstr += "<div class='text-nowrap'>"+this.GetUrl(vrecord["i_of"],vrecord["v"],vrecord["_id"]);
						}else{
							vstr += "<div class='text-nowrap'>"+vdata+"</div>";
						}
					}	
				}	
				return vstr;
			},
			slug(v){
				str = v.replace(/ /g,"");
				str = str.trim();
				str = str.toLowerCase();
				return (str + '').replace(/^(.)|\s+(.)/g, function ($1){return $1.toLowerCase()});
			},
			GetUrl(vid,v1,v2){
				vurl = "<a target='_blank' href='/browse/"+vid+"/"+this.slug(v1)+"/"+v2+"'>"+v1+"</a>";
				return vurl;
			},
			String(vdata,vtype,vid){
				vstr = "";
				if(vtype == "single"){
					vrecord = vdata;
					if(vrecord["t"] == "v"){
						if(vrecord["v"]){
							vstr = "<div class='text-nowrap'>"+ vrecord["v"] + (vrecord["unit"]? vrecord["unit"]:"")+"</div>";
						}
					}else if(vrecord["t"] == "e" || vrecord["type"] == "e"){
						vstr = "<div class='text-nowrap'>"+(vrecord["eid"]? vrecord["eid"]:"-")+"</div>";
					}else if(vrecord["t"] == "c"){
						vstr = "<div class='text-nowrap'>"+(vrecord["v"]? vrecord["v"]:"-")+"</div>";
					}else if(vrecord["t"] == "mt"){
						vstr = "<div class='text-nowrap'>"+(vrecord["v"]? vrecord["v"]+(vrecord["l"]? vrecord["l"]:"") :"-")+"</div>";
					}else if(vrecord["t"] == "geo"){
						$vstr = "";
						vstr += (vrecord["lat"]? "<div class='text-nowrap'>Latitude :"+vrecord["lat"]+"</div>":"");
						vstr += (vrecord["lon"]? "<div class='text-nowrap'>Longitude :"+vrecord["lon"]+"</div>":"");
					}else if( vrecord["t"] == "d_r" || vrecord["t"] == "n_r" || vrecord["t"] == "dt_r" || vrecord["t"] == "t_r" ){
						$vstr = "";
						if(vrecord["v"]){
							if(vrecord["v"]["from"] && vrecord["v"]['to']){
								vstr += "<div>"+vrecord["v"]["from"]+" to "+vrecord["v"]["to"] +"</div>";
							}else{
								vstr += "<div class='text-nowrap'>"+(vrecord["v"]["from"]? vrecord["v"]["from"]:"")+"</div>";
								vstr += "<div class='text-nowrap'>"+(vrecord["v"]["to"]? vrecord["v"]["to"]:"")+"</div>";
							}
						}else{
							vstr = "-";
						}
					}else{
						vstr = "<div class='text-nowrap'>"+(vrecord["v"]? vrecord["v"]:"")+"</div>";
					}
				}else{

					for( i  in vdata ){
						vrecord = vdata[i];
						if(vrecord["t"] == "v"){
							if(vrecord["v"]){
								vstr += "<div class='text-nowrap'>"+ vrecord["v"] + (vrecord["unit"]? vrecord["unit"]:"")+"</div>";
							}
						}else if(vrecord["t"] == "e" || vrecord["type"] == "e"){
							vstr += "<div class='text-nowrap'>"+(vrecord["eid"]? vrecord["eid"]:"")+"</div>";
						}else if(vrecord["t"] == "c"){
							vstr = "<div class='text-nowrap'>"+(vrecord["v"]? vrecord["v"]:"-")+"</div>";
						}else if(vrecord["t"] == "mt"){
							vstr += "<div class='text-nowrap'>"+(vrecord["v"]? vrecord["v"]+(vrecord["l"]? vrecord["l"]:"") :"")+"</div>";
						}else if(vrecord["t"] == "geo"){
							$vstr = "";
							vstr += (vrecord["lat"]? "<div class='text-nowrap'>Latitude :"+vrecord["lat"]+"</div>":"");
							vstr += (vrecord["lon"]? "<div class='text-nowrap'>Longitude :"+vrecord["lon"]+"</div>":"");
						}else if( vrecord["t"] == "d_r" || vrecord["t"] == "n_r" || vrecord["t"] == "dt_r" || vrecord["t"] == "t_r" ){
							if(vrecord["v"]){
								if(vrecord["v"]["from"] && vrecord["v"]['to']){
									vstr += "<div class='text-nowrap'>"+vrecord["v"]["from"]+" to "+vrecord["v"]["to"] +"</div>";
								}else{
									vstr += "<div class='text-nowrap'>"+(vrecord["v"]["from"]? vrecord["v"]["from"]:"")+"</div>";
									vstr += "<div class='text-nowrap'>"+(vrecord["v"]["to"]? vrecord["v"]["to"]:"")+"</div>";
								}
							}
						}else{
							vstr += "<div class='text-nowrap'>"+(vrecord["v"]? vrecord["v"]:"")+"</div>";
						}
					}	
				}
				return vstr;
			},
		}
	});
	return table_app;
}