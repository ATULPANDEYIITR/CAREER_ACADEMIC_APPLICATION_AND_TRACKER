function getTrackerTasks() {
    return JSON.parse(localStorage.getItem("career_tracker_tasks") || "[]");
}

function saveTrackerTasks(data) {
    localStorage.setItem("career_tracker_tasks", JSON.stringify(data));
}

function renderTasksModule() {
    const tasks = getTrackerTasks();

    const open = tasks.filter(x => x.status !== "DONE").length;
    const done = tasks.filter(x => x.status === "DONE").length;
    const high = tasks.filter(x => x.priority === "HIGH" && x.status !== "DONE").length;

    document.getElementById("content").innerHTML = `
        <div class="page-header">
            <div>
                <h1>Tasks</h1>
                <p>Manage applications, PhD research, documents and follow-up actions.</p>
            </div>
            <button class="primary-btn" onclick="showTaskForm()">+ Add Task</button>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <span>OPEN</span>
                <strong>${open}</strong>
                <small>Pending tasks</small>
            </div>

            <div class="stat-card">
                <span>COMPLETED</span>
                <strong>${done}</strong>
                <small>Finished tasks</small>
            </div>

            <div class="stat-card">
                <span>HIGH PRIORITY</span>
                <strong>${high}</strong>
                <small>Requires attention</small>
            </div>

            <div class="stat-card">
                <span>TOTAL</span>
                <strong>${tasks.length}</strong>
                <small>All tasks</small>
            </div>
        </div>

        <div class="panel">
            <div class="panel-header">
                <div>
                    <h2>Task Manager</h2>
                    <p>Track deadlines, documents, follow-ups and preparation activities.</p>
                </div>
            </div>

            <div class="filter-row">
                <input
                    id="taskSearch"
                    class="search-input"
                    placeholder="Search tasks..."
                />

                <select id="taskStatus" class="filter-select">
                    <option value="">All Statuses</option>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                </select>

                <select id="taskPriority" class="filter-select">
                    <option value="">All Priorities</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </select>
            </div>

            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Module</th>
                            <th>Due Date</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody id="tasksTable"></tbody>
                </table>
            </div>
        </div>
    `;

    function draw(list) {
        const tbody = document.getElementById("tasksTable");

        if (!list.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        No tasks found. Click "+ Add Task" to create one.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = list.map(item => `
            <tr>
                <td><strong>${item.title || ""}</strong></td>
                <td>${item.module || ""}</td>
                <td>${item.dueDate || "Not specified"}</td>
                <td>${badge(item.priority || "MEDIUM")}</td>
                <td>${badge(item.status || "TODO")}</td>
                <td>
                    ${
                        item.status !== "DONE"
                        ? `<button class="secondary-btn" onclick="completeTask('${item.id}')">Complete</button>`
                        : "Completed"
                    }
                </td>
            </tr>
        `).join("");
    }

    function applyFilters() {
        const search = document.getElementById("taskSearch").value.toLowerCase();
        const status = document.getElementById("taskStatus").value;
        const priority = document.getElementById("taskPriority").value;

        const filtered = tasks.filter(item => {
            const text = Object.values(item).join(" ").toLowerCase();

            return (
                (!search || text.includes(search)) &&
                (!status || item.status === status) &&
                (!priority || item.priority === priority)
            );
        });

        draw(filtered);
    }

    document
        .getElementById("taskSearch")
        .addEventListener("input", applyFilters);

    document
        .getElementById("taskStatus")
        .addEventListener("change", applyFilters);

    document
        .getElementById("taskPriority")
        .addEventListener("change", applyFilters);

    draw(tasks);
}

function showTaskForm() {
    document.getElementById("modal").classList.add("show");

    document.getElementById("modalContent").innerHTML = `
        <h2>Add Task</h2>

        <div class="form-grid">
            <input id="taskTitle" placeholder="Task title" />

            <select id="taskModule">
                <option value="JOBS">JOBS</option>
                <option value="PHD_CS">PHD_CS</option>
                <option value="PHD_MANAGEMENT">PHD_MANAGEMENT</option>
                <option value="GENERAL">GENERAL</option>
            </select>

            <input id="taskDueDate" type="date" />

            <select id="taskPriorityInput">
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM" selected>MEDIUM</option>
                <option value="LOW">LOW</option>
            </select>

            <select id="taskStatusInput">
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
            </select>

            <input id="taskNotes" placeholder="Notes" />
        </div>

        <div class="modal-actions">
            <button class="secondary-btn" onclick="closeModal()">Cancel</button>
            <button class="primary-btn" onclick="saveTask()">Save Task</button>
        </div>
    `;
}

function saveTask() {
    const item = {
        id: "TASK-" + Date.now(),
        title: document.getElementById("taskTitle").value.trim(),
        module: document.getElementById("taskModule").value,
        dueDate: document.getElementById("taskDueDate").value,
        priority: document.getElementById("taskPriorityInput").value,
        status: document.getElementById("taskStatusInput").value,
        notes: document.getElementById("taskNotes").value.trim()
    };

    if (!item.title) {
        alert("Please enter the task title.");
        return;
    }

    const tasks = getTrackerTasks();

    tasks.push(item);

    saveTrackerTasks(tasks);

    closeModal();
    renderTasksModule();
}

function completeTask(id) {
    const tasks = getTrackerTasks();

    const task = tasks.find(x => x.id === id);

    if (task) {
        task.status = "DONE";
        saveTrackerTasks(tasks);
        renderTasksModule();
    }
}

function renderCalendarModule() {
    const applications = getApplications ? getApplications() : [];
    const tasks = getTrackerTasks();

    const events = [];

    applications.forEach(item => {
        if (item.interviewDate) {
            events.push({
                date: item.interviewDate,
                title: "Interview: " + item.role,
                type: "INTERVIEW"
            });
        }

        if (item.appliedDate) {
            events.push({
                date: item.appliedDate,
                title: "Application: " + item.role,
                type: "APPLICATION"
            });
        }
    });

    tasks.forEach(item => {
        if (item.dueDate) {
            events.push({
                date: item.dueDate,
                title: item.title,
                type: "TASK"
            });
        }
    });

    events.sort((a, b) => a.date.localeCompare(b.date));

    document.getElementById("content").innerHTML = `
        <div class="page-header">
            <div>
                <h1>Calendar</h1>
                <p>Applications, interviews and task deadlines in one timeline.</p>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <span>EVENTS</span>
                <strong>${events.length}</strong>
                <small>Tracked dates</small>
            </div>

            <div class="stat-card">
                <span>INTERVIEWS</span>
                <strong>${events.filter(x => x.type === "INTERVIEW").length}</strong>
                <small>Interview dates</small>
            </div>

            <div class="stat-card">
                <span>APPLICATIONS</span>
                <strong>${events.filter(x => x.type === "APPLICATION").length}</strong>
                <small>Application dates</small>
            </div>

            <div class="stat-card">
                <span>TASKS</span>
                <strong>${events.filter(x => x.type === "TASK").length}</strong>
                <small>Task deadlines</small>
            </div>
        </div>

        <div class="panel">
            <div class="panel-header">
                <div>
                    <h2>Upcoming Timeline</h2>
                    <p>Dates are generated from your saved tracker records.</p>
                </div>
            </div>

            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Event</th>
                            <th>Type</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${
                            events.length
                            ? events.map(event => `
                                <tr>
                                    <td><strong>${event.date}</strong></td>
                                    <td>${event.title}</td>
                                    <td>${badge(event.type)}</td>
                                </tr>
                            `).join("")
                            : `
                                <tr>
                                    <td colspan="3" class="empty-state">
                                        No calendar events yet.
                                    </td>
                                </tr>
                            `
                        }
                    </tbody>
                </table>
            </div>
        </div>
    `;
}
