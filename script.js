// DOM Elements
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');
const emptyMessage = document.getElementById('empty-message');

// Load tasks from localStorage
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateEmptyMessage();
});

// Add task event listener
addButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Functions
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText !== '') {
        // Create a new task object
        const task = {
            id: Date.now().toString(),
            text: taskText,
            completed: false
        };
        
        // Add task to the DOM
        createTaskElement(task);
        
        // Save tasks to localStorage
        saveTasks();
        
        // Clear input
        taskInput.value = '';
        taskInput.focus();
        
        // Update empty message visibility
        updateEmptyMessage();
    }
}

function createTaskElement(task) {
    // Create task item
    const taskItem = document.createElement('li');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskItem.dataset.id = task.id;
    
    // Create task text
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    
    // Create action buttons container
    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';
    
    // Create complete button
    const completeButton = document.createElement('button');
    completeButton.className = 'complete-button';
    completeButton.textContent = task.completed ? 'Undo' : 'Complete';
    completeButton.addEventListener('click', () => toggleComplete(task.id));
    
    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTask(task.id));
    
    // Append elements
    taskActions.appendChild(completeButton);
    taskActions.appendChild(deleteButton);
    
    taskItem.appendChild(taskText);
    taskItem.appendChild(taskActions);
    
    taskList.appendChild(taskItem);
}

function toggleComplete(taskId) {
    const taskItem = document.querySelector(`.task-item[data-id="${taskId}"]`);
    taskItem.classList.toggle('completed');
    
    const completeButton = taskItem.querySelector('.complete-button');
    if (taskItem.classList.contains('completed')) {
        completeButton.textContent = 'Undo';
    } else {
        completeButton.textContent = 'Complete';
    }
    
    saveTasks();
}

function deleteTask(taskId) {
    const taskItem = document.querySelector(`.task-item[data-id="${taskId}"]`);
    
    // Add a fade-out animation
    taskItem.style.opacity = '0';
    taskItem.style.transform = 'translateY(10px)';
    taskItem.style.transition = 'opacity 0.3s, transform 0.3s';
    
    setTimeout(() => {
        taskItem.remove();
        saveTasks();
        updateEmptyMessage();
    }, 300);
}

function saveTasks() {
    const tasks = [];
    
    document.querySelectorAll('.task-item').forEach(taskItem => {
        tasks.push({
            id: taskItem.dataset.id,
            text: taskItem.querySelector('.task-text').textContent,
            completed: taskItem.classList.contains('completed')
        });
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        
        tasks.forEach(task => {
            createTaskElement(task);
        });
    }
}

function updateEmptyMessage() {
    if (taskList.children.length > 0) {
        emptyMessage.style.display = 'none';
    } else {
        emptyMessage.style.display = 'block';
    }
}