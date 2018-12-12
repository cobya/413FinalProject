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
});

function changeType(newType, activityId) {
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", changeResponse);
	xhr.responseType = "json";
	xhr.open("PUT", '/activity/update/' + localStorage.getItem("deviceId") + "/" + activityId);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(JSON.stringify({ activityType: newType }));
	return;
}

function changeResponse() {
	location.reload();
}