<?php
	//echo $_SERVER['CONTENT_TYPE'];exit;
	if( preg_match( "/application\/json/i", $_SERVER['CONTENT_TYPE'] ) ){
		$json = file_get_contents('php://input');
		$_POST = json_decode($json,true);
		//print_r( $_POST );exit;
	}
	if( $_POST["action"] == "search_cities" ){
		$key = strtolower(trim($_POST['key']));
		$l = strlen($key);
		include('zcities.php');
		$l2 = sizeof($cities);
		$cnt = 0;
		$list = [];
		for($i=0;$i<sizeof($cities);$i++){
			$w = $cities[$i];
			if( strtolower( substr( $w['city'], 0, $l ) ) == $key ){
				$list[] = $w;
				$cnt++;
				if( $cnt > 50 ){
					break;
				}
			}
		}
		$data = array(
			"data" => $list,
			"status"=>"success"
		); 
		header("content-type: application/json");
		echo json_encode( $data, JSON_PRETTY_PRINT );
		exit;
	}
	if( $_POST["action"] == "search_names" ){
		$key = strtolower(trim($_POST['key']));
		$l = strlen($key);
		include('znames.php');
		$l2 = sizeof($names);
		$cnt = 0;
		$list = [];
		for($i=0;$i<sizeof($names);$i++){
			$w = $names[$i];
			if( strtolower( substr( $w['name'], 0, $l ) ) == $key ){
				$list[] = $w;
				$cnt++;
				if( $cnt > 50 ){
					break;
				}
			}
		}
		$data = array(
			"data" => $list,
			"status"=>"success"
		); 
		header("content-type: application/json");
		echo json_encode( $data, JSON_PRETTY_PRINT );
		exit;
	}

?>
<!DOCTYPE html>
<html>
<head>
	<title>Vuejs Simple Ajax Autosuggest</title>
	<link rel="stylesheet" href="css/bootstrap.min.css">
	<link type="text/css" rel="stylesheet" href="css/bootstrap-vue.min.css"/>
	<script src="css/vue.min.js"></script>
	<script src="css/bootstrap-vue.min.js"></script>
	<script src="css/axios.min.js"></script>

