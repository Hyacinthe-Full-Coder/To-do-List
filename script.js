
let tasks = [];

// Charger les taches depuis le localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    } else {
        tasks = [
            { id: Date.now(), text: 'Exemple de tache', completed: false }
        ];
    }
    renderTasks();
}

// Sauvegarder les taches
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Ajouter une tache
function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    
    if (text === '') {
        alert('Veuillez entrer une tache');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    input.value = '';
}

// Supprimer une tache
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Basculer le statut d'une tache
function toggleTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Effacer les taches terminees
function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

// Filtrer les taches
let currentFilter = 'all';

function setFilter(filter) {
    currentFilter = filter;
    
    // Mettre a jour les boutons actifs
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    renderTasks();
}

// Afficher les taches
function renderTasks() {
    const taskList = document.getElementById('taskList');
    const taskCountSpan = document.getElementById('taskCount');
    
    // Filtrer les taches
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    // Compter les taches actives
    const activeCount = tasks.filter(task => !task.completed).length;
    taskCountSpan.textContent = `${activeCount} tache(s) restante(s)`;
    
    // Afficher les taches
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">Aucune tache a afficher</div>';
        return;
    }
    
    taskList.innerHTML = '';
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(task.id));
        
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Supprimer';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Initialiser l'application
function init() {
    loadTasks();
    
    document.getElementById('addBtn').addEventListener('click', addTask);
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    document.getElementById('clearCompleted').addEventListener('click', clearCompleted);
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });
}

// Demarrer l'application
init();