
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

var global_test;

// var times = ["00.00", "00.00"]

// 0 - appointment, 1 - task, 2-reminder
var popupState = 0

function togleModalEditEvent(type) {
    containerTypeButton.style.display = "none"
    togleModalCreateEvent()
    if (type === 0) {
        activateAppointmentState()
    } else if (type === 1) {
        activateTaskState()
    } else if (type === 2) {
        activateReminderState()
    }
}

function togleModalCreateEvent() {
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

function setTitle() {
    let monthAndDay = document.getElementById("monthAndDay");
    let today = new Date();
    let currentDate = today.getDate();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    let cellText = document.createTextNode(currentDate + ' ' + months[currentMonth] + ' ' + currentYear)
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
    var reminderWidth = 20

    if (reminders == null) {
        appointmentWidth = 95
        reminderWidth = 0
    }
    if (appointments == null) {
        appointmentWidth = 0
        reminderWidth = 95
    }

//////////////////////// appointment

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
        eventElement.style.marginTop = (-height - 2) + "px"
        day_wrapper.insertBefore(eventElement, day_wrapper.children[0])

        appointmentLeft += appointmentWidthForOne
        zIndex += 1
    }

    //////////////////   reminder

    let reminderWidthForOne = reminderWidth / reminders.length
    // пересчитать
    var reminderLeft = 4

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

        let height = 1.6;

        let top =  parseInt(time[0], 10) * 50 + parseInt(time[1], 10) * 0.8// + height

        eventElement.style.top = top + "px"
        eventElement.style.height = height + "em"
        eventElement.style.marginTop = (-height - 2) + "px"
        day_wrapper.insertBefore(eventElement, day_wrapper.children[0])

        appointmentLeft += reminderWidthForOne
        zIndex += 1
    }

}

function createAppointment(event) {
    // console.log(event)
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

    article.addEventListener("click", function(){ togleModalEditEvent(0) })

    h2.appendChild(h2Text)
    time.appendChild(timeText)

    div.appendChild(time)
    article.appendChild(h2)
    article.appendChild(div)

    return article
}

function createReminder(event) {
    
}

function createTask(event) {
    let article = document.createElement("article")
    let articleClass = document.createAttribute("class")
    let articleText = document.createTextNode(event.title)
    articleClass.value = "task"
    article.setAttributeNode(articleClass)
    article.addEventListener("click", function(){ togleModalEditEvent(1) })
    article.appendChild(articleText)
    return article
}

function cancelPopUp() {
    togleModalCreateEvent();
    containerTypeButton.style.display = ""
}

function saveEvent() {

    switch(popupState) {
        case 0:
            saveAppointment()
            break
        case 1:
            saveTask()
            break
        case 2:
            saveReminder()
            break
    }    

    console.log(event)
    cancelPopUp()
}

function saveAppointment() {
    let id = uuidv4()
    firebase.database().ref('users/' + currentUser.uid + '/events/' + id).set({
        type: "appointment",
        id: id,
        description: apDescription.value,
        start: apStartTime.value,
        end: apEndTime.value,
        date: apDate.value,
        title: popupTitle.value
    })
}

function saveTask() {
    let id = uuidv4()
    firebase.database().ref('users/' + currentUser.uid + '/events/' + id).set({
        type: "task",
        id: id,
        description: taskDescription.value,
        date: taskDate.value,
        title: popupTitle.value
    })
}

function saveReminder() {
    let id = uuidv4()
    firebase.database().ref('users/' + currentUser.uid + '/events/' + id).set({
        type: "reminder",
        id: id,
        time: reTime.value,
        date: reDate.value,
        title: popupTitle.value
    })
}


setTitle()
// window.addEventListener("click", windowOnClick);
activateAppointmentState();

if (currentUser == null) {

} else {
    requestEvents(function(eventsMap){
        let today = new Date();
        month = today.getMonth();
        year = today.getFullYear();
        date = today.getDate();
        let fullDate = date + '.' + (month + 1) + '.' + year
        showEvents(eventsMap[fullDate])
    })
}

function uuidv4() {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

console.log(uuidv4());


// activateTaskState()
