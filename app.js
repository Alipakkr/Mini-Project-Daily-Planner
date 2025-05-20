const plannerForm = document.getElementById('planner-form');
const plannerInput = document.getElementById('planner-input');
const plannerTaskList = document.getElementById('planner-task-list');
const plannerSearch = document.getElementById('planner-search');
const plannerClearAll = document.getElementById('planner-clear-all');
const plannerBackToTop = document.getElementById('planner-back-to-top');

// Initialize The tasks Start from here 
let tasks = JSON.parse(localStorage.getItem('planner-tasks')) || [];

// Render tasks in boxess
function renderTasks(filteredTasks = null) {
    const tasksToRender = filteredTasks || tasks;
    plannerTaskList.innerHTML = '';
    
    if (tasksToRender.length === 0) {
        plannerTaskList.innerHTML = '<p class="planner-empty">No tasks found</p>';
        return;
    }
    
    tasksToRender.forEach((task, index) => {
        const taskElement = document.createElement('li');
        taskElement.className = 'planner-task';
        taskElement.dataset.index = index;
        
        taskElement.innerHTML = `
            <input type="checkbox" class="planner-task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="planner-task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="planner-delete-btn">Delete</button>
        `;
        
        plannerTaskList.appendChild(taskElement);
    });
}

// Add a new task 
function addTask(e) {
    e.preventDefault();
    const taskText = plannerInput.value.trim();
    
    if (taskText) {
        tasks.push({
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        });
        saveTasks();
        renderTasks();
        plannerInput.value = '';
        plannerInput.focus();
    }
}

// Toggle task of  completion 
function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Delete the task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Clear all the  tasks
function clearAllTasks() {
    if (tasks.length > 0 && confirm('Are you sure you want to delete all tasks?')) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}

// Search the tasks
function searchTasks() {
    const searchTerm = plannerSearch.value.toLowerCase();
    const filteredTasks = tasks.filter(task => 
        task.text.toLowerCase().includes(searchTerm)
    );
    renderTasks(filteredTasks);
}

// Debounce function
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Save the tasks
function saveTasks() {
    localStorage.setItem('planner-tasks', JSON.stringify(tasks));
}

// Back to the top
function handleScroll() {
    plannerBackToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
}

// Event listeners
plannerForm.addEventListener('submit', addTask);
plannerTaskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('planner-task-checkbox')) {
        toggleTaskCompletion(e.target.closest('.planner-task').dataset.index);
    }
    if (e.target.classList.contains('planner-delete-btn')) {
        deleteTask(e.target.closest('.planner-task').dataset.index);
    }
});
plannerSearch.addEventListener('input', debounce(searchTasks, 300));
plannerClearAll.addEventListener('click', clearAllTasks);
plannerBackToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
window.addEventListener('scroll', debounce(handleScroll, 100));

// Initialize
renderTasks();