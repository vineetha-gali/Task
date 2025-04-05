document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    document.getElementById('darkModeToggle').addEventListener('change', toggleDarkMode);
  });
  
  function addTask() {
    const taskInput = document.getElementById('taskInput');
    const priority = document.getElementById('priority').value;
    const taskText = taskInput.value.trim();
    if (taskText === '') return;
  
    createTaskElement(taskText, false, priority);
    saveTask(taskText, priority);
    taskInput.value = '';
  }
  
  function createTaskElement(taskText, isCompleted = false, priority = 'medium') {
    const li = document.createElement('li');
    li.textContent = taskText;
    li.classList.add(priority);
    if (isCompleted) li.classList.add('completed');
  
    li.addEventListener('click', () => {
      li.classList.toggle('completed');
      updateLocalStorage();
      updateTaskCount();
    });
  
    li.addEventListener('dblclick', () => {
      li.remove();
      updateLocalStorage();
      updateTaskCount();
    });
  
    document.getElementById('taskList').appendChild(li);
    updateTaskCount();
  }
  
  function saveTask(taskText, priority) {
    const tasks = getTasksFromStorage();
    tasks.push({ text: taskText, completed: false, priority });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach(task => {
      createTaskElement(task.text, task.completed, task.priority);
    });
  
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark');
      document.getElementById('darkModeToggle').checked = true;
    }
  
    updateTaskCount();
  }
  
  function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
  }
  
  function updateLocalStorage() {
    const taskElements = document.querySelectorAll('#taskList li');
    const tasks = Array.from(taskElements).map(li => ({
      text: li.textContent,
      completed: li.classList.contains('completed'),
      priority: li.classList.contains('high') ? 'high' :
                li.classList.contains('low') ? 'low' : 'medium'
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  function clearAll() {
    if (confirm("Clear all tasks?")) {
      document.getElementById('taskList').innerHTML = '';
      localStorage.removeItem('tasks');
      updateTaskCount();
    }
  }
  
  function updateTaskCount() {
    const tasks = document.querySelectorAll('#taskList li:not(.completed)');
    document.getElementById('taskCount').textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''} left`;
  }
  
  function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
  }
  