document.getElementById("studentForm").addEventListener("submit", (event) => {
	event.preventDefault();
	//console.log(event);
	//console.log(document.getElementById("studentForm"));
	const studentForm = document.getElementById("studentForm");
	const zid = studentForm["zid"].value;
	console.log(zid);
	//sessionStorage.setItem("zid", zid);
})