let tasks = [];

// Function to add a new task
function addTask() {
  const taskTitle = document.getElementById("taskTitle").value.trim();
  const taskDeadline = document.getElementById("taskDeadline").value;

  if (!taskTitle) {
    alert("Please enter a task title.");
    return;
  }

  if (!taskDeadline) {
    alert("Please set a deadline for the task.");
    return;
  }

  const newTask = {
    id: Date.now(),
    title: taskTitle,
    completed: false,
    deadline: new Date(taskDeadline),
  };

  tasks.push(newTask);
  document.getElementById("taskTitle").value = ""; // Clear input field
  document.getElementById("taskDeadline").value = ""; // Clear deadline
  renderTasks(tasks);
}

// Function to mark a task as completed
function toggleTaskCompletion(taskId) {
  tasks = tasks.map(task => {
    if (task.id === taskId) {
      task.completed = !task.completed;

      // Check if task is completed within the deadline
      const now = new Date();
      if (task.completed) {
        if (now <= task.deadline) {
          showNotification(Task "${task.title}" completed on time!);
        } else {
          showNotification(Task "${task.title}" was completed late.);
        }
      }
    }
    return task;
  });

  renderTasks(tasks);
}

// Function to filter tasks based on status
function filterTasks(status) {
  let filteredTasks = tasks;
  if (status === "pending") {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (status === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }
  renderTasks(filteredTasks);
}

// Function to render tasks in the task list
function renderTasks(taskArray) {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = ""; // Clear the task list

  taskArray.forEach(task => {
    const taskItem = document.createElement("li");
    taskItem.className = task.completed ? "completed" : "";

    const taskText = document.createElement("span");
    taskText.innerText = task.title + " (Due: " + task.deadline.toLocaleString() + ")";
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.className = "checkbox";
    checkbox.onclick = () => toggleTaskCompletion(task.id);

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = () => deleteTask(task.id);

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(deleteButton);
    taskList.appendChild(taskItem);
  });
}

// Function to delete a task
function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  renderTasks(tasks);
}

// Function to show notifications
function showNotification(message) {
  const notificationDiv = document.getElementById("notifications");
  notificationDiv.innerText = message;
  setTimeout(() => {
    notificationDiv.innerText = ""; // Clear notification after 3 seconds
  }, 3000);
}

// Reminder for unfinished tasks based on the deadline
function remindUnfinishedTasks() {
  const now = new Date();
  const pendingTasks = tasks.filter(task => !task.completed && task.deadline < now);
  if (pendingTasks.length > 0) {
    showNotification("You have overdue tasks! Please complete them.");
  }
}

// Set a reminder every 30 seconds for overdue tasks
setInterval(remindUnfinishedTasks, 30000);