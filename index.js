function handleSubmit(event) {
	event.preventDefault();
	let text = document.getElementById("inptxt").value;
	let qrsrc = `https://api.qrserver.com/v1/create-qr-code/?data=${text}`;
	let qrimg = document.getElementById("qrimg");
	qrimg.src = qrsrc;
  
	// Update the href attribute of the download link
	let downloadLink = document.getElementById("downloadLink");
	downloadLink.href = qrsrc;
  
	// Show the download button
	downloadLink.style.display = "block";
  }
  //With these changes, the "Download QR Code" button will trigger a direct download of the generated QR code image with the filename "qrcode.png" when clicked.
  
  
  
  
  
  
