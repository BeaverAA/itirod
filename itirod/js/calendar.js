
var calendar_currentMonth = null
var calendar_currentYear = null

var events = {}

function initDate() {
    let today = new Date();
    calendar_currentMonth = today.getMonth();
    calendar_currentYear = today.getFullYear();
}

function todayX() {
    let today = new Date();
    calendar_currentMonth = today.getMonth();
    calendar_currentYear = today.getFullYear();
    showCalendar(calendar_currentMonth, calendar_currentYear);
}

function next() {
    calendar_currentYear = (calendar_currentMonth === 11) ? calendar_currentYear + 1 : calendar_currentYear;
    calendar_currentMonth = (calendar_currentMonth + 1) % 12;
    showCalendar(calendar_currentMonth, calendar_currentYear);
}

function previous() {
    calendar_currentYear = (calendar_currentMonth === 0) ? calendar_currentYear - 1 : calendar_currentYear;
    calendar_currentMonth = (calendar_currentMonth === 0) ? 11 : calendar_currentMonth - 1;
    showCalendar(calendar_currentMonth, calendar_currentYear);
}   

function showCalendar(month, year) {

    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    let prevYear = (calendar_currentMonth === 0) ? calendar_currentYear - 1 : calendar_currentYear;
    let prevMonth = (calendar_currentMonth === 0) ? 11 : calendar_currentMonth - 1;
    let daysInPrevMoth = 32 - new Date(prevYear, prevMonth, 32).getDate();

    let tbl = document.getElementById("calendar-body");

    tbl.innerHTML = "";


    let monthAndYear = document.getElementById("monthAndYear");
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
                let currnetDate = daysInPrevMoth - firstDay + j + 1
                let cell = createDateCell(currnetDate, "day day2")
                cell.addEventListener("click", function(){
                    selectedDate = currnetDate
                    selectedYear = prevYear
                    selectedMonth = prevMonth
                    openScreen("day")
                })
                row.appendChild(cell);
            }
            else if (date > daysInMonth) {
                if (j == 0) {
                    break;
                }
                let cell = createDateCell(dateInNexMoth, "day day2")
                cell.date = dateInNexMoth
                cell.year = (month === 11) ? year + 1 : year
                cell.month = (month + 1) % 12
                cell.addEventListener("click", function(e){
                    selectedDate = e.target.date
                    selectedYear = e.target.year
                    selectedMonth = e.target.month
                    openScreen("day")
                })
                row.appendChild(cell)
                dateInNexMoth++;

            }

            else {
                let cellType = "day"
                let cell = createDateCell(date, cellType)
                cell.date = date
                cell.year = year
                cell.month = month
                cell.addEventListener("click", function(e){
                    selectedDate = e.target.date
                    selectedYear = e.target.year
                    selectedMonth = e.target.month
                    openScreen("day")
                })
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
    // console.log(event)
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

function activateCalendarScreen() {
    initDate()

    if (currentUser == null) {

    } else {
        events = {}
        displayUserName()
        requestEvents(function(eventsMap){
            for (var eventsArrayName in eventsMap) {
                for (var eventNumber in eventsMap[eventsArrayName]) {
                    addEvent(eventsMap[eventsArrayName][eventNumber])
                }
            }
            showCalendar(calendar_currentMonth, calendar_currentYear);
        })
    }

}