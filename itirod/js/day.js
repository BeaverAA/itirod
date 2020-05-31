
var day_month = null
var day_year = null
var day_date = null

// 0 - appointment, 1 - task, 2-reminder
var popupState = 0
var isEditMode = false
var editableEvent = null

var removeGuests = []
var removeReminds = []

function day_todayX() {
    let today = new Date();
    day_date = today.getDate();
    day_month = today.getMonth();
    day_year = today.getFullYear();

    changeSelectedDate()
    fillDay(day_date, day_month, day_year)
}

function day_next() {
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

function day_previous() {
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
    let containerTypeButton = document.getElementById("container-type-button")
    containerTypeButton.style.display = "none"
    togleModalCreateEvent("none")
    if (type === 0) {
        activateAppointmentState()
        configureAppointmentPopUp(event)
        if (event.owner != null) {
            deactivateButtons()
        }
    } else if (type === 1) {
        activateTaskState()
        configureTaskPopUp(event)
    } else if (type === 2) {
        activateReminderState()
        configureReminderPopUp(event)
    }
}

function deactivateButtons() {
    let saveButton = document.getElementById("event-save-button")
    let deleteButton = document.getElementById("event-delete-button")
    saveButton.disabled = true
    deleteButton.disabled = true
}

function activateButtons() {
    let saveButton = document.getElementById("event-save-button")
    let deleteButton = document.getElementById("event-delete-button")
    saveButton.disabled = false
    deleteButton.disabled = false
}

function configureAppointmentPopUp(event) {
    let apDescription = document.getElementById("ap-description")
    let apStartTime = document.getElementById("ap-start-time")
    let apEndTime = document.getElementById("ap-end-time")
    let apDate = document.getElementById("ap-date")
    let popupTitle = document.getElementById("title")
    let apReminds = document.getElementById("ap-remind")
    let apGuests = document.getElementById("container-reminds")
    apDescription.value = event.description
    apStartTime.value = event.start
    apEndTime.value = event.end
    apDate.value = event.date
    popupTitle.value = event.title
    

    if (event.guests != null) {
        for (var i in event.guests) {
            addNewGuest(event.guests[i])
        }
    }

    if (event.reminds != null) {
        for (var i in event.reminds) {
            addNewRemindValue(event.reminds[i])
        }
    }
}

function configureTaskPopUp(event) {
    let taskDescription = document.getElementById("task-description")
    let taskDate = document.getElementById("task-date")
    let popupTitle = document.getElementById("title")
    taskDescription.value = event.description
    taskDate.value = event.date
    popupTitle.value = event.title
}

function configureReminderPopUp(event) {
    let reTime = document.getElementById("re-time")
    let reDate = document.getElementById("re-date")
    let popupTitle = document.getElementById("title")
    reTime.value = event.time
    reDate.value = event.date
    popupTitle.value = event.title
}

function clearPopUp() {
    document.getElementById("ap-description").value = ""
    document.getElementById("ap-start-time").value = ""
    document.getElementById("ap-end-time").value = ""
    document.getElementById("ap-date").value = ""
    document.getElementById("ap-date").value = ""
    document.getElementById("ap-remind").value = ""
    document.getElementById("title").value = ""
    document.getElementById("task-description").value = ""
    document.getElementById("task-date").value = ""
    document.getElementById("task-description").value = ""
    document.getElementById("task-date").value = ""
    document.getElementById("appointment-input-guest").value = ""
    document.getElementById("re-time").value = ""
    document.getElementById("re-date").value = ""

    let guestContainer = document.getElementById("container-guest")
    while (guestContainer.childElementCount > 0) {
        guestContainer.removeChild(guestContainer.firstChild)
    }

    let remindContent = document.getElementById("container-reminds");
    while (remindContent.childElementCount > 0) {
        remindContent.removeChild(remindContent.firstChild)
    }
}

function togleModalCreateEvent(time, date) {
    let deleteButton = document.getElementById("event-delete-button");
    if (isEditMode) {
        deleteButton.style.display = ""
    } else {
        document.getElementById("ap-start-time").value = time
        document.getElementById("ap-end-time").value = time
        document.getElementById("re-time").value = time
        if (date == null) {
            document.getElementById("ap-date").value = day_date + "." + (day_month + 1) + "." + day_year
            document.getElementById("task-date").value = day_date + "." + (day_month + 1) + "." + day_year
            document.getElementById("re-date").value = day_date + "." + (day_month + 1) + "." + day_year
        } else {
            document.getElementById("ap-date").value = date
            document.getElementById("task-date").value = date
            document.getElementById("re-date").value = date
        }
        deleteButton.style.display = "none"
    }
    let day_modal = document.getElementById("modal")
    day_modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    let day_modal = document.getElementById("modal")
    if (event.target === day_modal) {
        togleModalCreateEvent();
        let containerTypeButton = document.getElementById("container-type-button")
        containerTypeButton.style.display = ""
    }
}

function activateAppointmentState() {
    console.log("ap")
    let appointmentContainer = document.getElementById("container-appointment");
    let taskContainer = document.getElementById("container-task")
    let reminderContainer = document.getElementById("container-reminder")
    let appointmentButton = document.getElementById("appointment-button");
    let taskButton = document.getElementById("task-button")
    let reminderButton = document.getElementById("reminder-button")
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
    let appointmentContainer = document.getElementById("container-appointment");
    let taskContainer = document.getElementById("container-task")
    let reminderContainer = document.getElementById("container-reminder")
    let appointmentButton = document.getElementById("appointment-button");
    let taskButton = document.getElementById("task-button")
    let reminderButton = document.getElementById("reminder-button")
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
    let appointmentContainer = document.getElementById("container-appointment");
    let taskContainer = document.getElementById("container-task")
    let reminderContainer = document.getElementById("container-reminder")
    let appointmentButton = document.getElementById("appointment-button");
    let taskButton = document.getElementById("task-button")
    let reminderButton = document.getElementById("reminder-button")
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

function showEvents(eventsArray, weekDay) {
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
    insertAppointmentsAndReminders(appointments, reminders, weekDay)
}

function insertTasksInScreens(tasks) {
    for (var i in tasks) {
        let task = createTask(tasks[i])
        task.style.background = tasks[i].color
        let day_taskWrapper = document.getElementById("task-wrapper")
        day_taskWrapper.appendChild(task)
    }
}

function insertAppointmentsAndReminders(appointments, reminders, weekDay) {
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

    var zIndex = 5

    var i = 0
    while (i < 25) {
        insertAARInScreen(appointmentsMapa[i], remindersMapa[i], zIndex, weekDay)
        zIndex += 1
        i += 1
    }
}

function insertAARInScreen(appointments, reminders, zIndex, weekDay) {
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

    console.log(appointments, reminders)
    if (currentScreen == 'week') {
        if (appointmentWidth == 95) {
            appointmentWidth = 12.5
            console.log("only-appointment")
        } else if (reminderWidth = 95) {
            reminderWidth = 12.5
            console.log("only-reminder")
        } else {
            appointmentWidth = 7.5
            reminderWidth = 5
            console.log("only-two")
        }
    }

    let borderFactor = 2

    let h_coef = 50
    let m_coef = 0.8

    if (currentScreen == 'week') {
        h_coef = 80
        m_coef = 1.3
    }

//////////////////////// appointment

    if (appointments != null) {
        let appointmentWidthForOne = appointmentWidth / appointments.length
        var appointmentLeft = 4

        if (currentScreen == 'week') {
            appointmentLeft = 12.5 * weekDay
        }

        for (var i in appointments) {
            let event = appointments[i]
            let eventElement = createAppointment(event)
            eventElement.style.zIndex = zIndex.toString()
            eventElement.style.left = appointmentLeft + "%"
            eventElement.style.width = appointmentWidthForOne + "%"
            eventElement.style.background = event.color

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

            let preHeight = hour * h_coef + min * m_coef

            let height = preHeight < 50 ? 50 : preHeight

            let top =  parseInt(startTime[0], 10) * h_coef + parseInt(startTime[1], 10) * m_coef + height

            if (currentScreen == 'week') {
                top += 35
            }

            eventElement.style.top = top + "px"
            eventElement.style.height = height + "px"
            eventElement.style.marginTop = (-height - borderFactor) + "px"
            let day_wrapper = document.getElementById("wrapper");
            day_wrapper.insertBefore(eventElement, day_wrapper.children[0])

            appointmentLeft += appointmentWidthForOne
            zIndex += 1
        }
    }

    //////////////////   reminder

    if (reminders != null) {

        let reminderWidthForOne = reminderWidth / reminders.length
        var reminderLeft = 4

        if (appointments != null) {
            reminderLeft = 59
        }

        if (currentScreen == 'week') {
            if (reminderLeft == 4) {
                reminderLeft = 12.5 * weekDay
            } else {
                reminderLeft = (12.5 * weekDay) + 7.5
            }
        }

        for (var i in reminders) {
            let event = reminders[i]
            let eventElement = createReminder(event)
            eventElement.style.zIndex = zIndex.toString()
            eventElement.style.left = reminderLeft + "%"
            eventElement.style.width = reminderWidthForOne + "%"
            eventElement.style.background = event.color

            // 1 h = 50 px
            // 1 m = 0.8 px
            let time = event.time.split(".")
            let height = 1.6

            console.log(height)

            let top = parseInt(time[0], 10) * h_coef + parseInt(time[1], 10) * m_coef + (height * 16)

            if (currentScreen == 'week') {
                top += 35
            }

            eventElement.style.top = top + "px"
            eventElement.style.height = height + "em"
            eventElement.style.marginTop = (-(height * 16) - borderFactor) + "px"
            let day_wrapper = document.getElementById("wrapper");
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
                let color = document.getElementById("color-picker").value
                event.color = color
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
                let color = document.getElementById("color-picker").value
                event.color = color
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
                let color = document.getElementById("color-picker").value
                event.color = color
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
    let apEndTime = document.getElementById("ap-end-time")
    let apStartTime = document.getElementById("ap-start-time")
    let popupTitle = document.getElementById("title")
    let apDate = document.getElementById("ap-date")
    let apGuests = document.getElementById("container-guest")
    let apReminds = document.getElementById("container-reminds")
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

    let reminds = []
    var i = 0
    while (i < apReminds.childElementCount) {
        let value = apReminds.children[i].getElementsByTagName("span")[0].textContent
        reminds.push(value)
        i += 1
    }

    let guests = []
    var i = 0
    while (i < apGuests.childElementCount) {
        let value = apGuests.children[i].getElementsByTagName("span")[0].textContent
        guests.push(value)
        i += 1
    }

    let apDescription = document.getElementById("ap-description")   
    return {
        title: title,
        guests: guests,
        reminds: reminds,
        start: startTime[0] + "." + startTime[2],
        end: endTime[0] + "." + endTime[2],
        date: date[0] + "." + date[1] + "." + date[2],
        description: apDescription.value
    }
}

function isTaskValid() {
    let taskDate = document.getElementById("task-date")
    let popupTitle = document.getElementById("title")
    let date = isDateValid(taskDate.value)

    if (date == false) {
        return false
    }

    let title = popupTitle.value

    if (title == "") {
        return false
    }

    let apDescription = document.getElementById("ap-description")
    return {
        title: title,
        date: date[0] + "." + date[1] + "." + date[2],
        description: apDescription.value
    }
    
}

function isReminderValid() {
    let reTime = document.getElementById("re-time")
    let popupTitle = document.getElementById("title")
    let time = isTimeValid(reTime.value)
    let reDate = document.getElementById("re-date")

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


function isRemindValid(remind) {
    let remindString = remind.split('.')

    if (remindString.length != 1) {
        return false
    }

    let r = Number(remindString[0])
    if (Number.isNaN(r)) {
        return false
    }

    if (r < 0) {
        return false
    }

    return r
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
    let containerTypeButton = document.getElementById("container-type-button")
    containerTypeButton.style.display = ""
    clearPopUp()
    activateButtons()
}

function saveAppointment(event) {
    registerEmail(event.id, event.title, event.date, event.start, event.remind)

    //////////////////////

    for (var i in removeGuests) {
        let guest = removeGuests[i]
        let id = guest.id
        let email = guest.email
        firebase.database().ref('guests/' + email + '/events/' + id).remove()
    }

    removeGuests = []

    /////
    let guests = event.guests
    for (var i in guests) {
        let normalizeEmail = guests[i].split('.').join('@')
        firebase.database().ref('guests/' + normalizeEmail + '/events/' + event.id).set({
            type: "appointment",
            id: event.id,
            guests: event.guests,
            description: event.description,
            start: event.start,
            end: event.end,
            color: event.color,
            owner: currentUser.email,
            date: event.date,
            reminds: event.reminds,
            title: event.title
        })
    }
    ////////
    firebase.database().ref('users/' + currentUser.uid + '/events/' + event.id).set({
        type: "appointment",
        id: event.id,
        guests: event.guests,
        description: event.description,
        start: event.start,
        end: event.end,
        color: event.color,
        date: event.date,
        reminds: event.reminds,
        title: event.title
    })
}

function saveTask(event) {
    firebase.database().ref('users/' + currentUser.uid + '/events/' + event.id).set({
        type: "task",
        id: event.id,
        color: event.color,
        description: event.description,
        date: event.date,
        title: event.title
    })
}

function saveReminder(event) {
    registerEmail(event.id, event.title, event.date, event.time, 0)
    firebase.database().ref('users/' + currentUser.uid + '/events/' + event.id).set({
        type: "reminder",
        id: event.id,
        color: event.color,
        time: event.time,
        date: event.date,
        title: event.title
    })
}

function fillDay(day, month, year) {
    console.log(day, month, year)
    let day_wrapper = document.getElementById("wrapper");
    let day_taskWrapper = document.getElementById("task-wrapper")
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

function configureGuestAndRemindInput() {
    let guestInput = document.getElementById("appointment-input-guest");
    let remindInput = document.getElementById("ap-remind");

    guestInput.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        let value = guestInput.value
        guestInput.value = ""
        addNewGuest(value)
      }
    });

    remindInput.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        let value = remindInput.value
        remindInput.value = ""
        addNewRemindValue(value)
      }
    });
}

