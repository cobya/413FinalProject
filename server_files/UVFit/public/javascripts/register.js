/*
	Javascript used for getting registration account values and registering a new account.
*/

var $registerButton = $(document.getElementById("registerButton"));
$registerButton.click(registerNewAccount);

function registerNewAccount() {
	console.log("Register button clicked.");

	var enteredEmail = $("#emailAddress").val();
	var emailValid = true;
	var reEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
	if (!reEmail.test(enteredEmail)) {
		console.log("Please enter a correctly formatted email address.");
	}

	var enteredName = $("#fullName").val();
	var nameValid = true;
	if (enteredName == "") {
		nameValid = false;
	}
	if (!nameValid) {
		console.log("Please enter your full name.");
	}

	var enteredPass = $("#password").val();
	var passwordValid = true;
	var reLowerCase = /[a-z]/;
	var reUpperCase = /[A-Z]/;
	var reNumber = /[0-9]/;
	if (enteredPass.length < 8 || !reLowerCase.test(enteredPass) || !reUpperCase.test(enteredPass) || !reNumber.test(enteredPass)) {
		passwordValid = false;
	}
	if (!passwordValid) {
		console.log("Please enter a password that meets our password criteria.");
	}

	if (!passwordValid || !nameValid || !emailValid) {
		return;
	}

	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", registerResponse);
	xhr.responseType = "json";
	xhr.open("POST", '/users/register');
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(JSON.stringify({ email: enteredEmail, fullName: enteredName, password: enteredPass }));
}

function registerResponse() {
	if (this.status == 201) {
		// successful registration
		console.log(this.response.message);
	} else {
		// unsuccessful registration
		console.log(this.response.message);
	}
}