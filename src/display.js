import todoList from './todoList'

const display = (function () {
    const projectList = document.querySelector('#projectList');
    const todos = document.querySelector('#todo-list')

    let titleElement = document.querySelector('#title');
    let descriptionElement = document.querySelector('#description');
    let dueDateElement = document.querySelector('#date');
    let priorityElement = document.querySelector('#priority');

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
        let projects = todoList.getAllProjects();
        projects.forEach(project => {
            
            let createProjectItem = () =>{
                let li = document.createElement('li');
                li.addEventListener("click", () => {
                    changeProject(project);
                })
                return li;
            }

            let projectItem = createProjectItem();
            if (isCurrentProject(project) == true) {
                projectItem.classList.add('selected')
            }
            projectItem.innerHTML = project;
            projectList.appendChild(projectItem);
            })
    } 

    const updateProjectHeader = () => {
        currentHeader.innerHTML = current;
    }

    const viewTodo = (todo) => {
        todoDetails.innerHTML = todo.getTitle();
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

            let todoItem = document.createElement('li');
            todoItem.addEventListener('click', () => {
                selectTodo(todo.getTitle());
                viewTodo(todo);
            })

            todoItem.classList.add('todo');
            todoItem.innerHTML = todo.getTitle();
            todos.appendChild(todoItem);
        })

        updateProjectHeader();
    }

    let resetAddFields = () => {
        titleElement.value = descriptionElement.value = "";
        dueDateElement.valueAsDate = new Date(); 
    }

    // reads the value in the add todo form
    const getTodoDetails = () => {
        let title = titleElement.value;
        let description = descriptionElement.value;
        let dueDate = dueDateElement.value;
        let priority = priorityElement.value;

        
        if (title != "" && priority != "" && dueDate != "") {
            resetAddFields();
            return {title, description, dueDate, priority};
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
        const projectName = document.querySelector('#projectName');
        todoList.addProject(projectName.value);
        changeProject(projectName.value);
        projectName.value = "";
        showProjects();
    }

    const renderButtons = () => {
        const addTodoButton = document.querySelector('#addTodo');
        const addProjectButton = document.querySelector('#addProject');

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