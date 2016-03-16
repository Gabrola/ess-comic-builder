<?php
$memes = array();
foreach(glob("../memes/*", GLOB_ONLYDIR) as $CategoryFile)
{
	$Category = basename($CategoryFile);
	foreach(glob($CategoryFile . "/*") as $MemeFile)
	{
		$PathInfo = pathinfo($MemeFile);
		$MemeTitle = basename($MemeFile, ".".$PathInfo['extension']);
		$MemePath = str_replace("../", "", $MemeFile);
		$memes[] = array(
			"category"=>$Category,
			"title"=>$MemeTitle,
			"path"=>$MemePath,
		);
	}
}

header("content-type:application/json");

if(isset($_GET['category']) && isset($_GET['q']))
{
	if($_GET['category'] == "" && $_GET['q'] == "")
	{
		echo json_encode(array());
		return;
	}
	
	$SearchMemes = array();
	foreach($memes as $meme)
	{
		if($_GET['category'] != "" && $meme['category'] != $_GET['category'])
			continue;
		
		if($_GET['q'] != "" && stripos($meme['title'], $_GET['q']) === false)
			continue;
		
		$SearchMemes[] = $meme;
	}
	
	echo json_encode($SearchMemes);
	return;
}

echo json_encode(array());
?>