
var taskCategory = {}

function createNewTaskElement(taskString) {

	var listItem=document.createElement("li");
	var checkBox=document.createElement("input");
	var label=document.createElement("label");
	var editInput=document.createElement("input");
	var editButton=document.createElement("button");
	var deleteButton=document.createElement("button");

	label.innerText=taskString;
	let labelClass = document.createAttribute("class");
	labelClass.value = "task-label";
    label.setAttributeNode(labelClass);

	checkBox.type="checkbox";
	editInput.type="text";
	editButton.innerText="Edit";
	editButton.className="edit";
	deleteButton.innerText="Delete";
	deleteButton.className="delete";

	listItem.appendChild(checkBox);
	listItem.appendChild(label);
	listItem.appendChild(editInput);
	listItem.appendChild(editButton);
	listItem.appendChild(deleteButton);
	return listItem;
}

function addTask() {
	let taskInput=document.getElementById("new-task");
	let title = taskInput.value
	if (title == "") { return }
	let task = {title: title, id: uuidv4(), completed: false, date: "No Date"}
	var listItem=createNewTaskElement(title);
	listItem.task = task
	taskCategory["No Date"].ul.appendChild(listItem);
	bindTaskEvents(listItem, taskCompleted);
	taskInput.value="";
	saveTaskTaskList(task)
}

function editTask() {
	var listItem=this.parentNode;

	var editInput=listItem.querySelector('input[type=text]');
	var label=listItem.querySelector("label");
	var containsClass=listItem.classList.contains("editMode");
	if(containsClass){
		label.innerText = editInput.value
		listItem.task.title = editInput.value
		saveTaskTaskList(listItem.task)
	}else{
		editInput.value=label.innerText;
	}
	listItem.classList.toggle("editMode");
}

function saveTaskTaskList(task) {
	task.type = "task"
	console.log(event)
	console.log('users/' + currentUser.uid + '/events/' + event.id)
	firebase.database().ref('users/' + currentUser.uid + '/events/' + task.id).set({
        type: "task",
        id: task.id,
        date: task.date,
        completed: task.completed,
        title: task.title
    })
}

function deleteTask() {
	var listItem=this.parentNode;
	var ul=listItem.parentNode;
	ul.removeChild(listItem);

	firebase.database().ref('users/' + currentUser.uid + '/events/' + listItem.task.id).remove()
}

function taskCompleted() {
	var listItem=this.parentNode;
	taskCategory["Completed"].ul.appendChild(listItem);
	listItem.task.completed = true
	saveTaskTaskList(listItem.task)
	bindTaskEvents(listItem, taskIncomplete);
}

function taskIncomplete() {
	var listItem=this.parentNode;
	if (listItem.ownerList == null) {
		taskCategory["No Date"].ul.appendChild(listItem);
	} else {
		listItem.ownerList.appendChild(listItem);	
	}
	listItem.task.completed = false
	saveTaskTaskList(listItem.task)
	bindTaskEvents(listItem,taskCompleted);
}

function bindTaskEvents(taskListItem,checkBoxEventHandler) {
	let checkBox=taskListItem.querySelector("input[type=checkbox]");
	let editButton=taskListItem.querySelector("button.edit");
	let deleteButton=taskListItem.querySelector("button.delete");
	editButton.onclick=editTask;
	deleteButton.onclick=deleteTask;
	checkBox.onchange=checkBoxEventHandler;
}

function createDetail(title) {
	let summaryText = title.replace(".", "/").replace(".", "/")
	var details=document.createElement("details");
	var summary=document.createElement("summary");
	var ul=document.createElement("ul");
	var summaryTextNode = document.createTextNode(summaryText);

	details.setAttribute("open", "true");

	summary.appendChild(summaryTextNode);
	details.appendChild(summary);
	details.appendChild(ul);
	details.ul = ul
	return details
}

function fillList(tasks) {
	taskCategory = {}

	taskCategory["Completed"] = createDetail("Completed")
	let completedClass = document.createAttribute("class");
	completedClass.value = "completed-tasks";
	taskCategory["Completed"].ul.setAttributeNode(completedClass)

	taskCategory["No Date"] = createDetail("No Date")
	for (var i in tasks) {
		let task = tasks[i]
		let date = task.date != null ? task.date : "No Date"
		if (taskCategory[date] == null) {
			taskCategory[date] = createDetail(date)
		}
		let category = taskCategory[date]
		console.log(category)
		let taskElement = createNewTaskElement(task.title)
		taskElement.task = task
		taskElement.ownerList = category.ul
		if (task.completed == true) {
			taskElement.querySelector("input[type=checkbox]").checked = true
			taskCategory["Completed"].ul.appendChild(taskElement)
			bindTaskEvents(taskElement, taskIncomplete)
		} else {
			category.ul.appendChild(taskElement)
			bindTaskEvents(taskElement, taskCompleted);
		}
	}
	addInScreen()
}

function addInScreen() {
	let container=document.getElementById("container2");
	for (var category in taskCategory) {
		container.appendChild(taskCategory[category])
	}
}


function activateTaskListScreen() {
	let addButton=document.getElementById("addButton");
	addButton.onclick = addTask;

	if (currentUser == null) {

	} else {
	    requestEvents(function(eventsMap){
	        let tasks = []
	        for (var dateEvents in eventsMap) {
	        	for (var i in  eventsMap[dateEvents]) {
	        		// console.log(i)
		        	let event = eventsMap[dateEvents][i]
		        	if (event.type === "task") {
		        		tasks.push(event)
		        	}
	        	}
	        }
	        console.log(tasks)
	        fillList(tasks)
	    })
	}
}
