var nameInput = document.getElementById("name");
var surnameInput = document.getElementById("surname");
var emailInput = document.getElementById("email");
var password1Input = document.getElementById("password1");
var password2Input = document.getElementById("password2");

function register() {
	let email = emailInput.value
	let password1 = password1Input.value
	let password2 = password2Input.value

	firebase.auth().createUserWithEmailAndPassword(email, password1).catch(function(error) {
  		let errorCode = error.code;
  		let errorMessage = error.message;
  		console.log(errorMessage)
	})
}

function saveData(user) {
	let name = nameInput.value
	let surname = surnameInput.value
	let email = emailInput.value

	firebase.database().ref('users/' + user.uid + '/personal').set({
    	name: name,
    	surname: surname,
    	email: email
  	});
}

firebase.auth().onAuthStateChanged(function(user) {
  if(user) {
    saveData(user)
  } else {
    
  }
});

dbChangeListenner = null