</head>
<body>
	<div class="container-fluid">
		<div class="row bg-dark pt-2">
			<div class="col-lg-12">
				<h4 class="text-center text-light">Simple Autosuggest Example ( Vuejs )</h4>
			</div>
		</div>
	</div>	
	<p>&nbsp;</p>
	<div class="container" id="app">
		<div class="card">
			<div class="card-body">
				<div class="form-group row">
					<div class="col-8">
						<label for="state">City Single Column</label>
						<simpleselect v-bind:voptions="f1['vautosuggest']" v-bind:vplaceholder="'Select City'" v-bind:vselected="f1['value']" v-on:selected="f1['value']=$event" ></simpleselect>
						<pre v-text="f1['value']" ></pre>
					</div>
				</div>
				<div class="form-group row">
					<div class="col-8">
						<label for="state">City Single Column with default list. no ajax</label>
						<simpleselect v-bind:voptions="f11['vautosuggest']" v-bind:vplaceholder="'Select City'" v-bind:vselected="f11['value']" v-on:selected="f11['value']=$event" ></simpleselect>
						<pre v-text="f11['value']" ></pre>
					</div>
				</div>
				<div class="form-group row">
					<div class="col-8">
						<label for="state">City Multi Column</label>
						<simpleselect v-bind:voptions="f2['vautosuggest']" v-bind:vplaceholder="'Select City'" v-bind:vselected="f2['value']" v-on:selected="f2['value']=$event" ></simpleselect>
						<pre v-text="f2['value']" ></pre>
					</div>
				</div>
				<div class="form-group row">
					<div class="col-8">
						<label for="state">Names Single Column with default selected</label>
						<simpleselect v-bind:voptions="f3['vautosuggest']" v-bind:vplaceholder="'Select Name'" v-bind:vselected="f3['value']" v-on:selected="f3['value']=$event" ></simpleselect>
						<pre v-text="f3['value']" ></pre>
					</div>
				</div>
				<div class="form-group row">
					<div class="col-8">
						<label for="state">Names Multi Column with default list </label>
						<simpleselect v-bind:voptions="f4['vautosuggest']" v-bind:vplaceholder="'Select Name'" v-bind:vselected="f4['value']" v-on:selected="f4['value']=$event" ></simpleselect>
						<pre v-text="f4['value']" ></pre>
					</div>
				</div>
				<div class="form-group row">
					<div class="col-8">
						<label for="state">Names multi select Single Column</label>
						<simplemultiselect v-bind:voptions="f7['vautosuggest']" v-bind:vplaceholder="'Select Name'" v-bind:vselected="f7['value']" v-on:selected="f7['value']=$event" ></simplemultiselect>
						<pre v-text="f7['value']" ></pre>    
					</div>
				</div>
				<div class="form-group row">
					<div class="col-8">
						<label for="state">Names multi select Multi Column and default selected</label>
						<simplemultiselect v-bind:voptions="f8['vautosuggest']" v-bind:vplaceholder="'Select Name'" v-bind:vselected="f8['value']" v-on:selected="f8['value']=$event" ></simplemultiselect>
						<pre v-text="f8['value']" ></pre>
					</div>
				</div>
			</div>
		</div>
	</div>
	<script type="text/javascript" src="vue-autosuggest-2020-simple.js?v=<?=time() ?>"></script>
	<script type="text/javascript" src="vue-autosuggest-2020-simple-multi.js?v=<?=time() ?>"></script>
	<script type="text/javascript">
		var app = new Vue({                 
			el:"#app",
			data:{
				"f1": {
					"value": {
					},
					"vautosuggest":{
						"api_url":"?",  // if not provided, default_list is used. 
						"api_params": { // required if api_url is provided
							"action": "search_cities",
							"key": "#SEARCH_KEYWORD#",
							"extra": "extra",
						},
						"api_method": "POST",   // GET/POST  . 
						"api_content-type": "query", // json/query .  if post , content-type: application/json or application/x-www-form-url-encoded, default json 
						"data": {
							"search_field": "city",  // what field to search in input data
							"unique_field": "id", // optional. to filter repeated results.						
							"multi_column": false,   // optional to display multiple columns 
							"columns": { 
								"city": "City",   // input field name and respective column heading
							},
						},
					}
				},
				"f11": {
					"value": {
					},
					"vautosuggest":{
						"data": {
							"search_field": "city",  // what field to search in input data
							"unique_field": "id", // optional. to filter repeated results.						
							"multi_column": false,   // optional to display multiple columns 
							"columns": { 
								"city": "City",   // input field name and respective column heading
							},
						},
						"default_list": [  // default list to show before keyword search
							{"city":"Guntakal","state":"Andhra Pradesh","id":18},
							{"city":"Guntur","state":"Andhra Pradesh","id":19},
							{"city":"Hindupur","state":"Andhra Pradesh","id":20},
							{"city":"Jaggaiahpet","state":"Andhra Pradesh","id":21},
							{"city":"Jammalamadugu","state":"Andhra Pradesh","id":22},
							{"city":"Kadapa","state":"Andhra Pradesh","id":23},
							{"city":"Kadiri","state":"Andhra Pradesh","id":24},
							{"city":"Kakinada","state":"Andhra Pradesh","id":25},
							{"city":"Kandukur","state":"Andhra Pradesh","id":26},
							{"city":"Kavali","state":"Andhra Pradesh","id":27},
							{"city":"Kovvur","state":"Andhra Pradesh","id":28},
							{"city":"Kurnool","state":"Andhra Pradesh","id":29},
							{"city":"Macherla","state":"Andhra Pradesh","id":30},
							{"city":"Machilipatnam","state":"Andhra Pradesh","id":31},
							{"city":"Madanapalle","state":"Andhra Pradesh","id":32},
							{"city":"Mandapeta","state":"Andhra Pradesh","id":33},
							{"city":"Markapur","state":"Andhra Pradesh","id":34},
							{"city":"Nagari","state":"Andhra Pradesh","id":35},
							{"city":"Naidupet","state":"Andhra Pradesh","id":36},
						]
					}
				},				
				"f2": {
					"value": {
					},
					"vautosuggest":{
						"api_url":"?",
						"api_params": {
							"action": "search_cities",
							"key": "#SEARCH_KEYWORD#",
							"extra": "extra",
						},
						"api_method": "POST",   // GET/POST  . 
						"api_content-type": "query", // json/query .  if post , content-type: application/json or application/x-www-form-url-encoded, default json 
						"data": {
							"search_field": "city",  // what field to search in input data
							"unique_field": "id", // optional. to filter repeated results.						
							"multi_column": true,   // optional to display multiple columns 
							"columns": { 
								"state": "State",   
								"id": "ID",   // extra columns to appear, excluding search field
							},
						},
						"default_list": [
						]
					}
				},
				"f3": {
					"value": {
					    "_id": "5e2895812ce8ff38233449fc",
					    "name": "Douglas Macdonald",
					    "company": "SQUISH",
					    "email": "douglasmacdonald@squish.com",
					    "phone": "+1 (840) 422-3103"
					},
					"vautosuggest":{
						"api_url":"?",
						"api_params": {
							"action": "search_names",
							"key": "#SEARCH_KEYWORD#",
							"extra": "extra",
						},
						"api_method": "POST",   // GET/POST  . 
						"api_content-type": "query", // json/query .  if post , content-type: application/json or application/x-www-form-url-encoded, default json 
						"data": {
							"search_field": "name",  // what field to search in input data
							"unique_field": "_id", // optional. to filter repeated results.						
							"multi_column": false,   // optional to display multiple columns 
						},
						"default_list": [
						]
					}
				},
				"f4": {
					"value": {
					},
					"vautosuggest":{
						"api_url":"?",
						"api_params": {
							"action": "search_names",
							"key": "#SEARCH_KEYWORD#",
							"extra": "extra",
						},
						"api_method": "POST",   // GET/POST  . 
						"api_content-type": "query", // json/query .  if post , content-type: application/json or application/x-www-form-url-encoded, default json 
						"data": {
							"search_field": "name",  // what field to search in input data
							"unique_field": "_id", // optional. to filter repeated results.						
							"multi_column": true,   // optional to display multiple columns 
							"columns": { 
								"company": "Company",
								"email": "email",
								"phone": "phone"   // extra columns to appear, excluding search field
							},
						},
						"default_list": [
							  {
							    "_id": "5e28958152d9a396bbf3c212",
							    "name": "Gregory Mckay",
							    "company": "GEEKKO",
							    "email": "gregorymckay@geekko.com",
							    "phone": "+1 (889) 553-3476"
							  },
							  {
							    "_id": "5e289581fa4e33de744d6ea2",
							    "name": "Margo Boyer",
							    "company": "PROSURE",
							    "email": "margoboyer@prosure.com",
							    "phone": "+1 (872) 482-2348"
							  },
							  {
							    "_id": "5e289581e1aa5ee2b70e1c5f",
							    "name": "Erickson Booth",
							    "company": "STREZZO",
							    "email": "ericksonbooth@strezzo.com",
							    "phone": "+1 (824) 518-2818"
							  },
							  {
							    "_id": "5e289581b9d767beb3e0299c",
							    "name": "Deleon Martinez",
							    "company": "KOZGENE",
							    "email": "deleonmartinez@kozgene.com",
							    "phone": "+1 (857) 447-2017"
							  },
							  {
							    "_id": "5e2895817c7f0701d5b1af22",
							    "name": "Pamela Rodriguez",
							    "company": "GINKOGENE",
							    "email": "pamelarodriguez@ginkogene.com",
							    "phone": "+1 (907) 485-3241"
							  },
							  {
							    "_id": "5e2895812ce8ff38233449fc",
							    "name": "Douglas Macdonald",
							    "company": "SQUISH",
							    "email": "douglasmacdonald@squish.com",
							    "phone": "+1 (840) 422-3103"
							  },
							  {
							    "_id": "5e289581f9d4962e9c3c0943",
							    "name": "Berger Kennedy",
							    "company": "NAXDIS",
							    "email": "bergerkennedy@naxdis.com",
							    "phone": "+1 (975) 447-3110"
							  },
							  {
							    "_id": "5e28958191f2e11b663e3d57",
							    "name": "Mccarthy Hickman",
							    "company": "DIGIGEN",
							    "email": "mccarthyhickman@digigen.com",
							    "phone": "+1 (890) 455-2702"
							  },						
						]
					}
				},
				"f7": {
					"value": [
					],
					"vautosuggest":{
						"api_url":"?",
						"api_params": {
							"action": "search_names",
							"key": "#SEARCH_KEYWORD#",
							"extra": "extra",
						},
						"api_method": "POST",   // GET/POST  . 
						"api_content-type": "query", // json/query .  if post , content-type: application/json or application/x-www-form-url-encoded, default json 
						"data": {
							"search_field": "name",  // what field to search in input data
							"unique_field": "_id", // optional. to filter repeated results.						
							"multi_column": false,   // optional to display multiple columns 
							"columns": { 
								"company": "Company",
								"email": "email",
								"phone": "phone"   // extra columns to appear, excluding search field
							},
						},
					}					
				},
				"f8": {
					"value": [
						  {
						    "_id": "5e28958152d9a396bbf3c212",
						    "name": "Gregory Mckay",
						    "company": "GEEKKO",
						    "email": "gregorymckay@geekko.com",
						    "phone": "+1 (889) 553-3476"
						  },
						  {
						    "_id": "5e289581fa4e33de744d6ea2",
						    "name": "Margo Boyer",
						    "company": "PROSURE",
						    "email": "margoboyer@prosure.com",
						    "phone": "+1 (872) 482-2348"
						  },
					],
					"vautosuggest":{
						"api_url":"?",
						"api_params": {
							"action": "search_names",
							"key": "#SEARCH_KEYWORD#",
							"extra": "extra",
						},
						"api_method": "POST",   // GET/POST  . 
						"api_content-type": "query", // json/query .  if post , content-type: application/json or application/x-www-form-url-encoded, default json 
						"data": {
							"search_field": "name",  // what field to search in input data
							"unique_field": "_id", // optional. to filter repeated results.						
							"multi_column": true,   // optional to display multiple columns 
							"columns": { 
								"company": "Company",
								"email": "email",
								"phone": "phone"   // extra columns to appear, excluding search field
							},
						},
						"default_list": [
							  {
							    "_id": "5e28958152d9a396bbf3c212",
							    "name": "Gregory Mckay",
							    "company": "GEEKKO",
							    "email": "gregorymckay@geekko.com",
							    "phone": "+1 (889) 553-3476"
							  },
							  {
							    "_id": "5e289581fa4e33de744d6ea2",
							    "name": "Margo Boyer",
							    "company": "PROSURE",
							    "email": "margoboyer@prosure.com",
							    "phone": "+1 (872) 482-2348"
							  },
							  {
							    "_id": "5e289581e1aa5ee2b70e1c5f",
							    "name": "Erickson Booth",
							    "company": "STREZZO",
							    "email": "ericksonbooth@strezzo.com",
							    "phone": "+1 (824) 518-2818"
							  },
							  {
							    "_id": "5e289581b9d767beb3e0299c",
							    "name": "Deleon Martinez",
							    "company": "KOZGENE",
							    "email": "deleonmartinez@kozgene.com",
							    "phone": "+1 (857) 447-2017"
							  },
							  {
							    "_id": "5e2895817c7f0701d5b1af22",
							    "name": "Pamela Rodriguez",
							    "company": "GINKOGENE",
							    "email": "pamelarodriguez@ginkogene.com",
							    "phone": "+1 (907) 485-3241"
							  },
							  {
							    "_id": "5e2895812ce8ff38233449fc",
							    "name": "Douglas Macdonald",
							    "company": "SQUISH",
							    "email": "douglasmacdonald@squish.com",
							    "phone": "+1 (840) 422-3103"
							  },
							  {
							    "_id": "5e289581f9d4962e9c3c0943",
							    "name": "Berger Kennedy",
							    "company": "NAXDIS",
							    "email": "bergerkennedy@naxdis.com",
							    "phone": "+1 (975) 447-3110"
							  },
							  {
							    "_id": "5e28958191f2e11b663e3d57",
							    "name": "Mccarthy Hickman",
							    "company": "DIGIGEN",
							    "email": "mccarthyhickman@digigen.com",
							    "phone": "+1 (890) 455-2702"
							  },						
						]
					}					
				}
			},
			mounted(){
			},
			methods:{
				field_selected: function(vselected, vi){
					alert( JSON.stringify( vselected, null, 4 ) );
					alert( JSON.stringify( vi, null, 4 ) );
				},
				thing_selected: function(vselected,v){
					alert( JSON.stringify( vselected, null, 4 ) );
				},
				things_selected: function(vselected,v){
					
					alert( JSON.stringify( vselected, null, 4 ) );

				}
			}
		});
	</script>
</body>
</html>