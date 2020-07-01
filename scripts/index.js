
///////////////////////////////////////////////////////////
// global variables.
///////////////////////////////////////////////////////////

backendURL = "http://cyathil.pythonanywhere.com";

///////////////////////////////////////////////////////////
// [load] family of functions actually modify the DOM.
///////////////////////////////////////////////////////////

/**
 * loading helpr queue.
 */
function loadQueue() {
	// send queue request.
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", `${backendURL}/queue`, true);
	// process queue request.
	// TODO: docs: when to use function() vs fat arrow function.
	// we use function() as we want to ensure that "this" refers to the xmlhttp object.
	xmlhttp.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			// the returned queue from backend.
			let queue = JSON.parse(this.responseText);
			if (queue.length === 0) {
				document.getElementById("requestList").innerHTML = "no requests in queue.";
			} else {
				// TODO: docs: using innerHTML vs appendChild().
				// reference commit e03c131.
				// first empty the list.
				document.getElementById("requestList").innerHTML = "";
				// now add items to the empty list.
				for (let i = 0; i < queue.length; i++) {
					let request = document.createElement("li");
					request.appendChild(document.createTextNode(`zid: ${queue[i]["zid"]}. `));
					request.appendChild(document.createTextNode(`description: ${queue[i]["description"]}. `));
					request.appendChild(document.createTextNode(`status: ${queue[i]["status"]}.`));
					// TODO: docs: anonymous function declarations and immediate invocations.
					// append form element containing three button elements.
					request.appendChild(function (request) {
						let form = document.createElement("form");
						// each button has an event listener attached.
						form.appendChild(generateButton(request, "help"));
						form.appendChild(generateButton(request, "resolve"));
						form.appendChild(generateButton(request, "cancel"));
						return form;
					}(queue[i]));
					// add item to list.
					document.getElementById("requestList").appendChild(request);
				}
			}
		}
	}
	xmlhttp.send();
}

///////////////////////////////////////////////////////////
// event listeners for DOM events.
///////////////////////////////////////////////////////////

/**
 * generate <button> element (with click event listener attatched).
 * @param {object} request 
 * @param {string} type 
 */
function generateButton(request, type) {
	let button = document.createElement("button");
	button.appendChild(document.createTextNode(`${type}`));
	// disallow cases where backend will throw BAD_REQUEST.
	if (request["status"] === "waiting" && type === "resolve") {
		button.disabled = true;
	} else if (request["status"] === "receiving" && (type === "help" || type === "cancel")) {
		button.disabled = true;
	}
	// TODO: docs: event listeners.
	// attach event listener.
	button.addEventListener("click", event => {
		event.preventDefault();
		const zid = request["zid"];
		const requestBody = JSON.stringify({
			"zid": zid,
		});
		// send request to backend.
		let xmlhttp = new XMLHttpRequest();
		const method = (type === "help") ? "POST" : "DELETE";
		xmlhttp.open(method, `${backendURL}/${type}`, true);
		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xmlhttp.onreadystatechange = function () {
			// when request has finished reload queue.
			if (this.readyState === 4 && this.status === 200) {
				loadQueue();
			}
		};
		xmlhttp.send(requestBody);
	})
	return button;
}

/**
 * makeRequestForm submission event listener.
 */
// TODO: docs: event listeners.
// the arrow function is called with the submit event as its argument when the submit event occurs.
document.getElementById("makeRequestForm").addEventListener("submit", event => {
	// stop the default behaviour of the submit event.
	event.preventDefault();
	// create json request body from makeRequestForm information.
	// TODO: docs: explain why below is the case.
	// note: explictly declaring makeRequestForm like below is optional in our use case,
	// as it has the exact same as the dom element.
	const makeRequestForm = document.getElementById("makeRequestForm");
	const zid = makeRequestForm["zid"].value;
	const description = makeRequestForm["description"].value;
	const requestBody = JSON.stringify({
		"zid": zid,
		"description": description,
	});
	// send request to backend.
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", `${backendURL}/make_request`, true);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlhttp.onreadystatechange = function () {
		// when request has finished reload queue.
		if (this.readyState === 4 && this.status === 200) {
			loadQueue();
		}
	};
	xmlhttp.send(requestBody);
});

/**
 * endSessionButton click event listener.
 */
// TODO: docs: event listeners.
// the arrow function is called with the click event as its argument when the click event occurs.
document.getElementById("endSessionButton").addEventListener("click", event => {
	// stop the default behaviour of the click event.
	event.preventDefault();
	// send request to backend.
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.open("DELETE", `${backendURL}/end`, true);
	xmlhttp.onreadystatechange = function () {
		// when request has finished reload queue.
		if (this.readyState === 4 && this.status === 200) {
			loadQueue();
		}
	};
	xmlhttp.send();
});

///////////////////////////////////////////////////////////
// bootstrap event handlers.
///////////////////////////////////////////////////////////

/**
 * executed when DOM, images, scripts etc. have all been loaded.
 */
window.onload = function () {
	loadQueue();
};
