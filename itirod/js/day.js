let monthAndDay = document.getElementById("monthAndDay");

let wrapper = document.getElementById("wrapper");
let modal = document.getElementById("modal")
let containerTypeButton = document.getElementById("container-type-button")

let appointmentContainer = document.getElementById("container-appointment");
let taskContainer = document.getElementById("container-task")
let reminderContainer = document.getElementById("container-reminder")

let appointmentButton = document.getElementById("appointment-button");
let taskButton = document.getElementById("task-button")
let reminderButton = document.getElementById("reminder-button")

// 0 - appointment, 1 - task, 2-reminder
let popupState = 0

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "August", "October", "November", "December"];

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
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
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

window.addEventListener("click", windowOnClick);
activateAppointmentState();

let today = new Date();
let currentDate = today.getDate();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let cellText = document.createTextNode(currentDate + ' ' + months[currentMonth] + ' ' + currentYear)
monthAndDay.appendChild(cellText)