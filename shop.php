<?php

session_start();
require("templates/header.html");
require("RestAPI/jsonData.php");
require("db/DatabaseObject.php");

$database = new DatabaseObject($host, $username, $password, $database);

$id = $_SESSION['user_id'];


$result = $database->query("SELECT id, exp, strength FROM users WHERE id='$id' LIMIT 1");

$user = $database->fetch($result);

$strength = $user['strength'];
$exp = $user['exp'];

if(!empty($_POST['buy']) )
{
	$strength_number = $database->clean($_POST['strength']);
	
	try 
	{ 	
		
		if($exp < 5)
		{
			echo 
			" <div class='info'>
				
				 
				You don't have exp points! </br></br> Kill monsters to earn some ! </br>
				</br>
				<a href=http://localhost/rpg>GO BACK!</a>
				
			 
			  </div>";
			
		}
		
		if (!isset($_POST['buy']))
		{
			throw new Exception("Check the box !");
		}
		
		if($strength_number > 0 && $exp > 5 )
		{
			$exp -= $strength_number;
			
			if ($exp <= 0)
			{
				$exp = min(1, TRUE);
			}
			
			$strength += $strength_number;
			
			
		
			$sql = $database->query("UPDATE users SET strength = $strength, exp = $exp WHERE id = '$id'");
			echo 
			
			"<div class='info'>
			
				Buy $strength_number strength </br>
				Left $exp experience points </br>
				<a href='http://localhost/rpg'>GO BACK!</a> </p>
			
			</div>";
		}
		
	}
	catch (Exception $e) 
	{
		echo $e->getMessage();
	}
}

?>

