<?php
/**
 * uses image url to check it for size and type and outputs the base64 data if valid
 */
header("content-type:application/json");
$result=array(
	"message"=>"Couldn't find image",
	"success"=>false
);
if(isset($_GET['image_url']) && $imageUrl=base64_decode(urldecode($_GET['image_url']))){
	$ch = curl_init(); 
    curl_setopt($ch, CURLOPT_URL,$imageUrl);
    // only getting headers for faster validation
    curl_setopt($ch, CURLOPT_NOBODY, 1);
    curl_setopt($ch, CURLOPT_FAILONERROR, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    if(curl_exec($ch)!==FALSE){
    	$fileType=curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    	$length=curl_getinfo($ch, CURLINFO_CONTENT_LENGTH_DOWNLOAD);
		if($length/(1024*1024)<=5){
			if(in_array($fileType,array("image/gif","image/jpg","image/png","image/jpeg"))){
				$result=array(
					"success"=>true,
					"message"=>"data:{$fileType};base64,".base64_encode(file_get_contents($imageUrl)) 
				);
			}else $result["message"]="Supplied URL is not an image";
		}else $result["message"]="Image must be less than 5mb";
    }
}
print json_encode($result);
