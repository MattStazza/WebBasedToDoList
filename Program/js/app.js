// CODE EXPLAINED channel

//Selecting the Elements
const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");

//Classes names
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";
const DELETED = "item-deleted";

// Editable
const EDITABLE = "true";
const NOT_EDITABLE = "false";

// Variables
let LIST, id;

// Get item from local storage
let data = localStorage.getItem("TODO");

// Check if data is not empty
if (data) {
  LIST = JSON.parse(data);
  // Set the id to the last one in the list
  id = LIST.length;
  // Load the list to the user interfacae
  loadList(LIST);
} else {
  // if data isnt empty
  LIST = [];
  id = 0;
}

// Load items to the user's interface
function loadList(array) {
  array.forEach(function (item) {
    addToDo(item.name, item.id, item.done, item.trash);
  });
}

// Clear the local storage with the refresh button
clear.addEventListener("click", function () {
  localStorage.clear();
  location.reload();
});

//Show todays date and time
const options = { weekday: "long", month: "short", day: "numeric", hour: "numeric", minute: "numeric" };
const today = new Date();

dateElement.innerHTML = today.toLocaleDateString("en-US", options);

// Add to do fucntion
function addToDo(toDo, id, done, trash) {
  if (trash) {
    return;
  }
  // Check if the toDo is NOT completed, if it is use a CHECK class. If it isn't ise UNCHECK class.
  const DONE = done ? CHECK : UNCHECK;
  //Same for lineThrough class.
  const LINE = done ? LINE_THROUGH : "";

  const item = `<li class="item">
                <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                <p class="text ${LINE}" display: inline;>${toDo}</p>
                <i class="edit fa fa-edit de" job="edit" id="id"></i>
                <i class="fa fa-trash-o de" job="delete" id="${id}"></i> 
                </li>
                `;
  const position = "beforeend";

  list.insertAdjacentHTML(position, item);
}

//Adding a ToDo by clicking [ENTER].
//Will add a new item.
//Wont add an item if the input is empty.
//The input is reset.
document.addEventListener("keyup", function (even) {
  if (event.keyCode == 13) {
    const toDo = input.value;

    //if the input isn't empty
    if (toDo) {
      addToDo(toDo);

      LIST.push({
        name: toDo,
        id: id,
        done: false,
        trash: false,
      });

      // Add item to local storage
      // (this code must be added where the LIST array is updated)
      localStorage.setItem("TODO", JSON.stringify(LIST));

      id++;
    }
    input.value = "";
  }
});

// Complete to do
function completeToDo(element) {
  element.classList.toggle(CHECK);
  element.classList.toggle(UNCHECK);
  element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

  LIST[element.id].done = LIST[element.id].done ? false : true;
}

// Remove to do
function removeToDo(element) {
  element.parentNode.classList.toggle(DELETED);
  element.parentNode.parentNode.removeChild(element.parentNode);

  LIST[element.id].trash = true;

  // Add item to local storage
  // (this code must be added where the LIST array is updated)
  localStorage.setItem("TODO", JSON.stringify(LIST));
}

//Edit to do
function editToDo(element) {
  const item = element.parentNode.querySelector(".text");

  //Toggle contentEditable
  if (item.contentEditable == "true") {
    item.contentEditable = "false";
  } else {
    item.contentEditable = "true";
  }

  // grab edit button element
  const editButton = element.parentNode.querySelector(".edit");

  // Toggle class
  console.log(editButton);
  if (editButton.classList.contains("editing")) {
    editButton.classList.remove("editing");
  } else {
    editButton.classList.add("editing");
  }
}

// Target the items created dynamically
// And an event listner to target the icons (check button and trash)
list.addEventListener("click", function (event) {
  // return the clicked element inside list
  const element = event.target;

  // Return complete or delete or edit
  const elementJob = element.attributes.job.value;

  if (elementJob == "complete") {
    completeToDo(element);
  } else if (elementJob == "delete") {
    removeToDo(element);
  } else if (elementJob == "edit") {
    editToDo(element);
  }

  // Add item to local storage
  // (this code must be added where the LIST array is updated)
  localStorage.setItem("TODO", JSON.stringify(LIST));
});
