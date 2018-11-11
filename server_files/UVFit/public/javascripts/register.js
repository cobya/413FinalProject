/*
	Javascript used for getting registration account values and registering a new account.
*/

// On DOM ready, add event listeners and redirect if needed
$(function () {
	if (localStorage.hasOwnProperty("authToken")) {
		location.replace("dashboard.html");
		return;
	}

	$("#registerInfo").hide();

	$("#registerButton").click(registerNewAccount);
});

function registerNewAccount() {
	$("#registerInfo").hide();
	var enteredEmail = $("#emailAddress").val();
	var emailValid = true;
	var reEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
	if (!reEmail.test(enteredEmail)) {
		$("#registerInfo").show();
		$("#registerInfo").html("<p>" + "Please enter a correctly formatted email address." + "</p");
	}

	var enteredName = $("#fullName").val();
	var nameValid = true;
	if (enteredName == "") {
		nameValid = false;
	}
	if (!nameValid) {
		$("#registerInfo").show();
		$("#registerInfo").html("<p>" + "Please enter your full name." + "</p");
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
		$("#registerInfo").show();
		$("#registerInfo").html("<p>" + "Please enter a password that meets our password criteria." + "</p");
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
		$("#registerInfo").show();
		$("#registerInfo").html("<p>" + this.response.message + "</p");
		setTimeout(function () {
			location = "login.html";
		}, 5000);
	} else {
		// unsuccessful registration
		$("#registerInfo").show();
		$("#registerInfo").html("<p>Error: " + this.response.message + "</p");
	}
}