const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');
const APP_VERSION = '2';

function formatDate(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function checkVersionUpdate() {
  const storedVersion = localStorage.getItem('appVersion');
  if (storedVersion !== APP_VERSION) {
    localStorage.setItem('appVersion', APP_VERSION);
  }
}

function buildTaskHtml(text, addedDate, completedDate = '') {
  return `
    <div class="task-content">
      <span class="task-text">${text}</span>
      <div class="task-meta">
        <span class="date added">Added: ${addedDate}</span>
        <span class="date completed ${completedDate ? '' : 'hidden'}">Completed: ${completedDate}</span>
      </div>
    </div>
  `;
}

function normalizeTaskItem(li) {
  if (li.querySelector('.task-content')) {
    return;
  }

  const existingText = li.querySelector('.task-text')
    ? li.querySelector('.task-text').textContent.trim()
    : li.firstChild && li.firstChild.nodeType === Node.TEXT_NODE
    ? li.firstChild.textContent.trim()
    : li.textContent.trim();

  const isChecked = li.classList.contains('checked');
  const addedLabel = li.querySelector('.date.added');
  const completedLabel = li.querySelector('.date.completed');
  const addedDate = addedLabel
    ? addedLabel.textContent.replace(/^Added:\s*/, '')
    : formatDate(new Date());
  const completedDate = completedLabel && completedLabel.textContent.trim()
    ? completedLabel.textContent.replace(/^Completed:\s*/, '')
    : isChecked
    ? formatDate(new Date())
    : '';

  li.innerHTML = buildTaskHtml(existingText, addedDate, completedDate);
  if (isChecked) {
    li.classList.add('checked');
  }

  let deleteIcon = li.querySelector('img');
  if (!deleteIcon) {
    deleteIcon = document.createElement('img');
    deleteIcon.setAttribute('src', './images/delete.png');
    deleteIcon.setAttribute('alt', 'Delete task');
    li.appendChild(deleteIcon);
  } else {
    li.appendChild(deleteIcon);
  }
}

function addTask() {
  const taskText = inputBox.value.trim();
  if (taskText.length <= 1) {
    alert('You must write task in detail');
  } else if (taskText.length >= 100) {
    alert('Write task in 100 characters only');
  } else if (document.querySelectorAll('#list-container li').length > 9) {
    alert('You already have 10 tasks. Remove one to add another.');
  } else {
    const li = document.createElement('li');
    const currentDate = formatDate(new Date());
    li.innerHTML = buildTaskHtml(taskText, currentDate);
    const img = document.createElement('img');
    img.setAttribute('src', './images/delete.png');
    img.setAttribute('alt', 'Delete task');
    li.appendChild(img);
    listContainer.insertBefore(li, listContainer.firstElementChild);
    saveData();
  }
  inputBox.value = '';
}

function toggleTaskCompletion(li) {
  li.classList.toggle('checked');
  const completedLabel = li.querySelector('.date.completed');
  if (li.classList.contains('checked')) {
    if (completedLabel) {
      completedLabel.textContent = `Completed: ${formatDate(new Date())}`;
      completedLabel.classList.remove('hidden');
    }
  } else if (completedLabel) {
    completedLabel.textContent = '';
    completedLabel.classList.add('hidden');
  }
}

listContainer.addEventListener('click', function (e) {
  const deleteIcon = e.target.tagName === 'IMG';
  const item = e.target.closest('li');
  if (!item) return;

  if (deleteIcon) {
    item.remove();
  } else {
    toggleTaskCompletion(item);
    reorganizeTasks();
  }
  saveData();
});

function reorganizeTasks() {
  const tasks = Array.from(listContainer.querySelectorAll('li'));
  const unchecked = tasks.filter((li) => !li.classList.contains('checked'));
  const checked = tasks.filter((li) => li.classList.contains('checked'));
  listContainer.innerHTML = '';
  unchecked.forEach((li) => listContainer.appendChild(li));
  checked.forEach((li) => listContainer.appendChild(li));
}

function saveData() {
  localStorage.setItem('data', listContainer.innerHTML);
}

function getData() {
  const savedData = localStorage.getItem('data');
  if (savedData) {
    listContainer.innerHTML = savedData;
    listContainer.querySelectorAll('li').forEach(normalizeTaskItem);
  }
}

checkVersionUpdate();
getData();
