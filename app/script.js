/* ===================================================
   TaskFlow — Application Logic
   Manages tasks using localStorage for persistence.

   Key concepts:
   - Tasks are stored as an array of objects in localStorage.
   - Each task has a unique id, text, and completed flag.
   - The UI is fully re-rendered from the data whenever
     something changes, keeping data and view in sync.
   =================================================== */

// ── DOM Element References ──────────────────────────
const taskInput       = document.getElementById('taskInput');
const addTaskBtn      = document.getElementById('addTaskBtn');
const taskList        = document.getElementById('taskList');
const emptyState      = document.getElementById('emptyState');
const totalCount      = document.getElementById('totalCount');
const completedCount  = document.getElementById('completedCount');
const pendingCount    = document.getElementById('pendingCount');
const progressFill    = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');
const toast           = document.getElementById('toast');

// ── localStorage Key ────────────────────────────────
// All tasks are saved under this key in the browser's localStorage.
// NOTE: localStorage is specific to this browser on this computer.
// If you open the app in a different browser or on another device,
// you will NOT see the same tasks. It is NOT a shared database.
const STORAGE_KEY = 'taskflow_tasks';

// ── Load Tasks from localStorage ────────────────────
// Returns the saved task array, or an empty array if nothing is saved.
function loadTasks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    // If the data is corrupted, start fresh
    console.warn('Could not load tasks from localStorage:', error);
    return [];
  }
}

// ── Save Tasks to localStorage ──────────────────────
function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.warn('Could not save tasks to localStorage:', error);
  }
}

// ── In-Memory Task Array ────────────────────────────
// This is the single source of truth while the app is running.
let tasks = loadTasks();

// ── Show a Toast Message ────────────────────────────
// Briefly displays a small notification at the bottom of the screen.
let toastTimer = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');

  // Clear any previous timer so toasts don't stack up
  if (toastTimer) clearTimeout(toastTimer);

  toastTimer = setTimeout(function () {
    toast.classList.remove('visible');
  }, 2200);
}

// ── Add a New Task ──────────────────────────────────
function addTask() {
  const text = taskInput.value.trim();

  // Reject empty or whitespace-only input
  if (text === '') {
    showToast('⚠️ Please enter a task.');
    taskInput.focus();
    return;
  }

  // Create a task object with a unique id
  const task = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(task);
  saveTasks(tasks);
  renderTasks();

  // Clear the input and refocus for the next task
  taskInput.value = '';
  taskInput.focus();

  showToast('✅ Task added!');
}

// ── Toggle Task Completed / Incomplete ──────────────
function toggleTask(id) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (task) {
    task.completed = !task.completed;
    saveTasks(tasks);
    renderTasks();
  }
}

// ── Delete a Task ───────────────────────────────────
function deleteTask(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  saveTasks(tasks);
  renderTasks();
  showToast('🗑️ Task deleted.');
}

// ── Update Statistics & Progress Bar ────────────────
function updateStats() {
  const total     = tasks.length;
  const completed = tasks.filter(function (t) { return t.completed; }).length;
  const pending   = total - completed;
  const percent   = total === 0 ? 0 : Math.round((completed / total) * 100);

  totalCount.textContent     = total;
  completedCount.textContent = completed;
  pendingCount.textContent   = pending;
  progressPercent.textContent = percent + '%';

  progressFill.style.width = percent + '%';
  progressFill.setAttribute('aria-valuenow', percent);
}

// ── Render the Entire Task List ─────────────────────
// Rebuilds the list from the tasks array every time data changes.
// Uses textContent (not innerHTML) for the task text to prevent XSS.
function renderTasks() {
  // Clear the current list
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';

    tasks.forEach(function (task) {
      // Create list item
      var li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');

      // Checkbox
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-checkbox';
      checkbox.checked = task.completed;
      checkbox.setAttribute('aria-label', 'Mark task as ' + (task.completed ? 'incomplete' : 'complete'));
      checkbox.addEventListener('change', function () {
        toggleTask(task.id);
      });

      // Task text — using textContent to safely display user input
      var span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = task.text;

      // Delete button
      var deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-delete';
      deleteBtn.setAttribute('aria-label', 'Delete task');
      deleteBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" ' +
        'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<polyline points="3 6 5 6 21 6"/>' +
        '<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>' +
        '<path d="M10 11v6"/><path d="M14 11v6"/>' +
        '<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>' +
        '</svg>';
      deleteBtn.addEventListener('click', function () {
        deleteTask(task.id);
      });

      // Assemble the list item
      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }

  // Always update the stats after rendering
  updateStats();
}

// ── Event Listeners ─────────────────────────────────

// Click the Add button
addTaskBtn.addEventListener('click', addTask);

// Press Enter in the input field
taskInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    addTask();
  }
});

// ── Initial Render ──────────────────────────────────
// Draw the task list (and stats) when the page first loads.
renderTasks();
