const todoList = (function () {
    // factory
    const Todo = (details) => {
        const getTitle = () => details.title;
    
        const getDetails = () => {
            return details
        }
        
        const changeDetail  = (detail, value) =>  { 
            switch (detail) {
                case 'title':
                    details.title = value;
                    break;
                case 'description':
                    details.description = value;
                    break;
                case 'dueDate':
                    details.dueDate = value;
                    break;
                case 'priority':
                    details.priority = value;
                    break;
            }
            saveLocal();
        }
        
        return {
            getTitle, getDetails, changeDetail
        }
    }

    // handles storage 
    const storage = (function () {
        // saves todo list in localstorage with each todo's details
        const save = () => {
            let projectNames = Object.keys(projects);
            let projectTodos = Object.values(projects);

            let object = {};
            // iterate through projects
            for(let i=0; i<projectNames.length; i++) {
                // set i'th key to project name
                object[projectNames[i]] = [];
                // iterate through todos and return their details
                for(let k=0; k<projectTodos[i].length; k++) {
                    object[projectNames[i]].push(projectTodos[i][k].getDetails());
                }
            }
            localStorage.setItem("userProjects", JSON.stringify(object));
        }

        // gets todo list in localstorage then convert todo using its details using Todo factory
        function get () {
            // get object from localstorage
            let object = JSON.parse(localStorage.getItem("userProjects"));
            let keys = Object.keys(object);

            //iterate through the keys(todos) of each project and use their details to convert them to a proper 'Todo'
            for(let i=0; i<keys.length; i++) {
                for(let k=0; k<object[keys[i]].length; k++) {
                    let todoProper = Todo(object[keys[i]][k]);
                    object[keys[i]][k] = todoProper;
                }
            }
            return object;
        }

        // check if todolist exists in local storage, if not create one
        function check () {
            if (localStorage.getItem('userProjects') === null) {
                let userProjects = {
                    "Today": []
                }
        
                localStorage.setItem("userProjects", JSON.stringify(userProjects))
            }
        }
        
        return {save, get, check}
    })();

    // check if local storage is present
    storage.check();

    /* ---------------------------------------------------- */

    // get the localstorage values for the projects
    let projects = storage.get();

    // default current project is Today
    let currentProject = projects["Today"];
    
    // return project names
    const getAllProjects = () => Object.keys(projects);

    // return todos of current Project
    const getAllTodos = () => currentProject;

    const getProject = (projectName) => {
        return(projects[projectName])
    }

    const addProject = (projectName) => {
        // if project already exists return
        if (projects.hasOwnProperty(projectName)) {
            console.log("duplicate project name!")
            return;
        }

        projects[projectName] = [];
        storage.save();
    }

    const _findTodo = (todoTitle) => {
        for (i=0; i<currentProject.length; i++) {
            if (currentProject[i].getTitle() == todoTitle) {
                return currentProject[i];
            }
        }
    }

    // not needed at the moment
    const showTodo = (todoTitle) => {
        console.log(_findTodo(todoTitle).getDetails());
    }
    
    const addTodo = (title, description, dueDate, priority) => {
        currentProject.push(Todo(title, description, dueDate, priority));
        storage.save();
    }

    const updateTodo = (todoTitle, detail, value) => {
        _findTodo(todoTitle).changeDetail(detail, value);
        storage.save();
    }

    const changeCurrent = (value) => {
        currentProject = projects[value];
    }

    const getCurrent = () => {
        return Object.keys(projects).find(key => projects[key] === currentProject);
    }

    return {
        addTodo, getProject, updateTodo, showTodo, getAllProjects, changeCurrent,
        getCurrent, getAllTodos, addProject
    }
})();

export default todoList;