function addNewRemindValue(value) {
    let remind = isRemindValid(value)
    if (value == "" || remind == false) {
        return
    }

    let remindContent = document.getElementById("container-reminds");

    let div = document.createElement("div")
    let span = document.createElement("span")
    let button = document.createElement("butoon")

    let spanClass = document.createAttribute("class")
    let buttonClass = document.createAttribute("class")

    spanClass.value = "guest-span"
    buttonClass.value = "guest-button"

    span.setAttributeNode(spanClass)
    button.setAttributeNode(buttonClass)

    let spanText = document.createTextNode(remind.toString())
    let buttonText = document.createTextNode("Delete")

    span.appendChild(spanText)
    button.appendChild(buttonText)

    button.onclick = function() {
        if (editableEvent != null) {
            removeReminds.push({remind: value, id: editableEvent.id})
        }
        remindContent.removeChild(button.parentNode)
    }

    div.appendChild(span)
    div.appendChild(button)
    remindContent.appendChild(div)
    /////////////////
}

function addNewGuest(value) {
    if (value == "") {
        return
    }
    let guestContent = document.getElementById("container-guest");

    let div = document.createElement("div")
    let span = document.createElement("span")
    let button = document.createElement("butoon")

    let spanClass = document.createAttribute("class")
    let buttonClass = document.createAttribute("class")

    spanClass.value = "guest-span"
    buttonClass.value = "guest-button"

    span.setAttributeNode(spanClass)
    button.setAttributeNode(buttonClass)

    let spanText = document.createTextNode(value)
    let buttonText = document.createTextNode("Delete")

    span.appendChild(spanText)
    button.appendChild(buttonText)

    button.onclick = function() {
        if (editableEvent != null) {
            removeGuests.push({email: value.split('.').join('@'), id: editableEvent.id})
        }
        guestContent.removeChild(button.parentNode)
    }

    div.appendChild(span)
    div.appendChild(button)
    guestContent.appendChild(div)
    /////////////////
}

function activateDayScreen() {
    if (currentUser == null) {
        openScreen("login")
    } else {
        displayUserName()
        activateAppointmentState();
        dbChangeListenner = function() {
            day_month = selectedMonth
            day_year = selectedYear
            day_date = selectedDate
            fillDay(day_date, day_month, day_year)
        }
        dbChangeListenner()
        configureGuestAndRemindInput()
    }
}
