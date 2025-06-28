let currentStage = 'todo';
        let tasks = {
            todo: [],
            completed: [],
            archived: []
        };
        let filteredTasks = [];
        let searchQuery = '';
        let sortFilter = 'newest';
        let dateFilter = 'all';

        
        function initApp() {
            checkAuth();
            loadTasksOrPopulateDummy();
            updateStageCounts();
            renderTasks();
        }

       
        function checkAuth() {
            const userData = localStorage.getItem('todoUserData');
            if (!userData) {
                window.location.href = 'index.html';
                return;
            }
            
            try {
                const user = JSON.parse(userData);
                if (!user.name || !user.dob) {
                    window.location.href = 'index.html';
                    return;
                }
                
              
                const avatarUrl = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(user.name)}`;
                document.getElementById('userAvatar').src = avatarUrl;
                document.getElementById('userName').textContent= 'Welcome, ' + user.name;
                
            } catch (e) {
                window.location.href = 'index.html';
            }
        }

    
        function loadTasksOrPopulateDummy() {
            const savedTasks = localStorage.getItem('taskifyTasks');
            if (savedTasks) {
                tasks = JSON.parse(savedTasks);
                return;
            }
    
            fetch('https://dummyjson.com/todos')
                .then(response => response.json())
                .then(data => {
                    const now = new Date().toISOString();
                    tasks.todo = data.todos.map(todo => ({
                        id: todo.id,
                        title: todo.todo,
                        timestamp: now,
                        lastModified: now
                    }));
                    tasks.completed = [];
                    tasks.archived = [];
                    saveTasks();
                    updateStageCounts();
                    renderTasks();
                })
                .catch(() => {
            
                    tasks = { todo: [], completed: [], archived: [] };
                    saveTasks();
                });
        }


        function saveTasks() {
            localStorage.setItem('taskifyTasks', JSON.stringify(tasks));
        }

        
        function updateStageCounts() {
            document.getElementById('todoCount').textContent = tasks.todo.length;
            document.getElementById('completedCount').textContent = tasks.completed.length;
            document.getElementById('archivedCount').textContent = tasks.archived.length;
        }


        function switchStage(stage) {
            currentStage = stage;
         
            document.querySelectorAll('.stage-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.closest('.stage-tab').classList.add('active');
            
          
            document.getElementById('searchInput').value = '';
            document.getElementById('sortFilter').value = 'newest';
            document.getElementById('dateFilter').value = 'all';
            searchQuery = '';
            sortFilter = 'newest';
            dateFilter = 'all';
            
            renderTasks();
        }

       
        function handleTaskInput(event) {
            if (event.key === 'Enter') {
                addTask();
            }
        }

     
        function showAlert(type, title, message) {
      
            const existingAlert = document.querySelector('.alert');
            if (existingAlert) {
                existingAlert.remove();
            }

    
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            
          
            const icon = getAlertIcon(type);
            
            alert.innerHTML = `
                <div class="alert-icon">${icon}</div>
                <div class="alert-content">
                    <div class="alert-title">${title}</div>
                    <div class="alert-message">${message}</div>
                </div>
            `;
            
           
            document.body.appendChild(alert);
            
        
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.style.animation = 'slideOutUp 0.3s ease-out';
                    setTimeout(() => {
                        if (alert.parentNode) {
                            alert.remove();
                        }
                    }, 300);
                }
            }, 4000);
        }

        function getAlertIcon(type) {
            switch (type) {
                case 'success':
                    return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline></svg>';
                case 'info':
                    return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
                case 'warning':
                    return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
                case 'error':
                    return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
                default:
                    return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
            }
        }

        function showEmptyTaskAlert() {
            showAlert('error', 'Empty Task', 'Please enter a task description');
        }

        
        function addTask() {
            const taskInput = document.getElementById('taskInput');
            const taskText = taskInput.value.trim();
            if (!taskText) {
                showEmptyTaskAlert();
                return;
            }
            const newTask = {
                id: Date.now(),
                title: taskText,
                timestamp: new Date().toISOString(),
                lastModified: new Date().toISOString()
            };
            tasks[currentStage].push(newTask);
            saveTasks();
            updateStageCounts();
            renderTasks();
          
           
            showAlert('success', 'Task Added', `"${taskText}" has been added to ${currentStage}`);
            
            taskInput.value = '';
            taskInput.focus();
        }

        function moveTask(taskId, fromStage, toStage) {
            const taskIndex = tasks[fromStage].findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                const task = tasks[fromStage].splice(taskIndex, 1)[0];
                task.lastModified = new Date().toISOString();
                tasks[toStage].push(task);
                saveTasks();
                updateStageCounts();
                renderTasks();
                
                
                const stageNames = {
                    'todo': 'Todo',
                    'completed': 'Completed',
                    'archived': 'Archived'
                };
                
                showAlert('success', 'Task Moved', `"${task.title}" has been moved from ${stageNames[fromStage]} to ${stageNames[toStage]}`);
            }
        }

        function renderTasks() {
            filterTasks(); 
        }

 
        function createTaskCard(task) {
            const timestamp = new Date(task.lastModified).toLocaleString();
            const actions = getTaskActions(task.id);
            
            return `
                <div class="task-card">
                    <div class="task-header">
                        <h4 class="task-title">${task.title}</h4>
                        <p class="task-timestamp">Last modified: ${timestamp}</p>
                    </div>
                    <div class="task-actions">
                        ${actions}
                    </div>
                </div>
            `;
        }


        function getTaskActions(taskId) {
            switch (currentStage) {
                case 'todo':
                    return `
                        <button class="btn btn-small" onclick="moveTask(${taskId}, 'todo', 'completed')">Mark as Completed</button>
                        <button class="btn-outline btn-small" onclick="moveTask(${taskId}, 'todo', 'archived')">Archive</button>
                    `;
                case 'completed':
                    return `
                        <button class="btn btn-small" onclick="moveTask(${taskId}, 'completed', 'todo')">Move to Todo</button>
                        <button class="btn-outline btn-small" onclick="moveTask(${taskId}, 'completed', 'archived')">Archive</button>
                    `;
                case 'archived':
                    return `
                        <button class="btn btn-small" onclick="moveTask(${taskId}, 'archived', 'todo')">Move to Todo</button>
                        <button class="btn-outline btn-small" onclick="moveTask(${taskId}, 'archived', 'completed')">Move to Completed</button>
                    `;
                default:
                    return '';
            }
        }

        
        function getEmptyStateMessage() {
            switch (currentStage) {
                case 'todo':
                    return 'Add some tasks to get started!';
                case 'completed':
                    return 'Complete some tasks to see them here.';
                case 'archived':
                    return 'Archived tasks will appear here.';
                default:
                    return '';
            }
        }

     
        function filterTasks() {
            searchQuery = document.getElementById('searchInput').value.toLowerCase();
            sortFilter = document.getElementById('sortFilter').value;
            dateFilter = document.getElementById('dateFilter').value;
            
            let currentTasks = [...tasks[currentStage]];
            
         
            if (searchQuery) {
                currentTasks = currentTasks.filter(task => 
                    task.title.toLowerCase().includes(searchQuery)
                );
            }
            
         
            if (dateFilter !== 'all') {
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                
                currentTasks = currentTasks.filter(task => {
                    const taskDate = new Date(task.lastModified);
                    switch (dateFilter) {
                        case 'today':
                            return taskDate >= today;
                        case 'week':
                            return taskDate >= weekAgo;
                        case 'month':
                            return taskDate >= monthAgo;
                        default:
                            return true;
                    }
                });
            }
            
           
            currentTasks.sort((a, b) => {
                switch (sortFilter) {
                    case 'newest':
                        return new Date(b.lastModified) - new Date(a.lastModified);
                    case 'oldest':
                        return new Date(a.lastModified) - new Date(b.lastModified);
                    case 'alphabetical':
                        return a.title.localeCompare(b.title);
                    default:
                        return 0;
                }
            });
            
            filteredTasks = currentTasks;
            renderFilteredTasks();
        }

       
        function clearSearch() {
            document.getElementById('searchInput').value = '';
            searchQuery = '';
            filterTasks();
            showAlert('info', 'Search Cleared', 'Search has been cleared');
        }

        function renderFilteredTasks() {
            const tasksList = document.getElementById('tasksList');
            
            if (filteredTasks.length === 0) {
                const searchMessage = searchQuery ? `No tasks found matching "${searchQuery}"` : `No ${currentStage} tasks`;
                const dateMessage = dateFilter !== 'all' ? ` in the selected time period` : '';
                tasksList.innerHTML = `
                    <div class="empty-state">
                        <h3>${searchMessage}${dateMessage}</h3>
                        <p>${getEmptyStateMessage()}</p>
                    </div>
                `;
                return;
            }
            
            tasksList.innerHTML = filteredTasks.map(task => createTaskCard(task)).join('');
        }

     
        function logout() {
            localStorage.removeItem('todoUserData');
            localStorage.removeItem('taskifyTasks');
            showAlert('info', 'Logged Out', 'You have been successfully logged out');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }

       
        document.addEventListener('DOMContentLoaded', function() {
            initApp();
        });