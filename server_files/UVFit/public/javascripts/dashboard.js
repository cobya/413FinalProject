// On DOM ready, add event listeners and redirect if needed
$(function () {
	if (!localStorage.hasOwnProperty("authToken")) {
		location.replace("login.html");
		return;
	}

	if (localStorage.hasOwnProperty("deviceId")) {
		$("#registerUVFit").hide();
	} else {
		$("#updateUVFit").hide();
	}

	$("#signoutButton").click(signoutHandler);
	$("#registerUVFitButton").click(registerUVFit);
});

function signoutHandler() {
	localStorage.removeItem("authToken");
	localStorage.removeItem("deviceId");
	location.replace("index.html");
}

function registerUVFit() {

}