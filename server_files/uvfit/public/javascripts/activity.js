// On DOM ready, add event listeners and redirect if needed
$(function () {
	if (!localStorage.hasOwnProperty("authToken")) {
		location.replace("login.html");
		return;
	}

	if (!localStorage.hasOwnProperty("deviceId")) {
		location.replace("dashboard.html");
		return;
	}

	getRecentActivities();

	$("#signoutButton").click(signoutHandler);
	$("#registerUVFitButton").click(registerUVFit);
	$("#updateUVFitButton").click(updateUVFit);
});

function getRecentActivities() {
	return
}