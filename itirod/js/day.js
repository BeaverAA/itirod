
var day_wrapper = document.getElementById("wrapper");
var day_taskWrapper = document.getElementById("task-wrapper")
var day_modal = document.getElementById("modal")
var containerTypeButton = document.getElementById("container-type-button")

var appointmentContainer = document.getElementById("container-appointment");
var taskContainer = document.getElementById("container-task")
var reminderContainer = document.getElementById("container-reminder")

var appointmentButton = document.getElementById("appointment-button");
var taskButton = document.getElementById("task-button")
var reminderButton = document.getElementById("reminder-button")

var taskDescription = document.getElementById("task-description")
var taskDate = document.getElementById("task-date")

var reTime = document.getElementById("re-time")
var reDate = document.getElementById("re-date")

var apDescription = document.getElementById("ap-description")
var apStartTime = document.getElementById("ap-start-time")
var apEndTime = document.getElementById("ap-end-time")
var apDate = document.getElementById("ap-date")

var popupTitle = document.getElementById("title")

var day_month = null
var day_year = null
var day_date = null

var global_test;

// var times = ["00.00", "00.00"]

// 0 - appointment, 1 - task, 2-reminder
var popupState = 0
var isEditMode = false
var editableEvent = null

function todayX() {
    let today = new Date();
    day_date = today.getDate();
    day_month = today.getMonth();
    day_year = today.getFullYear();

    changeSelectedDate()
    fillDay(day_date, day_month, day_year)
}

function next() {
    let daysInMonth = 32 - new Date(day_year, day_month, 32).getDate();

    if (day_date == daysInMonth) {
        day_year = (day_month === 11) ? day_year + 1 : day_year;
        day_month = (day_month + 1) % 12;
        day_date = 1
    } else {
        day_date += 1
    }

    changeSelectedDate()
    fillDay(day_date, day_month, day_year)
}

function previous() {
    if (day_date == 1) {
        day_year = (day_month === 0) ? day_year - 1 : day_year;
        day_month = (day_month === 0) ? 11 : day_month - 1;
        let daysInMonth = 32 - new Date(day_year, day_month, 32).getDate();
        day_date = daysInMonth
    } else {
        day_date -= 1
    }

    changeSelectedDate()
    fillDay(day_date, day_month, day_year)
}   

function changeSelectedDate() {
    selectedMonth = day_month
    selectedYear = day_year
    selectedDate = day_date
}

function togleModalEditEvent(type, event) {
    isEditMode = true
    editableEvent = event
    console.log(editableEvent)
    containerTypeButton.style.display = "none"
    togleModalCreateEvent()
    if (type === 0) {
        activateAppointmentState()
        configureAppointmentPopUp(event)
    } else if (type === 1) {
        activateTaskState()
        configureTaskPopUp(event)
    } else if (type === 2) {
        activateReminderState()
        configureReminderPopUp(event)
    }
}

function configureAppointmentPopUp(event) {
    apDescription.value = event.description
    apStartTime.value = event.start
    apEndTime.value = event.end
    apDate.value = event.date
    popupTitle.value = event.title
}

function configureTaskPopUp(event) {
    taskDescription.value = event.description
    taskDate.value = event.date
    popupTitle.value = event.title
}

function configureReminderPopUp(event) {
    reTime.value = event.time
    reDate.value = event.date
    popupTitle.value = event.title
}

function togleModalCreateEvent() {
    let deleteButton = document.getElementById("event-delete-button");
    if (isEditMode) {
        deleteButton.style.display = ""
    } else {
        deleteButton.style.display = "none"
    }
    day_modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === day_modal) {
        togleModalCreateEvent();
        containerTypeButton.style.display = ""
    }
}

function activateAppointmentState() {
    console.log("ap")
    popupState = 0
    appointmentButton.style.background = "#E7A65B"
    appointmentButton.style.color = "#ffffff"
    taskButton.style.background = "#ffffff"
    taskButton.style.color = "#000000"
    reminderButton.style.background = "#ffffff"
    reminderButton.style.color = "#000000"
    appointmentContainer.style.display = ""
    taskContainer.style.display = "none"
    reminderContainer.style.display = "none"
}

