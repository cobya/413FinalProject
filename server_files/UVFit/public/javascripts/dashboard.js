// On DOM ready, add event listeners and redirect if needed
$(function () {
	if (!localStorage.hasOwnProperty("authToken")) {
		location.replace("login.html");
		return;
	}

	$("#regUpdateInfo").hide();

	getAcctData();

	if (localStorage.hasOwnProperty("deviceId")) {
		$("#registerUVFit").hide();
		$("#pDevId").html("<b>Current Device ID:</b> " + localStorage.getItem("deviceId"));
		$("#pApiKey").html("<b>Current API Key:</b> " + localStorage.getItem("apiKey"));
		getUVFitRecentStats();
	} else {
		$("#updateUVFit").hide();
		$("#currDevInfo").hide();
	}

	$("#signoutButton").click(signoutHandler);
	$("#registerUVFitButton").click(registerUVFit);
	$("#updateUVFitButton").click(updateUVFit);
	$("#thresholdButton").click(updateThreshold);
});

// on load, get the recent UV fit data
function getUVFitRecentStats() {
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", responseUVFitRecentStats);
	xhr.responseType = "json";
	xhr.open("GET", '/uvfitdata/' + localStorage.getItem("deviceId"));
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(JSON.stringify({}));
}

// on load, get acct data
function getAcctData() {
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", responseAcctData);
	xhr.responseType = "json";
	xhr.open("GET", '/users/' + localStorage.getItem("userEmail"));
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(JSON.stringify({}));
}

// function to show acct data
function responseAcctData(data, textStatus, jqXHR) {
	if (this.response.success){
		console.log("acct data")
		console.log(this.response.registeredUser)
		$("#pAcctEmail").html("<b>Account Email:</b> " + this.response.registeredUser[0].email);
		$("#pAcctName").html("<b>Account Name:</b> " + this.response.registeredUser[0].fullName);
		$("#pAcctThreshold").html("<b>Current UV Threshold:</b> " + this.response.registeredUser[0].exposureAlert)
	}
}

// function to show recent UV fit data
function responseUVFitRecentStats(data, textStatus, jqXHR) {
	if (this.response.success){
		maxData = Math.min(this.response.submittedData, 100);

    for(var i=0;i<maxData;i++)
    {
        var tr="<tr>";
        var td1="<td>"+this.response.submittedData[i]["timeCollected"]+"</td>";
        var td2="<td>"+this.response.submittedData[i]["gpsLocationX"]+"</td>";
        var td3="<td>"+this.response.submittedData[i]["gpsLocationY"]+"</td>";
        var td4="<td>"+this.response.submittedData[i]["measuredUV"]+"</td>";
        var td5="<td>"+this.response.submittedData[i]["measuredSpeed"]+"</td></tr>";

       $("#uvFitDataTable").append(tr+td1+td2+td3+td4+td5); 
    }  
	}
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
		localStorage.setItem("deviceId", this.response.deviceId)
		localStorage.setItem("apiKey", this.response.apiKey)
		location.reload();
	} else {
		$("#regUpdateInfo").show();
		$("#regUpdateInfo").html("<p>" + "Error: " + this.response.error + "</p>");
	}
}

// allow update of UV fit on a user acct
function updateUVFit() {
	var enteredId = $("#uvFitDeviceIdUpdate").val();
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
	// 202 is successful update
	if (this.status == 202) {
		console.log(this)
		localStorage.setItem("deviceId", this.response.deviceId)
		localStorage.setItem("apiKey", this.response.apiKey)
		location.reload();
	} else {
		$("#regUpdateInfo").show();
		$("#regUpdateInfo").html("<p>" + "Error: " + this.response.error + "</p>");
	}
}

function reloadResponse() {
	location.reload();
}

// allow update of UV threshold on a user acct
function updateThreshold() {
	var accessToken = $("#accessToken").val();
	var enteredThreshold = $("#thresholdUpdate").val();
	if (!enteredThreshold || !accessToken) return;

	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", updateResponse);
	xhr.responseType = "json";
	xhr.open("PUT", '/users/updatethres/' + localStorage.getItem("userEmail"));
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(JSON.stringify({ threshold: enteredThreshold }));

	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", reloadResponse);
	xhr.responseType = "json";
	xhr.open("POST", "https://api.particle.io/v1/devices/" + localStorage.getItem("deviceId") + "/getThreshold");
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(JSON.stringify({ access_token: accessToken, threshold: enteredThreshold }));
}