import './style.css';
import { signUp, signIn, signOut, getCurrentUser, onAuthStateChange } from './auth.js';
import { getTodos, addTodo, deleteTodo, toggleTodo } from './todos.js';

let currentUser = null;

const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const authForm = document.getElementById('auth-form');
const authToggle = document.getElementById('auth-toggle');
const authSubmit = document.getElementById('auth-submit');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authError = document.getElementById('auth-error');
const signOutBtn = document.getElementById('sign-out-btn');
const userEmail = document.getElementById('user-email');
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoDisplay = document.getElementById('todo-display');

let isSignUp = false;

authToggle.addEventListener('click', () => {
  isSignUp = !isSignUp;
  authSubmit.textContent = isSignUp ? 'Sign Up' : 'Sign In';
  authToggle.textContent = isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up";
  authError.textContent = '';
});

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = authEmail.value;
  const password = authPassword.value;

  let result;
  if (isSignUp) {
    result = await signUp(email, password);
  } else {
    result = await signIn(email, password);
  }

  if (result.error) {
    authError.textContent = result.error.message;
  } else {
    authEmail.value = '';
    authPassword.value = '';
    authError.textContent = '';
  }
});

signOutBtn.addEventListener('click', async () => {
  await signOut();
});

addButton.addEventListener('click', async () => {
  const taskText = todoInput.value.trim();
  if (taskText !== '') {
    const { data, error } = await addTodo(taskText);
    if (!error && data) {
      renderTodo(data);
      todoInput.value = '';
    }
  }
});

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addButton.click();
  }
});

todoDisplay.addEventListener('click', async (e) => {
  const button = e.target;
  const taskItem = button.closest('.task-item');

  if (!taskItem) return;

  const todoId = taskItem.dataset.id;

  if (button.classList.contains('delete-button')) {
    const { error } = await deleteTodo(todoId);
    if (!error) {
      taskItem.remove();
    }
  } else if (button.classList.contains('toggle-button')) {
    const isCompleted = taskItem.classList.contains('completed');
    const { error } = await toggleTodo(todoId, !isCompleted);
    if (!error) {
      taskItem.classList.toggle('completed');
      button.textContent = taskItem.classList.contains('completed') ? '↩' : '✓';
    }
  }
});

function renderTodo(todo) {
  const taskItem = document.createElement('div');
  taskItem.className = `task-item ${todo.completed ? 'completed' : ''}`;
  taskItem.dataset.id = todo.id;

  const taskText = document.createElement('span');
  taskText.textContent = todo.task;

  const toggleButton = document.createElement('button');
  toggleButton.className = 'toggle-button';
  toggleButton.textContent = todo.completed ? '↩' : '✓';

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-button';
  deleteButton.textContent = 'Delete';

  taskItem.appendChild(taskText);
  taskItem.appendChild(toggleButton);
  taskItem.appendChild(deleteButton);
  todoDisplay.insertBefore(taskItem, todoDisplay.firstChild);
}

async function loadTodos() {
  todoDisplay.innerHTML = '';
  const { data, error } = await getTodos();
  if (!error && data) {
    data.reverse().forEach(todo => renderTodo(todo));
  }
}

onAuthStateChange(async (event, session) => {
  currentUser = session?.user || null;

  if (currentUser) {
    authSection.style.display = 'none';
    appSection.style.display = 'flex';
    userEmail.textContent = currentUser.email;
    await loadTodos();
  } else {
    authSection.style.display = 'flex';
    appSection.style.display = 'none';
  }
});

getCurrentUser().then(user => {
  currentUser = user;
  if (currentUser) {
    authSection.style.display = 'none';
    appSection.style.display = 'flex';
    userEmail.textContent = currentUser.email;
    loadTodos();
  }
});
