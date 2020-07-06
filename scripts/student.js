// get current student login.
const isStudent = window.sessionStorage.getItem("isStudent");
const zid = window.sessionStorage.getItem("zid");
// set greeting based on login status.
const element = (zid && isStudent) ? generateSuccessElement() : generateFailElement();
document.getElementById("greeting").appendChild(element);

/**
 * returns the element to append if valid student login.
 */
function generateSuccessElement() {
	return document.createTextNode(`hello student ${zid}.`);
}

/**
 * returns the element to append if invalid student login.
 */
function generateFailElement() {
	const failElement = document.createElement("p");
	// description of invalid login error.
	failElement.appendChild(document.createTextNode("boohoo. please visit "));
	// link to visit to login.
	const failLink = document.createElement("a");
	failLink.setAttribute("href", "/");
	failLink.appendChild(document.createTextNode("this"));
	failElement.appendChild(failLink);
	// continued description.
	failElement.appendChild(document.createTextNode(" link to login."));
	return failElement;
}