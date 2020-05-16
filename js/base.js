let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
// let selectYear = document.getElementById("year");
// let selectMonth = document.getElementById("month");

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "August", "October", "November", "December"];

let monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);


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

    // let nextYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    // let nextMonth = (currentMonth + 1) % 12;
    // let daysInNextMoth = 32 - new Date(nextYear, nextMonth, 32).getDate();

    let tbl = document.getElementById("calendar-body");

    tbl.innerHTML = "";

    // // filing data about month and in the page via DOM.
    monthAndYear.innerHTML = months[month] + " " + year;
    // // selectYear.value = year;
    // // selectMonth.value = month;

    // // creating all cells
    let date = 1;
    let dateInNexMoth = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");
        let rowClass = document.createAttribute("class");
        rowClass.value = "days";
        row.setAttributeNode(rowClass)

        //creating individual cells, filing them up with data.
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
                setBackgroundColor(cell, date)
                row.appendChild(cell)   
                date++
            }


        }

        tbl.appendChild(row);
    }

}

function createDateCell(date, cellType) {
    // console.log(cellType)
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
    let color = colorForDate(date)
    cell.style.background = color
}

function colorForDate(date) {
    if (date === today.getDate()) {
        console.log(date)
        return "linear-gradient(rgba(124, 173, 250, 1), rgba(245, 103, 72, 0.65), rgba(255, 197, 130, 0.65))"
    }
    return "#ffffff"
}