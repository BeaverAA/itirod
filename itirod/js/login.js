
function signin() {
	let emailInput = document.getElementById("email");
	let passwordInput = document.getElementById("password");
	let email = emailInput.value
	let password = passwordInput.value

	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  		var errorCode = error.code
  		var errorMessage = error.message
  		alert(errorMessage)
	});
}

// dbChangeListenner = null