
function register() {
	let emailInput = document.getElementById("email");
	let password1Input = document.getElementById("password1");
	let password2Input = document.getElementById("password2");
	let nameInput = document.getElementById("name");
	let surnameInput = document.getElementById("surname");

	let email = emailInput.value
	let password1 = password1Input.value
	let password2 = password2Input.value

	let name = nameInput.value
	let surname = surnameInput.value

	if (name == "" || surname == "") {
		alert("Invalid Data")
		return
	}

	firebase.auth().createUserWithEmailAndPassword(email, password1).catch(function(error) {
  		let errorCode = error.code
  		let errorMessage = error.message
  		alert(errorMessage)
	})
}

function saveData(user) {
	let emailInput = document.getElementById("email");
	let nameInput = document.getElementById("name");
	let surnameInput = document.getElementById("surname");

	let name = nameInput.value
	let surname = surnameInput.value
	let email = emailInput.value

	firebase.database().ref('users/' + user.uid + '/personal').set({
    	name: name,
    	surname: surname,
    	email: email
  	});
}