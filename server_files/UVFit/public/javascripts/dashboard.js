// On DOM ready, add event listeners and redirect if needed
$(function () {
	if (!localStorage.hasOwnProperty("authToken")) {
		location.replace("login.html");
		return;
	}

	$("#regUpdateInfo").hide();

	if (localStorage.hasOwnProperty("deviceId")) {
		$("#registerUVFit").hide();
		$("#pDevId").text("Current Device ID: " + localStorage.getItem("deviceId"));
		$("#pApiKey").text("Current API Key: " + localStorage.getItem("apiKey"));
		getUVFitRecentStats();
	} else {
		$("#updateUVFit").hide();
		$("#currDevInfo").hide();
	}

	$("#signoutButton").click(signoutHandler);
	$("#registerUVFitButton").click(registerUVFit);
	$("#updateUVFitButton").click(updateUVFit);
});

// on load, get the recent UV fit data
function getUVFitRecentStats() {
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", responseUVFitRecentStats);
	xhr.responseType = "json";
	xhr.open("GET", '/uvfit/' + localStorage.getItem("userEmail"));
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(JSON.stringify({ email: localStorage.getItem("userEmail"), deviceId: localStorage.getItem("deviceId") }));
}

// function to show recent UV fit data
function responseUVFitRecentStats() {

}

// handle user sign outs
function signoutHandler() {
	localStorage.removeItem("userEmail");
	localStorage.removeItem("authToken");
	localStorage.removeItem("deviceId");
	localStorage.removeItem("apiKey");
	location.replace("index.html");
}

// allow the user to register a new UV fit if one is not registered
function registerUVFit() {
	console.log("Attempt UV Fit register");
	var enteredId = $("#uvFitDeviceIdReg").val();
	if (!enteredId) return;
	$("#regUpdateInfo").hide();

	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", registerResponse);
	xhr.responseType = "json";
	xhr.open("POST", '/uvfit/register');
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(JSON.stringify({ email: localStorage.getItem("userEmail"), deviceId: enteredId }));
}

// handle registration UV Fit response
function registerResponse() {
	// 201 is successful register
	if (this.status == 201) {
		$("#registerInfo").show();
		$("#registerInfo").html("<p>" + this.response.message + "</p");
	} else {
		$("#regUpdateInfo").show();
		$("#regUpdateInfo").html("<p>" + "Error: " + this.response.error + "</p>");
	}
}

// allow update of UV fit on a user acct
function updateUVFit() {
	console.log("Attempt UV Fit update");
	var enteredId = $("#uvFitDeviceIdReg").val();
	if (!enteredId) return;
	$("#regUpdateInfo").hide();

	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", updateResponse);
	xhr.responseType = "json";
	xhr.open("PUT", '/uvfit/update/' + localStorage.getItem("userEmail"));
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(JSON.stringify({ deviceId: enteredId }));
}

// handle update UV fit response
function updateResponse() {
	// 201 is successful update
	if (this.status == 204) {
		$("#registerInfo").show();
		$("#registerInfo").html("<p>" + this.response.message + "</p");
	} else {
		$("#regUpdateInfo").show();
		$("#regUpdateInfo").html("<p>" + "Error: " + this.response.error + "</p>");
	}
}