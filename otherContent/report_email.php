<?php 
	

	$errors = '';

	$myemail = 'thecombatdatabase@gmail.com';
	
	if(empty($_POST['name'])  ||   empty($_POST['email']) ||   empty($_POST['message']))
	{
	    $errors .= "\n Error: all fields are required";
	}

	$name = $_POST['name']; 
	$email_address = $_POST['email']; 
	$message = $_POST['message']; 
	$user = $_POST['uid']; 
	$page = $_POST['page'];

	if (!preg_match("/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i",	$email_address))
	{
	    $errors .= "\n Error: Invalid email address";
	}

	if(empty($errors))
	{
		echo "Worked";
		$to = $myemail;

		$email_subject = "Contact form submission: $name";

		$email_body = "You have received a new message. ".

		" Here are the details:\n Name: $name \n ".

		"Email: $email_address\n Message \n $message \n from $user \n about: $page";

		$headers = "From: $myemail\n";

		$headers .= "Reply-To: $email_address";

		if(mail($to,$email_subject,$email_body,$headers)){
			echo "mail sent yay!";
		}else{
			echo "something went wrong boo";
		}

		//redirect to the 'thank you' page
		//header('http://www.combatdatabase.co.uk/#/Contact');

	}else{
		echo $errors;
	}
	

?>