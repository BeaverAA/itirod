
let taskInput=document.getElementById("new-task");
let addButton=document.getElementById("addButton");
let container=document.getElementById("container2");

let incompleteTaskHolder;
let completedTasksHolder;


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
	var listItem=createNewTaskElement(taskInput.value);
	incompleteTaskHolder.appendChild(listItem);
	bindTaskEvents(listItem, taskCompleted);
	taskInput.value="";
}

function editTask() {
	var listItem=this.parentNode;

	var editInput=listItem.querySelector('input[type=text]');
	var label=listItem.querySelector("label");
	var containsClass=listItem.classList.contains("editMode");
	if(containsClass){
		label.innerText=editInput.value;
	}else{
		editInput.value=label.innerText;
	}
	listItem.classList.toggle("editMode");
}

function deleteTask() {
	var listItem=this.parentNode;
	var ul=listItem.parentNode;
	ul.removeChild(listItem);
}

function taskCompleted() {
	var listItem=this.parentNode;
	completedTasksHolder.appendChild(listItem);
	bindTaskEvents(listItem, taskIncomplete);
}

function taskIncomplete() {
	var listItem=this.parentNode;
	if (listItem.ownerList == null) {
		incompleteTaskHolder.appendChild(listItem);
	} else {
		listItem.ownerList.appendChild(listItem);	
	}
	bindTaskEvents(listItem,taskCompleted);
}

addButton.onclick = addTask;


function bindTaskEvents(taskListItem,checkBoxEventHandler) {
	let checkBox=taskListItem.querySelector("input[type=checkbox]");
	let editButton=taskListItem.querySelector("button.edit");
	let deleteButton=taskListItem.querySelector("button.delete");
	editButton.onclick=editTask;
	deleteButton.onclick=deleteTask;
	checkBox.onchange=checkBoxEventHandler;
}

// for (var i = 0; i < incompleteTaskHolder.children.length; i++){

// 	bindTaskEvents(incompleteTaskHolder.children[i],taskCompleted);
// }

// for (var i = 0; i < completedTasksHolder.children.length; i++){
// 	bindTaskEvents(completedTasksHolder.children[i],taskIncomplete);
// }


/////////////////////////////////
var item = createNewTaskElement("Task 1");
// da,smnflkahdlkhsadhfgkajdhgfkjasghdkjadkgkasjgkjskjhfgkjsdhfgkjdfhgkjsdfkghsdf;kgjhkfjhskzjhfgzkjd
var details=document.createElement("details");
var summary=document.createElement("summary");
var ul=document.createElement("ul");
var todayTextNode = document.createTextNode("No date");

incompleteTaskHolder = ul

details.setAttribute("open", "true");

summary.appendChild(todayTextNode);
details.appendChild(summary);
ul.appendChild(item);
details.appendChild(ul);
container.insertBefore(details, container.children[1]);
item.ownerList = ul;
bindTaskEvents(item, taskCompleted);

////////////////////////////////////////// hardcode
let todayDate = new Date();
let date = todayDate.getDate();
let month = todayDate.getMonth() + 1;
var item = createNewTaskElement("Pa,smnfl");
// da,smnflkahdlkhsadhfgkajdhgfkjasghdkjadkgkasjgkjskjhfgkjsdhfgkjdfhgkjsdfkghsdf;kgjhkfjhskzjhfgzkjd
var details=document.createElement("details");
var summary=document.createElement("summary");
var ul=document.createElement("ul");
var todayTextNode = document.createTextNode(month+"/"+date);

details.setAttribute("open", "true");

summary.appendChild(todayTextNode);
details.appendChild(summary);
ul.appendChild(item);
details.appendChild(ul);
container.insertBefore(details, container.children[2]);
item.ownerList = ul;
bindTaskEvents(item, taskCompleted);
///////////////////////////////////


// var item = createNewTaskElement("completed");
// da,smnflkahdlkhsadhfgkajdhgfkjasghdkjadkgkasjgkjskjhfgkjsdhfgkjdfhgkjsdfkghsdf;kgjhkfjhskzjhfgzkjd
var details=document.createElement("details");
var summary=document.createElement("summary");
var ul=document.createElement("ul");
let ulClass = document.createAttribute("class");
ulClass.value = "completed-tasks";
ul.setAttributeNode(ulClass);
var todayTextNode = document.createTextNode("Completed");

completedTasksHolder = ul

details.setAttribute("open", "true");

summary.appendChild(todayTextNode);
details.appendChild(summary);
// ul.appendChild(item);
details.appendChild(ul);
container.insertBefore(details, container.children[3]);
// item.ownerList = ul;
// bindTaskEvents(item, taskCompleted);

