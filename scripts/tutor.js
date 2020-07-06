// get current tutor login.
const isTutor = window.sessionStorage.getItem("isTutor");
const zid = window.sessionStorage.getItem("zid");
// set greeting based on login status.
const element = (zid && isTutor) ? generateSuccessElement() : generateFailElement();
document.getElementById("greeting").appendChild(element);

/**
 * returns the element to append if valid tutor login.
 */
function generateSuccessElement() {
	return document.createTextNode(`hello tutor ${zid}.`);
}

/**
 * returns the element to append if invalid tutor login.
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