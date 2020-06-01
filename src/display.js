import todoList from './todoList'

const display = (function () {
    const projectList = document.querySelector('#sideBarProjects');
    const todos = document.querySelector('#task-list')

    let titleElement = document.querySelector('#title');
    let descriptionElement = document.querySelector('#description');
    let dueDateElement = document.querySelector('#date');
    let priorityElement = document.querySelector('#priority');

    // let detailsTitle = document.querySelector('#todoDetailsTitle');
    // let detailsDescription = document.querySelector('#todoDetailsTitle');
    // let detailsDate = document.querySelector('#todoDetailsTitle');
    // let detailsPriority = document.querySelector('#todoDetailsTitle');

    let currentHeader = document.querySelector('.current-project');
    let todoDetails = document.querySelector('.todo-details');

    let current = todoList.getCurrent();

    /* ---------------------------------------------------- */

    const changeProject = (name) => {
        todoList.changeCurrent(name);
        render();
    }
    
    const clearProjectList = () => {
        projectList.innerHTML = "";
    }

    const clearProjectTodos = () => {
        todos.innerHTML = "";
    }

    const clearTodoDetails = () => {
        todoDetails.innerHTML = "";
    }

    const isCurrentProject = (project) => {
        current = todoList.getCurrent();
        if (project == current) {
            return true;
        }
    }

    const showProjects = () => {
        clearProjectList();
        clearTodoDetails();
        let projects = todoList.getAllProjects();
        projects.forEach(project => {
            
            let createProjectItem = () =>{
                let li = document.createElement('div');
                li.addEventListener("click", () => {
                    changeProject(project);
                })
                return li;
            }

            let projectItem = createProjectItem();
            if (isCurrentProject(project) == true) {
                projectItem.classList.add('selected-project')
            }

            projectItem.classList.add('project-name','side-bar-text');
            projectItem.innerHTML = project;
            projectList.appendChild(projectItem);
            })
    } 

    const updateProjectHeader = () => {
        currentHeader.innerHTML = current;
    }

    // create html elements on demand when todo is clicked and read the todo details
    const createTodoDetails = (todo) => {
        let details = todo.getDetails();

        let detailsTitle = document.createElement('input');
        detailsTitle.type='text';
        detailsTitle.value = details['title'];

        let detailsDescription = document.createElement('input');
        detailsDescription.type='text';
        detailsDescription.value = details['description'];

        let detailsDate = document.createElement('input');
        detailsDate.type = 'date';
        detailsDate.value = details['dueDate'];

        let detailsPriority = document.createElement('input');
        detailsPriority.type = 'number';
        detailsPriority.value = details['priority']

        let deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.innerHTML = 'Delete Todo';

        deleteButton.addEventListener('click', () => {
            todoList.deleteTodo(details['title']);
            render();
        })

        let saveButton = document.createElement('button');
        saveButton.type = 'button';
        saveButton.innerHTML = 'Save Changes';

        saveButton.addEventListener('click', () => {
            let title = detailsTitle.value;
            let description = detailsDescription.value;
            let date = detailsDate.value;
            let priority = detailsPriority.value;

            if (title != details['title']) {
                todo.changeDetail('title', title);
            }
            else if (description != details['description']) {
                todo.changeDetail('description', description);
            }
            else if (date != details['dueDate']) {
                todo.changeDetail('dueDate', date);
            }
            else if (priority != details['priority']) {
                todo.changeDetail('priority', priority);
            }

            render();
        })

        return {detailsTitle, detailsDescription, detailsDate, detailsPriority, deleteButton, saveButton}
    }

    // if todo is clicked, show its details and allow user to edit it
    const viewTodo = (todo) => {
        clearTodoDetails(); 
        // create elements on demand
        let elements = Object.values(createTodoDetails(todo));

        // append elements to details div
        elements.forEach(element => {
            todoDetails.appendChild(element);
        })
    }

    const showProjectTodos = () => {
        clearProjectTodos();
        let projectTodos = todoList.getAllTodos();
        projectTodos.forEach(todo => {

            let selectTodo = (title) => {
                let todos = Array.from(document.querySelectorAll('.todo'));
                
                for(let i = 0; i < todos.length; i++) {
                    todos[i].classList.remove('current-todo');
                    if(todos[i].innerHTML == title) {
                        todos[i].classList.add('current-todo');
                    }
                }
            }
            
            let todoItem = document.createElement('div');
            todoItem.classList.add('task');

            let todoLeft = document.createElement('div');
            todoLeft.classList.add('task-left');

            let taskBox = document.createElement('div');
            taskBox.classList.add('task-box');

            if (todo.getPriority() == 1) {
                taskBox.classList.add('priority-1')
            }
            else if (todo.getPriority() == 2) {
                taskBox.classList.add('priority-2')
            }
            else if (todo.getPriority() == 3) {
                taskBox.classList.add('priority-3')
            }

            taskBox.addEventListener('click', ()=> {
                console.log('give up');
            })

            todoItem.addEventListener('click', () => {
                selectTodo(todo.getTitle());
                viewTodo(todo);
                console.log(todo.getDetails());
            })

            let taskTitle = document.createElement('div');
            taskTitle.innerHTML = todo.getTitle();
            
            let editButton = document.createElement('img');
            editButton.classList.add('edit-button');
            editButton.src = "assets/create-24px.svg";
            

            todoLeft.appendChild(taskBox);
            todoLeft.appendChild(taskTitle);
            
            todoItem.appendChild(todoLeft);
            todoItem.appendChild(editButton);

            todos.appendChild(todoItem);
        })

        updateProjectHeader();
    }


    let resetAddFields = () => {
        titleElement.value = descriptionElement.value = priorityElement.value = "";
        dueDateElement.valueAsDate = new Date(); 
    }

    // reads the value in the add todo form
    const getTodoDetails = () => {
        let title = titleElement.value;
        let description = descriptionElement.value;
        let dueDate = dueDateElement.value;
        let priority = priorityElement.value;
        let status = 0;

        if (title != "" && priority != "" && dueDate != "") {
            resetAddFields();
            return {title, description, dueDate, priority, status};
        }

        else {
            return 0
        } 
    }

    const addTodo =  () => {
        let details = getTodoDetails();
        if (details) {
            todoList.addTodo(details);
        }
        showProjectTodos();
    }

    const addProject = () => {
        const projectName = document.querySelector('#addProjectName');
        if (projectName.value == "") {
            return;
        }
        todoList.addProject(projectName.value);
        changeProject(projectName.value);
        projectName.value = "";
        showProjects();
    }

    const renderButtons = () => {
        const addTodoButton = document.querySelector('#addTodo');
        const addProjectButton = document.querySelector('#addProjectButton');

        addTodoButton.addEventListener('click', addTodo);
        addProjectButton.addEventListener('click', addProject);
    }

    const render = () => {
        showProjects();
        showProjectTodos();
        renderButtons();
    }
    
    return {
        render
    }
})(); 

(function () {
    let dueDateElement = document.querySelector('#date');   
    dueDateElement.valueAsDate = new Date(); 
})();


// todoList.addTodo({title: "Sleep", description: "I will sleep", dueDate: "Today", priority: 3});
// todoList.addTodo({title: "Eat", description: "I will eat", dueDate: "Today", priority: 2});

// todoList.changeCurrent("Eyaw world");
// todoList.addTodo({title: "Eyaw", description: "blaise benta", dueDate: "Tomorrow", priority: 69})
// todoList.updateTodo("Sleep", "priority", 69);
// todoList.showTodo("Sleep");

export default display;