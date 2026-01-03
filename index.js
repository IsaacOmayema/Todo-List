const input = document.getElementById('todo_input');
const addButton = document.getElementById('add_button');
const todoDisplay = document.getElementById('todo_display');
const deleteButtons = document.getElementsByClassName('delete_button');
addButton.addEventListener('click', () => {
    const taskText = input.value.trim();
    if (taskText !== '') {
        const taskItem = document.createElement('div');
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete_button';
        deleteButton.textContent = 'Delete';
        taskItem.className = 'task_item';
        taskItem.textContent = taskText;
        taskItem.appendChild(deleteButton);
        todoDisplay.appendChild(taskItem);
        input.value = '';
    }
});

todoDisplay.addEventListener('click', (event) => {
    const button = event.target;
    if (button.classList && button.classList.contains('delete_button')) {
        const taskItem = button.closest('.task_item');
        if (taskItem) {
            todoDisplay.removeChild(taskItem);
        }
    }
});