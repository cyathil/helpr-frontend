
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
	xmlhttp.open("GET",`${backendURL}/queue`,true);
	// process queue request.
	// we use function() as we want to ensure that "this" refers to the xmlhttp object.
	xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			let queue = JSON.parse(this.responseText);
			console.log("the queue is:");
			console.log(queue);
			if (queue.length === 0) {
				document.getElementById("helprQueueList").innerHTML = "no students in queue.";
			} else {
				// first empty the list.
				document.getElementById("helprQueueList").innerHTML = "";
				// now add items to the empty list.
				for (let i = 0; i < queue.length; i++) {
					let queueListItem = document.createElement("li");
					queueListItem.appendChild(document.createTextNode(`zid: ${queue[i]["zid"]} `));
					queueListItem.appendChild(document.createTextNode(`description: ${queue[i]["description"]} `));
					queueListItem.appendChild(document.createTextNode(`status: ${queue[i]["status"]} `));
					queueListItem.appendChild(generateButtonForm(queue[i]));
					// add item to list.
					document.getElementById("helprQueueList").appendChild(queueListItem);
				}


			}
		};
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
	button.className = type;
	button.value = request["zid"];
	button.appendChild(document.createTextNode(`${type}`));
	// the arrow function is called with the click event as its argument when the click event occurs.
	button.addEventListener("click", event => {
		// stop the default behaviour of the click event.
		event.preventDefault();
		// create json request body from button information.
		const zid = button.value;
		const requestBody = JSON.stringify({
			"zid": zid,
		});
		// send request to backend.
		let xmlhttp = new XMLHttpRequest();
		let method = (button.className === "help") ? "POST" : "DELETE";
		xmlhttp.open(method, `${backendURL}/${button.className}`, true);
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
// the arrow function is called with the submit event as its argument when the submit event occurs.
document.getElementById("makeRequestForm").addEventListener("submit", event => {
	// stop the default behaviour of the submit event.
	event.preventDefault();
	// create json request body from makeRequestForm information.
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
	xmlhttp.onreadystatechange = function() {
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
// the arrow function is called with the click event as its argument when the click event occurs.
document.getElementById("endSessionButton").addEventListener("click", event => {
	// stop the default behaviour of the click event.
	event.preventDefault();
	// send request to backend.
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.open("DELETE", `${backendURL}/end`, true);
	xmlhttp.onreadystatechange = function() {
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
window.onload = function() {
	loadQueue();
};

///////////////////////////////////////////////////////////
// helper functions.
///////////////////////////////////////////////////////////

/**
 * generate <form> element.
 * @param {object} request 
 */
function generateButtonForm(request) {
	let form = document.createElement("form");
	form.className = "buttonForm";
	// each button has an event listener attached.
	form.appendChild(generateButton(request, "help"));
	form.appendChild(generateButton(request, "resolve"));
	form.appendChild(generateButton(request, "cancel"));
	return form;
}
