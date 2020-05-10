
var taskInput=document.getElementById("new-task");
var addButton=document.getElementById("addButton");
var incompleteTaskHolder=document.getElementById("incomplete-tasks");
var completedTasksHolder=document.getElementById("completed-tasks");
var container=document.getElementById("container2");


var createNewTaskElement=function(taskString){

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

var addTask = function(){
	console.log("Add Task...");
	var listItem=createNewTaskElement(taskInput.value);
	incompleteTaskHolder.appendChild(listItem);
	bindTaskEvents(listItem, taskCompleted);
	taskInput.value="";
}

var editTask=function(){
console.log("Edit Task...");
console.log("Change 'edit' to 'save'");

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

var deleteTask = function(){
	console.log("Delete Task...");
	var listItem=this.parentNode;
	var ul=listItem.parentNode;
	ul.removeChild(listItem);
}

var taskCompleted=function(){
	console.log("Complete Task...");
	var listItem=this.parentNode;
	completedTasksHolder.appendChild(listItem);
	bindTaskEvents(listItem, taskIncomplete);
}

var taskIncomplete = function(){
	console.log("Incomplete Task...");
	var listItem=this.parentNode;
	if (listItem.ownerList == null) {
		incompleteTaskHolder.appendChild(listItem);
	} else {
		listItem.ownerList.appendChild(listItem);	
	}
	bindTaskEvents(listItem,taskCompleted);
}

var ajaxRequest=function(){
	console.log("AJAX Request");
}

addButton.onclick=addTask;
addButton.addEventListener("click",ajaxRequest);


var bindTaskEvents=function(taskListItem,checkBoxEventHandler){
	console.log("bind list item events");
	var checkBox=taskListItem.querySelector("input[type=checkbox]");
	var editButton=taskListItem.querySelector("button.edit");
	var deleteButton=taskListItem.querySelector("button.delete");
	editButton.onclick=editTask;
	deleteButton.onclick=deleteTask;
	checkBox.onchange=checkBoxEventHandler;
}

for (var i = 0; i < incompleteTaskHolder.children.length; i++){

	bindTaskEvents(incompleteTaskHolder.children[i],taskCompleted);
}

for (var i = 0; i < completedTasksHolder.children.length; i++){
	bindTaskEvents(completedTasksHolder.children[i],taskIncomplete);
}


////////////////////////////////////////// hardcode
var todayDate = new Date();
var date = todayDate.getDate();
var month = todayDate.getMonth() + 1;
var item = createNewTaskElement("da,smnflkahdlkhsadhfgkajdhgfkjasghdkjadkgkasjgkjskjhfgkjsdhfgkjdfhgkjsdfkghsdf;kgjhkfjhskzjhfgzkjd");
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
/////////////////////////////////////////////////////

