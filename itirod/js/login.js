var emailInput = document.getElementById("email");
var passwordInput = document.getElementById("password");

function signin() {
	let email = emailInput.value
	let password = passwordInput.value

	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  		var errorCode = error.code
  		var errorMessage = error.message
  		alert(errorMessage)
	});
}

dbChangeListenner = null