function activateTaskState() {
    console.log("ta")
    popupState = 1
    taskButton.style.background = "#3489DA"
    taskButton.style.color = "#ffffff"
    appointmentButton.style.background = "#ffffff"
    appointmentButton.style.color = "#000000"
    reminderButton.style.background = "#ffffff"
    reminderButton.style.color = "#000000"
    taskContainer.style.display = ""
    appointmentContainer.style.display = "none"
    reminderContainer.style.display = "none"
}

function activateReminderState() {
    console.log("re")
    popupState = 2
    reminderButton.style.background = "#F56748"
    reminderButton.style.color = "#ffffff"
    appointmentButton.style.background = "#ffffff"
    appointmentButton.style.color = "#000000"
    taskButton.style.background = "#ffffff"
    taskButton.style.color = "#000000"
    reminderContainer.style.display = ""
    taskContainer.style.display = "none"
    appointmentContainer.style.display = "none"
}

function setTitle(day, month, year) {
    let monthAndDay = document.getElementById("monthAndDay");
    let cellText = document.createTextNode(day + ' ' + months[month] + ' ' + year)
    if (monthAndDay.firstChild != null) {
        monthAndDay.removeChild(monthAndDay.firstChild);
    }
    monthAndDay.appendChild(cellText)
}

function showEvents(eventsArray) {
    let appointments = []
    let tasks = []
    let reminders = []

    for (var i in eventsArray) {
        let event = eventsArray[i]
        // console.log(event)
        switch(event.type) {
            case "appointment":
                appointments.push(event)
                break
            case "task":
                tasks.push(event)
                break
            case "reminder":
                reminders.push(event)
                break
        }
    }
    insertTasksInScreens(tasks)
    insertAppointmentsAndReminders(appointments, reminders)
}

function insertTasksInScreens(tasks) {
    for (var i in tasks) {
        let task = createTask(tasks[i])
        day_taskWrapper.appendChild(task)
    }
}

function insertAppointmentsAndReminders(appointments, reminders) {
    let appointmentsMapa = {}
    let remindersMapa = {}

    for (var i in appointments) {
        let event = appointments[i]
        let hour = event.start.split(".")[0]
        if (appointmentsMapa[hour] == null) {
            appointmentsMapa[hour] = []
        }
        appointmentsMapa[hour].push(event)
    }

    for (var i in reminders) {
        let event = reminders[i]
        let hour = event.time.split(".")[0]
        if (remindersMapa[hour] == null) {
            remindersMapa[hour] = []
        }
        remindersMapa[hour].push(event)
    }


    for (var i in appointmentsMapa) {
        console.log(appointmentsMapa[i])
        appointmentsMapa[i].sort(function(a, b){return a.end < b.end})
        // appointmentsMapa[i].sortBy(function(a){a.start})
        // global_test = appointmentsMapa[i]
        // console.log(appointmentsMapa[i])
    }

    for (var i in remindersMapa) {
        remindersMapa[i].sort(function(a, b){a.time < b.time})
    }

    var zIndex = 5


    // console.log(appointmentsMapa)
    var i = 1
    while (i < 25) {
        insertAARInScreen(appointmentsMapa[i], remindersMapa[i], zIndex)
        zIndex += 1
        i += 1
    }
}

