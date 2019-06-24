<?php

	$EmailFrom = "thecombatdatabase@gmail.com";
	$EmailTo = "thecombatdatabase@gmail.com";
	$Subject = "online form";
	$Name = Trim(stripslashes($_POST['name']));
	$Email = Trim(stripslashes($_POST['email']));
	
	$Message = Trim(stripslashes($_POST['message']));
	// validation
	$validationOK=true;
	if (!$validationOK) {
	  echo "please check your details";
	  header("Location: http://yourdommain.co.uk/contact.php");
	  exit;
	}

	// prepare email body text

	$Body = "";
	$Body .= "Name: ";
	$Body .= $Name;
	$Body .= "\n";
	$Body .= "Tel: ";
	$Body .= $Tel;
	$Body .= "\n";
	$Body .= "Email: ";
	$Body .= $Email;
	$Body .= "\n";
	$Body .= "Message: ";
	$Body .= $Message;
	$Body .= "\n";

	// send email
	$success = mail($EmailTo, $Subject, $Body, "From: <$EmailFrom>");

	// redirect to success page
	if ($success){
	  print "email sent";
	}
	else{
	  /*print "<meta http-equiv=\"refresh\" content=\"1;URL=index.php\">";*/
	  print "email not sent";
	}
?>