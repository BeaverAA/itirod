let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "August", "October", "November", "December"];

let monthAndYear = document.getElementById("monthAndYear");
// showCalendar(currentMonth, currentYear);

var events = {}

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


function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}   

function showCalendar(month, year) {

    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    let prevYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    let prevMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    let daysInPrevMoth = 32 - new Date(prevYear, prevMonth, 32).getDate();

    let tbl = document.getElementById("calendar-body");

    tbl.innerHTML = "";

    monthAndYear.innerHTML = months[month] + " " + year;

    let date = 1;
    let dateInNexMoth = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        let rowClass = document.createAttribute("class");
        rowClass.value = "days";
        row.setAttributeNode(rowClass)

        for (let j = 0; j < 7; j++) {
        	
            if (i === 0 && j < firstDay) {
                let cell = createDateCell(daysInPrevMoth - firstDay + j + 1, "day day2")
                row.appendChild(cell);
            }
            else if (date > daysInMonth) {
                if (j == 0) {
                    break;
                }
                let cell = createDateCell(dateInNexMoth, "day day2")
                row.appendChild(cell)
                dateInNexMoth++;

            }

            else {
                let cellType = "day"
                let cell = createDateCell(date, cellType)
                let fullDate = date + '.' + (month + 1) + '.' + year
                // console.log(fullDate)
                setBackgroundColor(cell, fullDate)
                row.appendChild(cell)   
                date++
            }


        }

        tbl.appendChild(row);
    }

}

function createDateCell(date, cellType) {
    let cell = document.createElement("td")
    let cellClass = document.createAttribute("class")
    cellClass.value = cellType
    cell.setAttributeNode(cellClass)
    let cellDiv = document.createElement("div")
    let cellDivClass = document.createAttribute("class")
    cellDivClass.value = "date"
    cellDiv.setAttributeNode(cellDivClass)
    let cellText = document.createTextNode(date)
    cellDiv.appendChild(cellText)
    cell.appendChild(cellDiv)
    return cell
}

function setBackgroundColor(cell, date) {
    // console.log(date)
    var color = events[date]
    // console.log(color)
    if (color == null) {
        color = '000'
    }
    cell.style.background = colors[color]
}

function addEvent(event) {
    let date = event.date
    var value = events[date];
    if (value == null) {
        value = '000'
    }

    if (event.type == 'appointment') {
        value = '1' + value.substr(1, 2)
    } else if (event.type == 'task') {
        value = value.substr(0, 1) + '1' + value.substr(2, 1)
    } else {
        value = value.substr(0, 2) + '1'
    }
    events[date] = value
    // console.log(events)
}

firebase.auth().onAuthStateChanged(function(user) {
  if(user) {

    firebase.database().ref('users/' + user.uid + '/events').once('value').then(function(snapshot) {
        let events = snapshot.val()
        for (var event in events) {
            addEvent(events[event])
            // console.log(events[event]);
        }
        // console.log(events)
        showCalendar(currentMonth, currentYear);
        // console.log(snapshot.val())
    });

    // console.log(user.email)
    // saveData(user)
    // window.open("./../html/calendar.html","_self");
  } else {
    console.log("!")
  }
});