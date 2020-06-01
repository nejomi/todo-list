const todoList = (function () {
    // factory
    const Todo = (details) => {
        console.log(details);
        const getTitle = () => details.title;
    
        const getDetails = () => {
            return details
        }

        const getPriority = () => details.priority;
        
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
            storage.save();
        }
        
        return {
            getTitle, getDetails, changeDetail, getPriority
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

    const deleteTodo = (todoTitle) => {
        for(let i = 0; i < currentProject.length; i++) {
            if (currentProject[i].getTitle() == todoTitle) {
                currentProject.splice(i, 1);
                storage.save();
                return;
            }
        }
    }
    
    const addTodo = (details) => {
        let status = false;
        currentProject.push(Todo(details));
        storage.save();
    }

    const changeCurrent = (value) => {
        currentProject = projects[value];
    }

    const getCurrent = () => {
        return Object.keys(projects).find(key => projects[key] === currentProject);
    }

    return {
        addTodo, getProject, getAllProjects, changeCurrent,
        getCurrent, getAllTodos, addProject, deleteTodo
    }
})();



export default todoList;