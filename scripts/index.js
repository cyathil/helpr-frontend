
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
				document.getElementById("helprQueue").innerHTML = `no students in queue.`;
			} else {
				function generateButton(request,type) {
					return `<button class=${type} value=${request["zid"]}>${type}</button>`
				}
				function generateButtonForm(request) {
					buttonsText = "";
					buttonsText += "<form>";
					// TODO: add event listeners for any button in a given request div.
					// depending on the type of button, send a specific http request as needed.
					buttonsText += generateButton(request,"help");
					buttonsText += generateButton(request,"resolve");
					buttonsText += generateButton(request,"cancel");
					buttonsText += "</form>";
					return buttonsText;
				}
				function generateQueueText(queue) {
					queueText = "the queue is:<br>";
					for (let i = 0; i < queue.length; i++) {
						queueText += `${i + 1}: `;
						queueText += `zid: ${queue[i]["zid"]}. `;
						queueText += `description: ${queue[i]["description"]}. `;
						queueText += `status: ${queue[i]["status"]}.`;
						queueText += generateButtonForm(queue[i]);
						if (i + 1 !== queue.length) {
							queueText += "<br>"
						}
					}
					return queueText;
				}
				document.getElementById("helprQueue").innerHTML = generateQueueText(queue);
			}
		};
	}
	xmlhttp.send();
}

///////////////////////////////////////////////////////////
// event listeners for DOM events.
///////////////////////////////////////////////////////////

/**
 * handling makeRequestForm submission.
 */
// the arrow function is called with the submit event as its argument when the submit event occurs.
document.getElementById("makeRequestForm").addEventListener("submit", event => {
	// stop the default behaviour of the submit event.
	event.preventDefault();
	// create json request body from makeRequestForm information.
	// note: explictly declaring makeRequestForm like below is optional in our use case,
	// as it has the exact same as the dom element.
	const makeRequestForm = document.getElementById("makeRequestForm");
	const zid = makeRequestForm["zid"]["value"]; 
	const description = makeRequestForm["description"]["value"];
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
 * handling endSessionButton.
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
