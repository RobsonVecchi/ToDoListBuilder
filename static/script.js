document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const saveTasksBtn = document.getElementById('save-tasks-btn');
    const taskList = document.getElementById('task-list');

    
    fetchTasks();

    addTaskBtn.addEventListener('click', () => {
        const task = taskInput.value.trim();
        if (task) {
            addTask(task);
            taskInput.value = '';
        }
    });

    taskInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            const task = taskInput.value.trim();
            if (task) {
                addTask(task);
                taskInput.value = '';
            }
        }
    });

    saveTasksBtn.addEventListener('click', () => {
        saveTasks();
    });

    async function fetchTasks() {
        const response = await fetch('/tasks');
        if (response.ok) {
            const tasks = await response.json();
            renderTasks(tasks);
        } else {
            console.error('Failed to fetch tasks');
        }
    }

    async function addTask(task) {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task })
        });
        if (response.ok) {
            const tasks = await response.json();
            renderTasks(tasks);
        } else {
            console.error('Failed to add task');
        }
    }

    async function deleteTask(index) {
        const response = await fetch(`/tasks/${index}`, { method: 'DELETE' });
        if (response.ok) {
            const tasks = await response.json();
            renderTasks(tasks);
        } else {
            console.error('Failed to delete task');
        }
    }

    function renderTasks(tasks) {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${task}</span> <button onclick="deleteTask(${index})">Delete</button>`;
            taskList.appendChild(li);
        });
    }

    function saveTasks() {
        fetch('/tasks')
            .then(response => response.json())
            .then(tasks => {
                const date = new Date().toLocaleDateString();
                const filename = `todo_list_${date}.txt`;
                let text = `To-Do List - ${date}\n\n`;
                
                tasks.forEach((task, index) => {
                    text += `${index + 1}. ${task}\n`;
                });
                
                downloadFile(filename, text);
            })
            .catch(error => console.error('Failed to save tasks:', error));
    }

    function downloadFile(filename, text) {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); 
    }

    window.deleteTask = deleteTask; 
});