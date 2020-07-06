///////////////////////////////////////////////////////////
// global variables.
///////////////////////////////////////////////////////////

backendURL = "http://cyathil.pythonanywhere.com";

////////////////////////////////////////////////////////////////////////////////
// bootstrap on page load.
////////////////////////////////////////////////////////////////////////////////

// get current login.
const isStudent = window.sessionStorage.getItem("isStudent");
const zid = window.sessionStorage.getItem("zid");

if (zid && isStudent) {
	/* current login is valid student */

	/* fill in greeting. */
	document.getElementById("greeting").appendChild(function () {
		const p = document.createElement("p");
		p.appendChild(document.createTextNode(`hello student ${zid}.`));
		return p;
	}());

	/* fill in make request form */
	const makeRequestForm = document.getElementById("makeRequestForm");
	// <h2>make request form</h2>
	const h2 = document.createElement("h2");
	h2.appendChild(document.createTextNode("make request form"));
	// <p>
	// 	<label for="description">description:</label>
	// 	<input type="text" name="description">
	// </p>
	const p = document.createElement("p");
	const label = document.createElement("label");
	label.setAttribute("for", "description");
	label.appendChild(document.createTextNode("description"));
	const input = document.createElement("input");
	input.setAttribute("type", "text");
	input.setAttribute("name", "description");
	p.appendChild(label);
	p.appendChild(input);
	// inserting created elements into form.
	makeRequestForm.appendChild(h2);
	makeRequestForm.appendChild(p);

	// event listener for make request form.
	makeRequestForm.addEventListener("submit", event => {
		event.preventDefault();
		// create json request body from makeRequestForm information.
		const description = makeRequestForm["description"].value;
		const requestBody = JSON.stringify({
			"zid": zid,
			"description": description,
		});
		// send request to backend.
		let xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST", `${backendURL}/make_request`, true);
		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xmlhttp.send(requestBody);
	});

} else {
	/* current login is invalid student */

	// fill in greeting.
	document.getElementById("greeting").appendChild(function () {
		const p = document.createElement("p");
		console.log(typeof (p));
		// description of invalid login error.
		p.appendChild(document.createTextNode("boohoo. please visit "));
		// link to visit to login.
		const failLink = document.createElement("a");
		failLink.setAttribute("href", "/");
		failLink.appendChild(document.createTextNode("this"));
		p.appendChild(failLink);
		// continued description.
		p.appendChild(document.createTextNode(" link to login."));
		return p;
	}())

}
