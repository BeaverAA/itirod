let nameInput = document.getElementById("name");
let surnameInput = document.getElementById("surname");
let emailInput = document.getElementById("email");
let password1Input = document.getElementById("password1");
let password2Input = document.getElementById("password2");

let database = firebase.database();

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

	firebase.database().ref('users/' + user.uid + '/presonal').set({
    	name: name,
    	surname: surname,
    	email: email
  	});

}

// firebase.auth().signOut().then(function() {
  
// }).catch(function(error) {
  
// });

firebase.auth().onAuthStateChanged(function(user) {
  if(user) {

 	firebase.database().ref('users/' + user.uid + '/presonal').once('value').then(function(snapshot) {
 		console.log(snapshot.val())
	});

  	// console.log(user.email)
  	// saveData(user)
  	// window.open("./../html/calendar.html","_self");
  } else {
  	console.log("!")
  }
});