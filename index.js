const taskContainer = document.querySelector(".task__container");
let globalTaskData = [];

const saveToLocalStorage = () => {
    localStorage.setItem("TaskyCA",JSON.stringify({card :globalTaskData}));
};
const addNewCard = () => {

    const taskData = {
        id: `${Date.now()}`,
        title: document.getElementById("tasktitle").value,
        image: document.getElementById("imageurl").value,
        type: document.getElementById("tasktype").value,
        description: document.getElementById("taskdescription").value
    };
    globalTaskData.push(taskData);

    saveToLocalStorage();

    const newCard = generateCard(taskData);
    taskContainer.insertAdjacentHTML("beforeend",newCard);

    document.getElementById("tasktitle").value ="";
    document.getElementById("imageurl").value = "";
    document.getElementById("tasktype").value = "";
    document.getElementById("taskdescription").value = "";
    return;
};




const loadExistingCards = () => {
    const taskData = JSON.parse(localStorage.getItem("TaskyCA"));
    if(!taskData) return;
    globalTaskData = taskData.card;

    globalTaskData.map((taskData) => {
        const newCard = generateCard(taskData);
        taskContainer.insertAdjacentHTML("beforeend",newCard);
    })
};

const deleteCard = (id) => {
    const removeTask = globalTaskData.filter((taskdata)=>{
        return taskdata.id !== id;
    });
    globalTaskData = removeTask;
    saveToLocalStorage();
    taskContainer.removeChild(document.getElementById(id));

};

const editCard = (id) => {
    const card = document.getElementById(id);
    const taskTitle = card.childNodes[1].childNodes[5].childNodes[1];
    const taskDescription = card.childNodes[1].childNodes[5].childNodes[3];
    const taskType = card.childNodes[1].childNodes[5].childNodes[5];
    const submitButton = card.childNodes[1].childNodes[7].childNodes[1];
    taskTitle.setAttribute("contenteditable","true");
    taskDescription.setAttribute("contenteditable","true");
    taskType.setAttribute("contenteditable","true");
    submitButton.setAttribute("onclick","saveEdit(this.name)");
    submitButton.innerHTML= "Save Changes";
}

const saveEdit = (id) =>{
    console.log("saveEdit is called");
    const card = document.getElementById(id);
    const taskTitle = card.childNodes[1].childNodes[5].childNodes[1];
    const taskDescription = card.childNodes[1].childNodes[5].childNodes[3];
    const taskType = card.childNodes[1].childNodes[5].childNodes[5];
    const submitButton = card.childNodes[1].childNodes[7].childNodes[1];
    
    const updatedData = {
        title : taskTitle.innerHTML,
        description : taskDescription.innerHTML,
        type : taskType.innerHTML,
    };
    const updatedGlobalTaskData = globalTaskData.map((task)=>{
        if(task.id === id){
            return {...task, ...updatedData};
        }
        return task;
    });
    globalTaskData = updatedGlobalTaskData;
    saveToLocalStorage();
    taskTitle.setAttribute("contenteditable","false");
    taskDescription.setAttribute("contenteditable","false");
    taskType.setAttribute("contenteditable","false");
    submitButton.setAttribute("onclick","openTask(this.name)");
    submitButton.innerHTML= "Open Task";
};

const openTask = (id) => {
    let taskToOpen = {};
    globalTaskData.map( (task) =>{
        if(task.id === id){
            taskToOpen = task;
        }
    });
    console.log(taskToOpen);
    document.getElementById("openTaskModalTitle").innerHTML = taskToOpen.title;
    document.getElementById("openTaskModalImage").setAttribute("src",taskToOpen.image)
    document.getElementById("openTaskModalDescription").innerHTML = taskToOpen.description;
    document.getElementById("openTaskModalType").innerHTML = taskToOpen.type;
    
    var myModal = new bootstrap.Modal(document.getElementById('openTaskModal'));
    myModal.show();
};
const searchResult = () =>{
    const searchQuery = document.getElementById("searchInput").value.toLowerCase()
    searchResultData = globalTaskData.filter((task)=>{
        return (task.title.toLowerCase().includes(searchQuery) || task.description.toLowerCase().includes(searchQuery) || task.type.toLowerCase().includes(searchQuery))
    })
    taskContainer.innerHTML = "";
    searchResultData.map((taskData) => {
        const newCard = generateCard(taskData);
        taskContainer.insertAdjacentHTML("beforeend",newCard);
    })
    document.getElementById("closeSearch").setAttribute("class","btn btn-danger");
};

const closeSearchResults = () => {
    taskContainer.innerHTML = "";
    globalTaskData.map((taskData) => {
        const newCard = generateCard(taskData);
        taskContainer.insertAdjacentHTML("beforeend",newCard);
    })
    document.getElementById("closeSearch").setAttribute("class","btn btn-danger collapse");
};
const generateCard = (taskData) => {
    return `<div id= ${taskData.id} class="col-md-6 col-lg-4 mb-3">
        <div class="card shadow-lg" >
            <div class="card-header d-flex justify-content-end gap-2">
                <a href="#" class="btn btn-outline-info " name="${taskData.id}"onclick="editCard(this.name)">
                    <i class="fas fa-pencil-alt"></i>
                </a>
                <a href="#" class="btn btn-outline-danger" name="${taskData.id}" onclick="deleteCard(this.name)">
                    <i class="fas fa-trash-alt"></i>
                </a>
            </div>
            <img src= ${taskData.image} class="card-img-tcop m-3 mb-0 rounded" alt="bird">
            <div class="card-body">
            <h5 class="card-title">${taskData.title}</h5>
            <p class="card-text">${taskData.description}</p>
            <span class="badge bg-primary">${taskData.type}</span>
            </div>
            <div class="card-footer">
                <a href="#" class="btn btn-outline-primary" name="${taskData.id}" onclick="openTask(this.name)">Open Task</a>
            </div>
        </div>
    </div>`;
};