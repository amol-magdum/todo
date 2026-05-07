const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const APP_VERSION = '2';

// Check for app version updates
function checkVersionUpdate() {
  const storedVersion = localStorage.getItem('appVersion');
  if (storedVersion !== APP_VERSION) {
    localStorage.setItem('appVersion', APP_VERSION);
  }
}

// Reorganize list: unchecked tasks at top, checked at bottom
function reorganizeTasks() {
  const tasks = Array.from(listContainer.querySelectorAll('li'));
  const unchecked = tasks.filter(li => !li.classList.contains('checked'));
  const checked = tasks.filter(li => li.classList.contains('checked'));
  
  listContainer.innerHTML = '';
  unchecked.forEach(li => listContainer.appendChild(li));
  checked.forEach(li => listContainer.appendChild(li));
}

function addTask() {
  if (inputBox.value.length <= 1) {
    alert("You must write task in detail");
  } else if (inputBox.value.length >= 50) {
    alert("Write task in 50 word only");
  } else if (document.querySelectorAll("#list-container li").length > 9) {
    alert("You already have 10 task, Remove few to add task");
  } else {
    let firstChild_li = listContainer.firstElementChild;
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    listContainer.insertBefore(li, firstChild_li);
    let img = document.createElement("img");
    img.setAttribute("src", "./images/delete.png");
    li.appendChild(img);
  }
  inputBox.value = "";
  saveData();
}

listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");
      reorganizeTasks();
    } else if (e.target.tagName === "IMG") {
      console.log(e.target.parentElement);
      e.target.parentElement.remove();
    }
    saveData();
  },
  false
);

function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

function getData() {
  const savedData = localStorage.getItem("data");
  if (savedData) {
    listContainer.innerHTML = savedData;
  }
}
checkVersionUpdate();
getData();
