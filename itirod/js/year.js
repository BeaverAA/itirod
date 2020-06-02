var year_currentYear = null

function year_todayX() {
    let today = new Date();
    year_currentYear = today.getFullYear();
    fillYearScreen()
    fillYearTitle()
}

function year_next() {  
    year_currentYear += 1
    fillYearScreen();
    fillYearTitle()
}

function year_previous() {
    year_currentYear -= 1
    fillYearScreen();
    fillYearTitle()
}  

function initYearDate() {
    let today = new Date();
    year_currentYear = today.getFullYear();
}

function fillYearTitle() {
   let monthAndYear = document.getElementById("monthAndYear");
    monthAndYear.innerHTML = year_currentYear.toString();
}

function fillYearScreen() {
    showCalendar(0, year_currentYear, "calendar-body");
    showCalendar(1, year_currentYear, "calendar-body2");
    showCalendar(2, year_currentYear, "calendar-body3");
    showCalendar(3, year_currentYear, "calendar-body4");
    showCalendar(4, year_currentYear, "calendar-body5");
    showCalendar(5, year_currentYear, "calendar-body6");
    showCalendar(6, year_currentYear, "calendar-body7");
    showCalendar(7, year_currentYear, "calendar-body8");
    showCalendar(8, year_currentYear, "calendar-body9");
    showCalendar(9, year_currentYear, "calendar-body10");
    showCalendar(10, year_currentYear, "calendar-body11");
    showCalendar(11, year_currentYear, "calendar-body12");
}

function activateYearScreen() {
    initYearDate()

    if (currentUser == null) {
        openScreen("login")
    } else {
        events = {}
        displayUserName()
        requestEvents(function(eventsMap){
            for (var eventsArrayName in eventsMap) {
                for (var eventNumber in eventsMap[eventsArrayName]) {
                    addEvent(eventsMap[eventsArrayName][eventNumber])
                }
            }

            fillYearScreen()
            fillYearTitle()
        })
    }

}