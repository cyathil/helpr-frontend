function loadQueue() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET","http://localhost:8080/queue",true);
	// we use function() as we want to ensure that "this" refers to the xmlhttp object.
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var queue = JSON.parse(this.responseText);
			console.log("the queue is:");
			console.log(queue);
			if (queue["length"] === 0) {
				document.getElementById("helprQueue").innerHTML = `no students in queue.`;
			} else {
				document.getElementById("helprQueue").innerHTML = `the zid of the first person in line is ${queue[0]["zid"]}.`;
			}
		};
	}
	xmlhttp.send();
}

/*
 * handling makeRequestForm submission.
 */
// the arrow function is called with the submit event as its argument when the submit event occurs.
document.getElementById("makeRequestForm").addEventListener("submit", event => {
	// stop the default behaviour of the submit event.
	event.preventDefault();
	// create json request body from makeRequestForm information.
	const zid = makeRequestForm["zid"]["value"]; 
	const description = makeRequestForm["description"]["value"];
	const requestBody = JSON.stringify({
		"zid": zid,
		"description": description,
	});
	// send request to backend.
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "http://localhost:8080/make_request", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			loadQueue();
		}
	};
	xmlhttp.send(requestBody);
});

/*
 * handling endSessionButton.
 */
// the arrow function is called with the click event as its argument when the click event occurs.
document.getElementById("endSessionButton").addEventListener("click", event => {
	// stop the default behaviour of the click event.
	event.preventDefault();
	// send request to backend.
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("DELETE", "http://localhost:8080/end", true);
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			loadQueue();
		}
	};
	xmlhttp.send();
});

loadQueue();