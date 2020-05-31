window.onpopstate = function(event) {
  openScreen(event.state.screen, true)
};

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let colors = {
    "000": "#ffffff",
    "001": "rgba(245, 103, 72, 0.65)",
    "011": "linear-gradient(rgba(124, 173, 250, 1), rgba(245, 103, 72, 0.65))",
    "111": "linear-gradient(rgba(255, 197, 130, 0.65), rgba(124, 173, 250, 1), rgba(245, 103, 72, 0.65))",
    "110": "linear-gradient(rgba(255, 197, 130, 0.65), rgba(124, 173, 250, 1))",
    "100": "rgba(255, 197, 130, 0.65)",
    "101": "linear-gradient(rgba(255, 197, 130, 0.65), rgba(245, 103, 72, 0.65))",
    "010": "rgba(124, 173, 250, 1)"
}

var isHistoryEvent = false

var dbChangeListenner = null

var selectedYear = null
var selectedMonth = null
var selectedDate = null

var currentScreen = null

var currentUser = null
var userEvents = null

var links = null

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
        let normalizeEmail = currentUser.email.split('.').join('@')
        firebase.database().ref('guests/' + normalizeEmail + '/events/').once('value').then(function(snapshot2) {
          let events2 = snapshot2.val()
          normalizeEvents({events, events2})
          callback(userEvents)
        })
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
    console.log("db changed")
    let events = snapshot.val()
    let normalizeEmail = currentUser.email.split('.').join('@')
    firebase.database().ref('guests/' + normalizeEmail + '/events/').once('value').then(function(snapshot2) {
      let events2 = snapshot2.val()
      normalizeEvents({events, events2})
      if (dbChangeListenner != null) {
        dbChangeListenner()
      }
    })
  });
}

function logout() {
  firebase.auth().signOut().then(function() {
  // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
}

function normalizeEvents(allEvents) {
  userEvents = {}
  for (var i in allEvents) {
    let events = allEvents[i]
    for (var eventName in events) {
      let event = events[eventName]
      let date = event.date != null ? event.date : "No Date"
      if (userEvents[event.date] == null) {
        userEvents[event.date] = []
      }
      userEvents[event.date].push(event)
    }
  }
}

function uuidv4() {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function openScreen(screen, isHistoryEvent) {
  console.log(screen)

  let callback

  switch(screen) {
    case "calendar": 
      callback = activateCalendarScreen
      break
    case "year": 
      callback = activateYearScreen
      break
    case "week": 
      callback = activateWeekScreen
      break
    case "day":
      callback = activateDayScreen
      break  
    case "taskList":
      callback = activateTaskListScreen
      break
  }

  if (screen != currentScreen) {
    dbChangeListenner = null
    currentScreen = screen
    SendRequest("https://newboba-itirod.web.app/html/" + screen + ".html", callback, isHistoryEvent);
  }
}

function registerEmail(id, title, date, start, remind) {
  var link = "https://us-central1-itirod-49595.cloudfunctions.net/sendMail?dest=" + currentUser.email + 
  "&title=" + title + "&start=" + start + "&date=" + date+ "&remind=" + remind + "&id=" + id
  fetch(link)
}

function cancelEmail(id) {
  var link = "https://us-central1-itirod-49595.cloudfunctions.net/cancelMail?id=" + id
  fetch(link)
}

function SendRequest(link, callback, isHistoryEvent) {
  fetch(link)
  .then(  
    function(response) {  
      if (response.status !== 200) {  
        console.log('Looks like there was a problem. Status Code: ' +  response.status);  
        return;  
      }

      response.text().then(function(data) {  
        updatePage(data, link, isHistoryEvent)
        if (callback != null) {
          callback()
        }
      });  
    }  
  )  
}

function updatePage(response, link, isHistoryEvent) {
  html.innerHTML = response
  initLinks()
  if (isHistoryEvent != true) {
    var stateObj = {
      screen: currentScreen
    };
    history.pushState(stateObj, "");
  }
  isHistoryEvent = false
}

function displayUserName() {
  let element = document.getElementById("user-name")
  element.innerText = currentUser.email + " (Logout)"
}

initLinks()

firebase.auth().onAuthStateChanged(function(user) {
  if(user) {
    currentUser = user
    authorize()
    openScreen("calendar")
  } else {
    currentUser = null
    userEvents = null
    dbChangeListenner = null
    openScreen("login")
    console.log("!")
  }
});

