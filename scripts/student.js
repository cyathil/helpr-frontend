///////////////////////////////////////////////////////////
// global variables.
///////////////////////////////////////////////////////////

backendURL = "http://cyathil.pythonanywhere.com";

////////////////////////////////////////////////////////////////////////////////
// bootstrap.
////////////////////////////////////////////////////////////////////////////////

// get current login.
const isStudent = window.sessionStorage.getItem("isStudent");
const zid = window.sessionStorage.getItem("zid");

// if current login is invalid.
if (!(zid && isStudent)) {
	// redirect user to the login page.
	window.location.href = "/";
}

// otherwise, perform callback function on page load.
window.onload = function() {

	// fill in greeting.
	document.getElementById("greeting").appendChild(function () {
		const p = document.createElement("p");
		p.appendChild(document.createTextNode(`hello student ${zid}.`));
		return p;
	}());

	// add event listener for make request form submission.
	document.getElementById("makeRequestForm").addEventListener("submit", event => {
		event.preventDefault();
		// create json request body from makeRequestForm information.
		const description = makeRequestForm["description"].value;
		const requestBody = JSON.stringify({
			// taken from sessionStorage.
			"zid": zid,
			"description": description,
		});
		// send request to backend.
		let xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST", `${backendURL}/make_request`, true);
		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xmlhttp.send(requestBody);
	});

}
