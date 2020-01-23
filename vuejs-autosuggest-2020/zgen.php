<?php
	if( 1==15 ){
		echo "<pre>";
		$dd = [];
		$cnt=1;
		$d =json_decode(file_get_contents("znames.json"),true);
		foreach($d as $s=>$c){
			$kk =[];
			foreach( $c as $k=>$l ){
				$kk[] = "\"".$k."\"=>\"".$l."\"";
			}
			$dd[ $c["name"] . rand(1,555) ] = "[" . implode(",",$kk) . "]";
		}
		ksort($dd);
		echo implode(",\n",array_values($dd));
		file_put_contents("znames.php", "<?php\n\$names=[\n".implode(",\n", array_values($dd) ) . "\n];\n?>");
		chmod("znames.php",0777);
		exit;
	}
?>