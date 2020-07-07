///////////////////////////////////////////////////////////
// global variables.
///////////////////////////////////////////////////////////

backendURL = "http://cyathil.pythonanywhere.com";

///////////////////////////////////////////////////////////
// bootstrap.
///////////////////////////////////////////////////////////

// get current login.
const isTutor = window.sessionStorage.getItem("isTutor");
const zid = window.sessionStorage.getItem("zid");

// if current login is invalid.
if (!(zid && isTutor)) {
	// redirect user to the login page.
	window.location.href = "/";
}

// otherwise, perform callback function on page load.
window.onload = function () {

	// fill in greeting.
	document.getElementById("greeting").appendChild(function () {
		const p = document.createElement("p");
		p.appendChild(document.createTextNode(`hello tutor ${zid}.`));
		return p;
	}());

}
