var week_month = null
var week_year = null
var week_date = null

var week_dates = []

function createEventInWeek(week, time) {
    togleModalCreateEvent(time, week_dates[week - 1])
}

function week_todayX() {
    let today = new Date();
    week_month = today.getMonth();
    week_year = today.getFullYear();
    week_date = today.getDate();
    fillWeekDate()
    fillWeak()
}

function week_next() {
    week_date += 7
    let daysInMonth = 32 - new Date(week_year, week_month, 32).getDate();
    if (week_date > daysInMonth) {
        week_year = (week_month === 11) ? week_year + 1 : week_year;
        week_month = (week_month + 1) % 12;
        console.log("weak_date = " + week_date)
        week_date -= daysInMonth
        console.log("weak_date = " + week_date)
    }
    fillWeekDate()
    fillWeak()
}

function week_previous() {
    week_date -= 7
    if (week_date <= 0) {
        week_year = (week_month === 0) ? week_year - 1 : week_year;
        week_month = (week_month === 0) ? 11 : week_month - 1;
        let daysInMonth = 32 - new Date(week_year, week_month, 32).getDate();
        week_date += daysInMonth
    }
    fillWeekDate()
    fillWeak()
} 

function fillWeekDate() {
    let weekDay1 = document.getElementById("date-1");
    let weekDay2 = document.getElementById("date-2");
    let weekDay3 = document.getElementById("date-3");
    let weekDay4 = document.getElementById("date-4");
    let weekDay5 = document.getElementById("date-5");
    let weekDay6 = document.getElementById("date-6");
    let weekDay7 = document.getElementById("date-7");

    let currentDateObject = new Date(week_year, week_month, week_date)
    let day = currentDateObject.getDay()

    let headers = []
    week_dates = []

    let daysInMonth = 32 - new Date(week_year, week_month, 32).getDate();
    let i = 0
    let dateInNexMoth = 1;
    while (i < 7) {
        let curDate = week_date
        let curYear = week_year
        let curMoth = week_month
        var date = week_date - day
        if (i < day) {
            if (date <= 0) {
                let year = (week_month === 0) ? week_year - 1 : week_year;
                let moth = (week_month === 0) ? 11 : week_month - 1;
                let prevDate = 32 - new Date(year, moth, 32).getDate();
                date += prevDate
                curDate = date
                curYear = year
                curMoth = moth
                date = date + " " + months[moth] + " " + year
            } else {
                curDate = date
                date = date + " " + months[week_month] + " " + week_year
            }
        } else if (i > day) {
            date += i - day
            if (date > daysInMonth) {
                date = dateInNexMoth
                dateInNexMoth += 1
                let year = (week_month === 11) ? week_year + 1 : week_year;
                let moth = (week_month + 1) % 12;
                curYear = year
                curMoth = moth
                curDate = date
                date = date + " " + months[moth] + " " + week_year
            } else {
                curDate = date
                date = date + " " + months[week_month] + " " + week_year
            }
        } else {
            date = week_date + " " + months[week_month] + " " + week_year
        }
        headers.push(date)
        console.log(curDate + '.' + curMoth + '.' + curYear)
        week_dates.push(curDate + '.' + (curMoth + 1) + '.' + curYear)
        i += 1
    }

    weekDay1.innerText = headers[0]
    weekDay2.innerText = headers[1]
    weekDay3.innerText = headers[2]
    weekDay4.innerText = headers[3]
    weekDay5.innerText = headers[4]
    weekDay6.innerText = headers[5]
    weekDay7.innerText = headers[6]
}

function fillWeak() {
    let day_wrapper = document.getElementById("wrapper");
    let day_taskWrapper = document.getElementById("task-wrapper")
    while (day_taskWrapper.childElementCount > 0) {
        day_taskWrapper.removeChild(day_taskWrapper.firstChild);
    }
    while (day_wrapper.childElementCount > 1) {
        day_wrapper.removeChild(day_wrapper.firstChild);
    }
    requestEvents(function(eventsMap){
        let fullDate = week_date + '.' + (week_month + 1) + '.' + week_year
        console.log(fullDate)
        showEvents(eventsMap[week_dates[0]], 1)
        showEvents(eventsMap[week_dates[1]], 2)
        showEvents(eventsMap[week_dates[2]], 3)
        showEvents(eventsMap[week_dates[3]], 4)
        showEvents(eventsMap[week_dates[4]], 5)
        showEvents(eventsMap[week_dates[5]], 6)
        showEvents(eventsMap[week_dates[6]], 7)
    })
}

function activateWeekScreen() {
    if (currentUser == null) {
        openScreen("login")
    } else {
        week_month = selectedMonth
        week_year = selectedYear
        week_date = selectedDate
        displayUserName()
        activateAppointmentState();
        fillWeekDate()
        dbChangeListenner = function() {
            fillWeak()
        }
        dbChangeListenner()
        configureGuestAndRemindInput()
    }
}