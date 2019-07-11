<?php
session_start();

require("RestAPI/jsonData.php");
require("db/DatabaseObject.php");


$database = new DatabaseObject($host, $username, $password, $database);

if(!isset($_SESSION['user_id']) && (!empty($_POST['login']) ))
{
	$username = $database->clean($_POST['username']);
	$password = $database->clean($_POST['password']);
	
	$result = $database->query("SELECT id, username, password FROM users WHERE username='$username' LIMIT 1");
	
	try 
	{
		if($database->num_rows($result) == 0) 
		{
			throw new Exception('User does not exist! Register first');
		}
	

		$user = $database->fetch($result);
	
		if(md5($password) != $user['password']) 
		{  	
			throw new Exception('Invalid password!');
		}
			
		
		
		$_SESSION['user_id'] = $user['id'];	
	
	}
	catch (Exception $e) 
	{
		echo $e->getMessage();
	}
}


/* DISPLAY */

$output = ob_get_clean();
require('templates/header.html');

if(isset($_SESSION['user_id'])) 
{	
	require('templates/menu.html');

	echo $output;
	
}
else
{
		echo"<div class='formContainer'>
		<form id='loginForm' action='./' method='POST'>
				<br><br/>
				<br><br/>
				<input type='text' name='username' placeholder='Username...'/><br />
				<br><br/>
				<!--DO ODZIELNEGO PLIKU (LOGIN.PHP) A W INDEX.PHP TO SAMO CO W MENU.HMTL-->
				<input type='password' name='password' placeholder='Password...' /><br />
				<br><br/>
				<input type='submit' name='login' value='Login' />
		
		</form>
		
		<div class='note'>
		<p>Don't have account yet?</p>
		<a href='register.php'>Register!</a> </p>
		</div>
		

</div>";
	echo "<p style='text-align:center;'>" . $output . "</p>";
	
	
}
			
?>




