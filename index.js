var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
	if (this.readyState == 4 && this.status == 200) {
		var myObj = JSON.parse(this.responseText);
		document.getElementById("hello").innerHTML = `the zid of the first person in line is ${myObj[0]['zid']}.`;
	}
};
xmlhttp.open("GET", "http://localhost:8080/queue", true);
xmlhttp.send();