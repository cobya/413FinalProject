// On DOM ready, add event listeners and redirect if needed
$(function () {
	if (!localStorage.hasOwnProperty("authToken")) {
		location.replace("login.html");
		return;
	}

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

function getUVFitRecentStats() {
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", responseUVFitRecentStats);
	xhr.responseType = "json";
	xhr.open("GET", '/uvfit/' + localStorage.getItem("userEmail"));
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(JSON.stringify({ email: localStorage.getItem("userEmail"), deviceId: localStorage.getItem("deviceId") }));
}

function responseUVFitRecentStats() {

}

function signoutHandler() {
	localStorage.removeItem("userEmail");
	localStorage.removeItem("authToken");
	localStorage.removeItem("deviceId");
	location.replace("index.html");
}

function registerUVFit() {
	var enteredId = $("#uvFitDeviceIdReg").val();
	if (!enteredId) return;

	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", registerResponse);
	xhr.responseType = "json";
	xhr.open("POST", '/uvfit/register');
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(JSON.stringify({ email: localStorage.getItem("userEmail"), deviceId: enteredId }));
}

function registerResponse() {

}

function updateUVFit() {
	var enteredId = $("#uvFitDeviceIdReg").val();
	if (!enteredId) return;

	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", updateResponse);
	xhr.responseType = "json";
	xhr.open("PUT", '/uvfit/');
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(JSON.stringify({ email: localStorage.getItem("userEmail"), deviceId: enteredId }));
}

function updateResponse() {

}