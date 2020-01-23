<?php

	if( 1==2 ){
		$data = file_get_contents("random.txt");
		$words = explode("\r\n",$data);
		$l2 = sizeof($words);
		$list = [];
		$cnt=0;
		while(1){
			$w = $words[ rand(0, $l2) ] . " " . $words[ rand(0, $l2) ];
			//echo "<div>". $w . "</div>";
			$list[ $w ] = ["fv"=> $w, "id"=> rand() ];
			$cnt++;
			if($cnt>10000){
				break;
			}
		}
		echo "<pre>";
		ksort($list);
		print_r($list);
		file_put_contents("random.php", "<"."?php\n\$random=" . var_export(array_values($list),true) . ";\n?".">" );
		exit;
	}

	//echo $_SERVER['CONTENT_TYPE'];exit;
	if( preg_match( "/application\/json/i", $_SERVER['CONTENT_TYPE'] ) ){
		$json = file_get_contents('php://input');
		$_POST = json_decode($json,true);
		//print_r( $_POST );exit;
	}
	if( $_POST["action"] == "search" ){
		$key = strtolower(trim($_POST['key']));
		$l = strlen($key);
		include('random.php');
		$l2 = sizeof($random);
		$cnt = 0;
		$list = [];
		for($i=0;$i<sizeof($random);$i++){
			$w = $random[$i];
			if( strtolower( substr( $w['fv'], 0, $l ) ) == $key ){
				$list[] = [
					"t"=>"r",  // type
					"key"=>$w['fv'],  // permuted key
					"mkey"=>$w['fv'], // main key
					"c"=> "Persons", // col name
					"col"=>"c1",  // col id
					"cid"=>$w['id'],  //record id
				];
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
	if( $_POST["action"] == "get_collections" ){

		$key = strtolower(trim($_POST['key']));
		$l = strlen($key);	
		include('random.php');
		$l2 = sizeof($random);
		$cnt = 0;
		$list = [];
		for($i=0;$i<sizeof($random);$i++){
			$w = $random[$i];
			if( strtolower( substr( $w['fv'], 0, $l ) ) == $key ){
			$list[] = ["id"=>"c".$i, "name"=>$w['fv'], "name2"=>$w['fv'] ];
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
				<h4 class="text-center text-light">autosuggest for wiki</h4>
			</div>
		</div>
	</div>	
	<p>&nbsp;</p>
	<div class="container" id="app">
		<div class="card">
			<div class="card-body">
				<div class="form-group row">
					<div class="col-6">
						<label for="state">Actor</label>
						<thingselect v-bind:field="thing['f']['f6']" v-model="data['f6']" v-on:selected="thing_selected" ></thingselect>
					</div>
				</div>
				<div class="form-group row">
					<div class="col-6">
						<label for="state">Actress</label>
						<thingselect v-bind:field="thing['f']['f8']" v-model="data['f8']" v-on:selected="thing_selected"   ></thingselect>
					</div>
				</div>
				<div class="form-group row">
					<div class="col-6">
						<label for="state">Movies</label>
						<thingmultiselect v-bind:field="thing['f']['f9']" v-model="data['f9']" v-on:selected="things_selected" ></thingmultiselect>
					</div>
				</div>
			</div>
		</div>
	</div>
	<script type="text/javascript" src="vue-autosuggest-2020-complex-thingselect.js?v=<?=time() ?>"></script>
	<script type="text/javascript" src="vue-autosuggest-2020-complex-thingselect-multi.js?v=<?=time() ?>"></script>
	<script type="text/javascript" src="vue-autosuggest-2020-complex-collections.js?v=<?=time() ?>"></script>
	<script type="text/javascript">
		var app = new Vue({
			el:"#app",
			data:{
				"data": {
					"f6":{
						"t" :"i_of",
						"v" : ""
					}
				},
				"thing": {
				    "_id": "5e22aea1d7a1ec4ed656edb4",
				    "sno": "1",
				    "thing": "c1",
				    "name": "Persons",
				    "desc": "Famous personalities",
				    "server": "localhost:27017",
				    "db": "wiki_user",
				    "col_t": "user",
				    "t_t": "unique",
				    "t": "main",
				    "pfn": "f1",
				    "b": "public",
				    "l_s": "yes",
				    "l_a": "yes",
				    "l_e": "yes",
				    "l_d": "yes",
				    "c": "yes",
				    "a": "active",
				    "m": "yes",
				    "c_by": "user",
				    "a_uid": 2,
				    "a_n": "Nazira",
				    "c_m_i": "2020-01-18 12:37:13",
				    "cnt": 0,
				    "d_r": 0,
				    "d": 0,
				    "f": {
				        "f6": {
				            "n": "f6",
				            "d": "Actor",
				            "f_t": "i_of",
				            "v_t": "s",
				            "m": "no",
				            "i": "no",
				            "f_o": 600,
				            "b_l": "yes",
				            "b_d": "yes",
				            "e": "yes",
				            "de": "yes",
				            "c_by": {
				                "t": "s",
				                "u_t": "user",
				                "v": "Nazira",
				                "_id": 2
				            },
				            "apr": "yes",
				            "apr_by": {
				                "t": "s",
				                "u_t": "user",
				                "v": "Nazira",
				                "_id": 2
				            },
				            "l": "yes",
				            "i_sno": 6,
				            "i_of": {
				                "c1": {
				                    "v": "Persons",
				                    "_id": "c1",
				                    "pfn": "f1",
				                    "e_f": {
				                        "e_f": {
				                            "f1": {
				                                "n": "f1",
				                                "d": "Name"
				                            }
				                        },
				                        "i_f": {
				                            "f1": {
				                                "n": "f1",
				                                "d": "Name"
				                            }
				                        },
				                        "b_f": {
				                            "f1": {
				                                "n": "f1",
				                                "d": "Name"
				                            }
				                        },
				                        "d_f": {
				                            "f1": {
				                                "n": "f1",
				                                "d": "Name"
				                            }
				                        }
				                    }
				                }
				            },
				            "mtx": "yes",
				            "m_u": "2020-01-18 12:41:52",
				            "p_f_d": {
				                "n": "f6",
				                "d": "Parents",
				                "f_t": "i_of",
				                "v_t": "s",
				                "m": "no",
				                "i": "no",
				                "f_o": 600,
				                "b_l": "yes",
				                "b_d": "yes",
				                "e": "yes",
				                "de": "yes",
				                "c_by": {
				                    "t": "s",
				                    "u_t": "user",
				                    "v": "Nazira",
				                    "_id": 2
				                },
				                "apr": "yes",
				                "apr_by": {
				                    "t": "s",
				                    "u_t": "user",
				                    "v": "Nazira",
				                    "_id": 2
				                },
				                "l": "yes",
				                "i_sno": 6,
				                "i_of": {
				                    "c1": {
				                        "v": "Persons",
				                        "_id": "c1",
				                        "pfn": "f1",
				                        "e_f": {
				                            "e_f": {
				                                "f1": {
				                                    "n": "f1",
				                                    "d": "Name"
				                                }
				                            },
				                            "i_f": {
				                                "f1": {
				                                    "n": "f1",
				                                    "d": "Name"
				                                }
				                            },
				                            "b_f": {
				                                "f1": {
				                                    "n": "f1",
				                                    "d": "Name"
				                                }
				                            },
				                            "d_f": {
				                                "f1": {
				                                    "n": "f1",
				                                    "d": "Name"
				                                }
				                            }
				                        }
				                    }
				                },
				                "mtx": "yes",
				                "m_u": "2020-01-18 12:38:29"
				            },
				            "last_changed": "2020-01-18 12:38:35",
				            "v_t_l": 500
				        },
				        "f8": {
				            "n": "f8",
				            "d": "Actress",
				            "f_t": "i_of",
				            "v_t": "s",
				            "m": "no",
				            "i": "no",
				            "f_o": 800,
				            "b_l": "yes",
				            "b_d": "yes",
				            "e": "yes",
				            "de": "yes",
				            "c_by": {
				                "t": "s",
				                "u_t": "user",
				                "v": "Nazira",
				                "_id": 2
				            },
				            "apr": "yes",
				            "apr_by": {
				                "t": "s",
				                "u_t": "user",
				                "v": "Nazira",
				                "_id": 2
				            },
				            "l": "yes",
				            "i_sno": 8,
				            "i_of": {
				                "c1": {
				                    "v": "Persons",
				                    "_id": "c1",
				                    "pfn": "f1",
				                    "e_f": {
				                        "e_f": {
				                            "f1": {
				                                "n": "f1",
				                                "d": "Name"
				                            }
				                        },
				                        "i_f": {
				                            "f1": {
				                                "n": "f1",
				                                "d": "Name"
				                            }
				                        },
				                        "b_f": {
				                            "f1": {
				                                "n": "f1",
				                                "d": "Name"
				                            }
				                        },
				                        "d_f": {
				                            "f1": {
				                                "n": "f1",
				                                "d": "Name"
				                            }
				                        }
				                    }
				                },
				                "c155": {
				                    "v": "Famous People in Andhra Pradesh",
				                    "_id": "c155",
				                    "pfn": "f1",
				                    "e_f": {
				                        "e_f": {
				                            "f1": {
				                                "n": "f1",
				                                "d": "Name"
				                            }
				                        },
				                        "i_f": {
				                            "f1": {
				                                "n": "f1",
				                                "d": "Name"
				                            }
				                        },
				                        "b_f": {
				                            "f1": {
				                                "n": "f1",
				                                "d": "Name"
				                            }
				                        },
				                        "d_f": {
				                            "f1": {
				                                "n": "f1",
				                                "d": "Name"
				                            }
				                        }
				                    }
				                }
				            },
				            "mtx": "yes",
				            "v_t_l": 50,
				            "m_u": "2020-01-18 12:41:52"
				        },
				        "f9": {
				            "n": "f9",
				            "d": "Movies",
				            "f_t": "i_of",
				            "v_t": "m",
				            "m": "no",
				            "i": "no",
				            "f_o": 900,
				            "b_l": "yes",
				            "b_d": "yes",
				            "e": "yes",
				            "de": "yes",
				            "c_by": {
				                "t": "s",
				                "u_t": "user",
				                "v": "Nazira",
				                "_id": 2
				            },
				            "apr": "yes",
				            "apr_by": {
				                "t": "s",
				                "u_t": "user",
				                "v": "Nazira",
				                "_id": 2
				            },
				            "l": "yes",
				            "i_sno": 9,
				            "i_of": {
				                "c2": {
				                    "v": "Cities",
				                    "_id": "c2",
				                    "pfn": "f1",
				                    "pfn_v": "City",
				                    "e_f": {
				                        "e_f": {
				                            "f1": {
				                                "n": "f1",
				                                "d": "City"
				                            }
				                        },
				                        "i_f": {
				                            "f1": {
				                                "n": "f1",
				                                "d": "City"
				                            }
				                        },
				                        "b_f": {
				                            "f1": {
				                                "n": "f1",
				                                "d": "City"
				                            }
				                        },
				                        "d_f": {
				                            "f1": {
				                                "n": "f1",
				                                "d": "City"
				                            }
				                        }
				                    }
				                },
				                "c1": {
				                    "v": "Persons",
				                    "_id": "c1",
				                    "pfn": "f1",
				                    "e_f": {
				                        "e_f": {
				                            "f1": {
				                                "n": "f1",
				                                "d": "Name"
				                            }
				                        },
				                        "i_f": {
				                            "f1": {
				                                "n": "f1",
				                                "d": "Name"
				                            }
				                        },
				                        "b_f": {
				                            "f1": {
				                                "n": "f1",
				                                "d": "Name"
				                            }
				                        },
				                        "d_f": {
				                            "f1": {
				                                "n": "f1",
				                                "d": "Name"
				                            }
				                        }
				                    }
				                }
				            },
				            "v_t_l": 50,
				            "m_u": "2020-01-18 12:41:52"
				        },
				    },
				    "f_g": [],
				    "a_g": [],
				    "p_c": [],
				    "c_of": [],
				    "m_i": "2020-01-18 12:37:13",
				    "m_u": "2020-01-18 12:55:29",
				    "count": 8
				}
			},
			mounted(){
			},
			methods:{
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