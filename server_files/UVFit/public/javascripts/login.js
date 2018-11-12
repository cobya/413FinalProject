// On DOM ready, add event listeners and redirect if needed
$(function () {
	if (localStorage.hasOwnProperty("authToken")) {
		location.replace("dashboard.html");
		return;
	}

	$("#loginErrors").hide();

	$("#loginButton").click(runLogin);
});

function runLogin() {
	$("#loginErrors").hide();
	var email = $("#emailAddress").val();
	var password = $("#password").val();

	if (!email || !password) {
		$("#loginErrors").show();
		$("#loginErrors").html("<p>Please enter both email and password.</p>");
		return;
	}

	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", loginResponse);
	xhr.responseType = "json";
	xhr.open("POST", '/users/login');
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(JSON.stringify({ email: email, password: password }));
}

function loginResponse() {
	// 201 is successful login
	if (this.status === 201) {
		localStorage.setItem("userEmail", this.response.email);
		localStorage.setItem("authToken", this.response.token);
		if (this.response.deviceId != null) {
			localStorage.setItem("deviceId", this.response.deviceId);
		}
		if (this.response.apiKey != null) {
			localStorage.setItem("apiKey", this.response.apiKey);
		}
		location = "dashboard.html";
	}
	else {
		$("#loginErrors").show();
		$("#loginErrors").html("<p>" + "Error: " + this.response.error + "</p>");
	}
}