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

    let tbl = document.getElementById("calendar-body");

    tbl.innerHTML = "";

    // // filing data about month and in the page via DOM.
    monthAndYear.innerHTML = months[month] + " " + year;
    // // selectYear.value = year;
    // // selectMonth.value = month;

    // // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");
        let rowClass = document.createAttribute("class");
        rowClass.value = "days";
        row.setAttributeNode(rowClass);

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
        	console.log(firstDay)
            if (i === 0 && j < firstDay) {
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth) {
                break;
            }

            else {
                let cell = document.createElement("td");
                let cellClass = document.createAttribute("class");
                cellClass.value = "day";
                cell.setAttributeNode(cellClass);
                let cellDiv = document.createElement("div");
                let cellDivClass = document.createAttribute("class");
                cellDivClass.value = "date";
                cellDiv.setAttributeNode(cellDivClass);
                let cellText = document.createTextNode(date);
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    // cell.classList.add("bg-info");
                } // color today's date
                cellDiv.appendChild(cellText);
                cell.appendChild(cellDiv);
                row.appendChild(cell);
                date++;
            }


        }

        tbl.appendChild(row); // appending each row into calendar body.
    }

}