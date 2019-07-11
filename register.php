<?php
require("db/DatabaseObject.php");

$database = new DatabaseObject($host, $username, $password, $database);

if(!empty($_POST['register'])) 
{
	$username = $database->clean($_POST['username']);
	$password = $database->clean($_POST['password1']);
	
	try 
	{
		// Username
		if(strlen($username) < 5) 
		{
			throw new Exception('Username must be at least 5 characters!');
		}
		
		if(strlen($username) > 50) 
		{
			throw new Exception('Username must be shorter than 50 characters!');
		}
		
		if(!ctype_alnum($username)) 
		{
			throw new Exception("Username must be only letters or numbers!");
		}
		
		// Password
		if(strlen($password) < 6) 
		{
			throw new Exception('Password must be at least 6 characters!');
		}
		
		$password1 = $_POST['password1'];
		$password2 = $_POST['password2'];
		
		if($password1!=$password2)
		{
			throw new Exception ("Password's must be the same!");
		}
		
		
		//E-mail
		if (isset($_POST['email']))
		{
			$email = $_POST['email'];
			$email_save = filter_var($email, FILTER_SANITIZE_EMAIL);
			
			if ((filter_var($email_save, FILTER_VALIDATE_EMAIL)==false) || ($email_save!=$email))
			{
				throw new Exception('Please write correct email !!!<br/>(forgot "@" probably)');
			}
		}
		
		// Assent statute
		if (!isset($_POST['statute']))
		{
			throw new Exception("Accept statute !");
		}
		
		
		//Check Email in database
		$result = $database->query("SELECT id FROM users WHERE email = '$email'");
		$how_many_emails = $result->num_rows;
			
			if($how_many_emails>0)
			{
				throw new Exception("Account with this email is already exists");
			}
		
		//Check Login in database
		$result = $database->query("SELECT id FROM users WHERE username = '$username'"); 
		$how_many_users = $result->num_rows;
			
			if($how_many_users>0)
			{
				throw new Exception("This nick its already in use! Try another one!");
			}
		
		// Submit to database
		$password = md5($password);
		$database->query("INSERT INTO users ()
		VALUES (
			NULL, 
				'$username', 
				'$password', 
				'$email',
				7,
				30,
				2
				
				)");
	
			if($database->affected_rows() > 0) 
			{
				echo "<div class='note'> Account created!!!<br/> Go to login site! 
				<a href='./'>Login</a><br /></div>";
			}
	
	}
	
	catch (Exception $e) 
	{
		echo $e->getMessage();
	}
}
$output = ob_get_clean();
require('templates/header.html');
echo "<p style='text-align:center;'>" . $output . "</p>";

?>

<div class='formContainer'>
	<form id="registerForm" action='./register.php' method='POST'>
													
		<input type='text' name='username' placeholder="Username..." /><h4>(min. 5 characters)</h4>
		
		<input type='password' name='password1' placeholder="Password..."/><h4>(min. 6 characters)</h4>
		<input type="password" name="password2" placeholder="Repeat Password..."/><h4>(min. 6 characters)</h4>
		<input id="email" type='text' name='email' placeholder="E-mail..."/><br />
		<!--
		--><p> Assent statute</p>
		<input id="statute" type="checkbox" name="statute" /> <br />
		<input id="register" type='submit' name='register' value='Register' /> <br />
		
	</form>
	
	<div class="note">
		<p>Have account already?</p>
		<a href="index.php">Login!</a> </p>
	</div>
	
</div>