function insertAARInScreen(appointments, reminders, zIndex) {
    if (appointments == null && reminders == null) {
        return
    }

    // console.log(appointments)
    // console.log(reminders)

    var appointmentWidth = 75
    var reminderWidth = 40

    if (reminders == null) {
        appointmentWidth = 95
        reminderWidth = 0
    }
    if (appointments == null) {
        appointmentWidth = 0
        reminderWidth = 95
    }

    let borderFactor = 2

//////////////////////// appointment

    if (appointments != null) {
        let appointmentWidthForOne = appointmentWidth / appointments.length
        var appointmentLeft = 4

        for (var i in appointments) {
            let event = appointments[i]
            let eventElement = createAppointment(event)
            eventElement.style.zIndex = zIndex.toString()
            eventElement.style.left = appointmentLeft + "%"
            eventElement.style.width = appointmentWidthForOne + "%"

            // 1 h = 50 px
            // 1 m = 0.8 px
            let startTime = event.start.split(".")
            let endTime = event.end.split(".")

            var hour = parseInt(endTime[0], 10) - parseInt(startTime[0], 10)
            var min = parseInt(endTime[1], 10) - parseInt(startTime[1], 10)
            if (min < 0) {
                hour -= 1
                min += 60 
            }

            let height = hour * 50 + min * 0.8

            let top =  parseInt(startTime[0], 10) * 50 + parseInt(startTime[1], 10) * 0.8 + height

            eventElement.style.top = top + "px"
            eventElement.style.height = height + "px"
            eventElement.style.marginTop = (-height - borderFactor) + "px"
            day_wrapper.insertBefore(eventElement, day_wrapper.children[0])

            appointmentLeft += appointmentWidthForOne
            zIndex += 1
        }
    }

    //////////////////   reminder

    if (reminders != null) {

        let reminderWidthForOne = reminderWidth / reminders.length
        // пересчитать
        var reminderLeft = 4

        if (appointments != null) {
            reminderLeft = 59
        }

        for (var i in reminders) {
            let event = reminders[i]
            let eventElement = createReminder(event)
            eventElement.style.zIndex = zIndex.toString()
            eventElement.style.left = reminderLeft + "%"
            eventElement.style.width = reminderWidthForOne + "%"

            // 1 h = 50 px
            // 1 m = 0.8 px
            let time = event.time.split(".")

            // var hour = parseInt(endTime[0], 10) - parseInt(startTime[0], 10)
            // var min = parseInt(endTime[1], 10) - parseInt(startTime[1], 10)
            // if (min < 0) {
            //     hour -= 1
            //     min += 60 
            // }

            let height = 1.6

            console.log(height)

            let top = parseInt(time[0], 10) * 50 + parseInt(time[1], 10) * 0.8 + (height * 16)

            eventElement.style.top = top + "px"
            eventElement.style.height = height + "em"
            eventElement.style.marginTop = (-(height * 16) - borderFactor) + "px"
            day_wrapper.insertBefore(eventElement, day_wrapper.children[0])

            reminderLeft += reminderWidthForOne
            zIndex += 1
        }

    }

}

function createAppointment(event) {
    let article = document.createElement("article")
    let h2 = document.createElement("h2")
    let div = document.createElement("div")
    let time = document.createElement("time")
    
    let articleClass = document.createAttribute("class")
    let h2Class = document.createAttribute("class")
    let divClass = document.createAttribute("class")

    let h2Text = document.createTextNode(event.title)
    let timeText = document.createTextNode(event.start + "-" + event.end)

    articleClass.value = "appointment-event"
    h2Class.value = "appointment-text"
    divClass.value = "appointment-text"

    article.setAttributeNode(articleClass)
    h2.setAttributeNode(h2Class)
    div.setAttributeNode(divClass)

    article.addEventListener("click", function(){ togleModalEditEvent(0, event) })

    h2.appendChild(h2Text)
    time.appendChild(timeText)

    div.appendChild(time)
    article.appendChild(h2)
    article.appendChild(div)

    return article
}

function createReminder(event) {
    let article = document.createElement("article")
    let h2 = document.createElement("h2")

    let articleClass = document.createAttribute("class")
    let h2Class = document.createAttribute("class")

    let h2Text = document.createTextNode(event.title + " " + event.time)

    articleClass.value = "reminder-event"
    h2Class.value = "appointment-text"

    article.setAttributeNode(articleClass)
    h2.setAttributeNode(h2Class)

    h2.appendChild(h2Text)

    article.appendChild(h2)

    article.addEventListener("click", function(){ togleModalEditEvent(2, event) })

    return article
}

function createTask(event) {
    let article = document.createElement("article")
    let articleClass = document.createAttribute("class")
    let articleText = document.createTextNode(event.title)
    articleClass.value = "task"
    article.setAttributeNode(articleClass)
    article.addEventListener("click", function(){ togleModalEditEvent(1, event) })
    article.appendChild(articleText)

    return article
}

function saveEvent() {

    let id
    if (isEditMode) {
        id = editableEvent.id
    } else {
        id = uuidv4()
    }

    let event

    switch(popupState) {
        case 0:
            event = isAppointmentValid()
            if (event != false) {
                event.id = id
                saveAppointment(event)
            } else {
                alert("Incorrect Data")
                return
            }
            break
        case 1:
            event = isTaskValid()
            if (event != false) {
                event.id = id
                saveTask(event)
            } else {
                alert("Incorrect Data")
                return
            }
            break
        case 2:
            event = isReminderValid()
            if (event != false) {
                event.id = id
                saveReminder(event)
            } else {
                alert("Incorrect Data")
                return
            }
            break
    }    

    cancelPopUp()
}

