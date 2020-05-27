window.onpopstate = function(event) {
  alert("kek: " + event.state);
};

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "August", "October", "November", "December"];

let colors = {
    "000": "#ffffff",
    "001": "rgba(245, 103, 72, 0.65)",
    "011": "linear-gradient(rgba(124, 173, 250, 1), rgba(245, 103, 72, 0.65))",
    "111": "linear-gradient(rgba(255, 197, 130, 0.65), rgba(124, 173, 250, 1), rgba(245, 103, 72, 0.65))",
    "110": "linear-gradient(rgba(255, 197, 130, 0.65), rgba(124, 173, 250, 1))",
    "100": "rgba(255, 197, 130, 0.65)",
    "101": "linear-gradient(rgba(245, 103, 72, 0.65), rgba(245, 103, 72, 0.65))",
    "010": "rgba(124, 173, 250, 1)"
}

var dbChangeListenner = null

var selectedYear = null
var selectedMonth = null
var selectedDate = null

var currentScreen = "login"

var currentUser = null
var userEvents = null

var links = null //Создаём переменную, в которой будут храниться ссылки
var loaded = true //Переменная, которая обозначает, загрузилась ли страница

let html = document.getElementById("html")

function initLinks() {
    links = document.getElementsByClassName("link_internal"); //Находим все ссылки на странице

    for (var i = 0; i < links.length; i++)
    {
   	 links[i].addEventListener("click", function (e) {
   		 e.preventDefault();
   		 openScreen(e.target.getAttribute("href"));  
   		 return false;
   	 });
    }
}

function requestEvents(callback) {
  if (userEvents == null) {
    firebase.database().ref('users/' + currentUser.uid + '/events').once('value').then(function(snapshot) {
        let events = snapshot.val()
        normalizeEvents(events)
        callback(userEvents)
    });
  } else {
     callback(userEvents)
  }
}

function authorize() {

  let today = new Date()
  selectedYear = today.getFullYear()
  selectedMonth = today.getMonth()
  selectedDate = today.getDate()

  let eventsRootRef = firebase.database().ref('users/' + currentUser.uid + '/events')
  eventsRootRef.on('value', function(snapshot) {
    let events = snapshot.val()
    normalizeEvents(events)
    console.log("db changed")
    if (dbChangeListenner != null) {
      dbChangeListenner()
    }
  });
}

function logout() {
  firebase.auth().signOut().then(function() {
  // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
}

function normalizeEvents(events) {
  userEvents = {}
  for (var eventName in events) {
    let event = events[eventName]
    let date = event.date != null ? event.date : "No Date"
    if (userEvents[event.date] == null) {
      userEvents[event.date] = []
    }
    userEvents[event.date].push(event)
  }
}

function uuidv4() {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function openScreen(screen) {
  console.log(screen)
  if (screen != currentScreen) {
    dbChangeListenner = null
    currentScreen = screen
    SendRequest("https://newboba-itirod.web.app/html/" + screen + ".html", function() {
      let newScript = document.createElement("script");
      newScript.src = "./js/" + screen + ".js"
      html.appendChild(newScript);
  });
  }
}

function SendRequest(link, callback) {
    let xhr = new XMLHttpRequest()
    xhr.open("GET", link, true)

    xhr.onreadystatechange = function() {
   	 if (xhr.readyState != 4) return;
   	 loaded = true;

   	 if (xhr.status == 200) {
       updatePage(xhr.responseText, link);
       callback()
   	 } else {
   		 alert("Loading error! Try again later.");
   		 console.log(xhr.status + ": " + xhr.statusText);
   	 }
    }

    loaded = false; //Говорим, что идёт загрузка

    //Устанавливаем таймер, который покажет сообщение о загрузке, если она не завершится через 2 секунды
    // setTimeout(ShowLoading, 2000);
    xhr.send(); //Отправляем запрос
}

function ShowLoading() {
    if(!loaded) {
   	 page.body.innerHTML = "Loading...";
    }
}

function updatePage(response, link) {
  html.innerHTML = response
  initLinks()
}

function displayUserName() {
  let element = document.getElementById("user-name")
  firebase.database().ref('users/' + currentUser.uid + '/personal').once('value').then(function(snapshot) {
      let personal = snapshot.val()
      console.log(personal)
      element.innerText = personal.name + " " + personal.surname + " (Logout)"
  })
}

initLinks()

firebase.auth().onAuthStateChanged(function(user) {
  if(user) {
    currentUser = user
    authorize()
    openScreen("calendar")
  } else {
    openScreen("login")
    console.log("!")
  }
});

