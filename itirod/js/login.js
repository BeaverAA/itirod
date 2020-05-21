let emailInput = document.getElementById("email");
let passwordInput = document.getElementById("password");

function signin() {
	let email = emailInput.value
	let password = passwordInput.value

	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  		var errorCode = error.code;
  		var errorMessage = error.message;
	});
}

firebase.auth().onAuthStateChanged(function(user) {
  if(user) {
  	console.log(firebase.auth().currentUser)
  	window.open("./../html/calendar.html","_self");
  } else {
  	console.log("!")
  }
});