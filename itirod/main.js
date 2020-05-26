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

function normalizeEvents(events) {
  userEvents = {}
  for (var eventName in events) {
    let event = events[eventName]
    event.eventName = eventName
    if (userEvents[event.date] == null) {
      userEvents[event.date] = []
    }
    userEvents[event.date].push(event)
  }
}

function openScreen(screen) {
  console.log(screen)
  if (screen != currentScreen) {
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

initLinks()
