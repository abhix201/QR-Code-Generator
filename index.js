function handleSubmit(event) {
	event.preventDefault();
	
	// Get the input value and encode it
	let text = document.getElementById("inptxt").value;
	let encodedText = encodeURIComponent(text);

	// Generate the QR code source URL
	let qrsrc = `https://api.qrserver.com/v1/create-qr-code/?data=${encodedText}`;
	let qrimg = document.getElementById("qrimg");
	qrimg.src = qrsrc;

	// Update the href attribute of the download link
	let downloadLink = document.getElementById("downloadLink");
	downloadLink.href = qrsrc;

	// Show the download button
	downloadLink.style.display = "block";
}