function isAppointmentValid() {
    let startTime = isTimeValid(apStartTime.value)
    let endTime = isTimeValid(apEndTime.value)

    if (startTime == false || endTime == false) {
        console.log("time error")
        return false
    }

    let stm = startTime[0] * 60 + startTime[1]
    let etm = endTime[0] * 60 + endTime[1]

    if (stm > etm) {
        console.log("time error 2")
        return false
    }

    let date = isDateValid(apDate.value)

    if (date == false) {
        console.log("date error")
        return false
    }

    let title = popupTitle.value

    if (title == "") {
        console.log("title error")
        return false
    }

    return {
        title: title,
        start: startTime[0] + "." + startTime[2],
        end: endTime[0] + "." + endTime[2],
        date: date[0] + "." + date[1] + "." + date[2],
        description: apDescription.value
    }
}

function isTaskValid() {
    let date = isDateValid(taskDate.value)

    if (date == false) {
        return false
    }

    let title = popupTitle.value

    if (title == "") {
        return false
    }

    return {
        title: title,
        date: date[0] + "." + date[1] + "." + date[2],
        description: apDescription.value
    }
    
}

function isReminderValid() {
     let time = isTimeValid(reTime.value)

    if (time == false) {
        return false
    }

    let date = isDateValid(reDate.value)

    if (date == false) {
        return false
    }

    let title = popupTitle.value

    if (title == "") {
        return false
    }

    return {
        title: title,
        time: time[0] + "." + time[2],
        date: date[0] + "." + date[1] + "." + date[2]
    }
    
}

function isTimeValid(time) {
    let times = time.split('.')
    if (times.length != 2) {
        return false
    }
    let h = Number(times[0])
    let m = Number(times[1])

    if (Number.isNaN(h) || Number.isNaN(m)) {
        return false
    }

    if (h < 0 || h > 23) {
        return false
    }

    if (m < 0 || m > 59) {
        return false
    }

    return [h, m, times[1]]
}

function isDateValid(date) {
    let dateNumbers = date.split('.')
    if (dateNumbers.length != 3) {
        return false
    }
    let d = Number(dateNumbers[0])
    let m = Number(dateNumbers[1])
    let y = Number(dateNumbers[2])

    if (Number.isNaN(d) || Number.isNaN(m) || Number.isNaN(y)) {
        return false
    }

    if (d < 0 || m < 0 || y < 0) {
        return false
    }

    return [d, m, y]
}

function deleteEvent() {
    firebase.database().ref('users/' + currentUser.uid + '/events/' + editableEvent.id).remove()
    cancelPopUp()
}

function cancelPopUp() {
    isEditMode = false
    togleModalCreateEvent();
    containerTypeButton.style.display = ""
}

function saveAppointment(event) {
    firebase.database().ref('users/' + currentUser.uid + '/events/' + event.id).set({
        type: "appointment",
        id: event.id,
        description: event.description,
        start: event.start,
        end: event.end,
        date: event.date,
        title: event.title
    })
}

function saveTask(event) {
    firebase.database().ref('users/' + currentUser.uid + '/events/' + event.id).set({
        type: "task",
        id: event.id,
        description: event.description,
        date: event.date,
        title: event.title
    })
}

function saveReminder(event) {
    firebase.database().ref('users/' + currentUser.uid + '/events/' + event.id).set({
        type: "reminder",
        id: event.id,
        time: event.time,
        date: event.date,
        title: event.title
    })
}

function fillDay(day, month, year) {
    console.log(day, month, year)
    setTitle(day, month, year)
    while (day_taskWrapper.childElementCount > 0) {
        day_taskWrapper.removeChild(day_taskWrapper.firstChild);
    }
    while (day_wrapper.childElementCount > 24) {
        day_wrapper.removeChild(day_wrapper.firstChild);
    }
    requestEvents(function(eventsMap){
        let fullDate = day + '.' + (month + 1) + '.' + year
        console.log(fullDate)
        showEvents(eventsMap[fullDate])
    })
}

dbChangeListenner = null
activateAppointmentState();

if (currentUser == null) {

} else {
    dbChangeListenner = function() {
        day_month = selectedMonth
        day_year = selectedYear
        day_date = selectedDate
        fillDay(day_date, day_month, day_year)
    }
    dbChangeListenner()
}

