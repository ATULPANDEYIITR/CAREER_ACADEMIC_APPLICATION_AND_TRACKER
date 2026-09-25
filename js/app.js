const content = document.getElementById("content");
const search = document.getElementById("globalSearch");
const modal = document.getElementById("modal");

function badge(text) {
    const type =
        text === "FUNDED" || text === "REMOTE_INDIA" ? "badge-green" :
        text === "HYBRID" ? "badge-blue" :
        text === "ONSITE" ? "badge-orange" :
        "badge-blue";

    return `<span class="badge ${type}">${text}</span>`;
}

function dashboard() {
    content.innerHTML = `
        <div class="dashboard-grid">
            <div class="card">
                <div class="metric-label">New Jobs</div>
                <div class="metric-value">${APP_DATA.jobs.length}</div>
                <div class="metric-sub">Current demo dataset</div>
            </div>

            <div class="card">
                <div class="metric-label">Applications</div>
                <div class="metric-value">${APP_DATA.applications}</div>
                <div class="metric-sub">Tracked applications</div>
            </div>

            <div class="card">
                <div class="metric-label">PhD CS</div>
                <div class="metric-value">${APP_DATA.csTarget}</div>
                <div class="metric-sub">QS Europe target</div>
            </div>

            <div class="card">
                <div class="metric-label">PhD Management</div>
                <div class="metric-value">${APP_DATA.managementTarget}</div>
                <div class="metric-sub">QS Europe target</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">
                <h2>Job Pipeline</h2>
                <span>India + Remote India</span>
            </div>

            <div class="card table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>Company</th>
                            <th>Location</th>
                            <th>Mode</th>
                            <th>Category</th>
                            <th>Deadline</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${APP_DATA.jobs.map(j => `
                            <tr>
                                <td><strong>${j.title}</strong></td>
                                <td>${j.company}</td>
                                <td>${j.location}</td>
                                <td>${badge(j.mode)}</td>
                                <td>${j.category}</td>
                                <td>${j.deadline}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        </div>

        <div class="section cards">
            <div class="card">
                <div class="metric-label">CS Positions</div>
                <div class="metric-value">${APP_DATA.phdCS.length}</div>
                <div class="metric-sub">Demo opportunities</div>
            </div>

            <div class="card">
                <div class="metric-label">Management Positions</div>
                <div class="metric-value">${APP_DATA.phdManagement.length}</div>
                <div class="metric-sub">Demo opportunities</div>
            </div>

            <div class="card">
                <div class="metric-label">Tasks</div>
                <div class="metric-value">${APP_DATA.tasks}</div>
                <div class="metric-sub">Open tracker tasks</div>
            </div>

            <div class="card">
                <div class="metric-label">Data Status</div>
                <div class="metric-value">DEMO</div>
                <div class="metric-sub">Not live verified data</div>
            </div>
        </div>
    `;
}

function jobs(filter = "") {
    const list = APP_DATA.jobs.filter(j =>
        Object.values(j).join(" ").toLowerCase().includes(filter.toLowerCase())
    );

    content.innerHTML = `
        <div class="section-title">
            <h2>Jobs</h2>
            <span>${list.length} records</span>
        </div>

        <div class="card table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Role</th>
                        <th>Company</th>
                        <th>Location</th>
                        <th>Mode</th>
                        <th>Category</th>
                        <th>Source</th>
                        <th>Deadline</th>
                    </tr>
                </thead>
                <tbody>
                    ${list.map(j => `
                        <tr>
                            <td><strong>${j.title}</strong></td>
                            <td>${j.company}</td>
                            <td>${j.location}</td>
                            <td>${badge(j.mode)}</td>
                            <td>${j.category}</td>
                            <td>${j.source}</td>
                            <td>${j.deadline}</td>
                        </tr>
                    `).join("") || `
                        <tr><td colspan="7" class="empty">No matching jobs.</td></tr>
                    `}
                </tbody>
            </table>
        </div>
    `;
}

function phd(type) {
    const records = type === "cs" ? APP_DATA.phdCS : APP_DATA.phdManagement;
    const title = type === "cs" ? "PhD — Computer Science" : "PhD — Management";

    content.innerHTML = `
        <div class="section-title">
            <h2>${title}</h2>
            <span>Europe • QS Top 300 target</span>
        </div>

        <div class="card table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>University</th>
                        <th>Country</th>
                        <th>Position</th>
                        <th>Research Area</th>
                        <th>Funding</th>
                        <th>Deadline</th>
                    </tr>
                </thead>
                <tbody>
                    ${records.map(r => `
                        <tr>
                            <td><strong>${r[0]}</strong></td>
                            <td>${r[1]}</td>
                            <td>${r[2]}</td>
                            <td>${r[3]}</td>
                            <td>${badge(r[4])}</td>
                            <td>${r[5]}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

function placeholder(title, description) {
    content.innerHTML = `
        <div class="card">
            <h2>${title}</h2>
            <p style="color:var(--muted)">${description}</p>
            <div class="empty">Module ready for the next development phase.</div>
        </div>
    `;
}

function setPage(page) {
    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.toggle("active", item.dataset.page === page);
    });

    search.value = "";

    if (page === "dashboard") dashboard();
    else if (page === "jobs" || page === "india" || page === "remote") renderJobsModule(APP_DATA.jobs);`r`n    else if (page === "phd-cs" || page === "cs" || page === "phd") renderPhdCSModule(APP_DATA.phdCS);`r`n    else if (page === "phd-management" || page === "management" || page === "mgmt") renderPhdManagementModule(APP_DATA.phdManagement);
    else if (page === "phd-cs") phd("cs");
    else if (page === "phd-management") phd("management");
    else if (page === "applications") placeholder("Applications", "Track submitted, saved, rejected and active applications.");
    else if (page === "interviews") placeholder("Interviews", "Track interview rounds, dates, notes and follow-ups.");
    else if (page === "companies") placeholder("Companies", "Track target companies, watchlists and career pages.");
    else if (page === "universities-cs") placeholder("CS Universities", "Europe-wide QS Computer Science university universe.");
    else if (page === "universities-management") placeholder("Management Universities", "Europe-wide QS Business & Management university universe.");
    else if (page === "positions-cs") phd("cs");
    else if (page === "positions-management") phd("management");
    else if (page === "supervisors-cs") placeholder("CS Supervisors", "Track supervisors, research groups and contact history.");
    else if (page === "supervisors-management") placeholder("Management Supervisors", "Track supervisors, research groups and contact history.");
    else if (page === "calendar") placeholder("Calendar", "Deadlines, interviews, application milestones and reminders.");
    else if (page === "tasks") placeholder("Tasks", "Application documents, research tasks and follow-ups.");
    else if (page === "analytics") placeholder("Analytics", "Pipeline, applications, deadlines and academic coverage analytics.");
    else if (page === "settings") placeholder("Settings", "Data sources, ranking year, filters and application preferences.");
}

document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => setPage(item.dataset.page));
});

search.addEventListener("input", () => {
    const active = document.querySelector(".nav-item.active")?.dataset.page;
    if (active === "jobs" || active === "india" || active === "remote") {
        jobs(search.value);
    }
});

document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
});

document.getElementById("quickAdd").addEventListener("click", () => {
    modal.classList.remove("hidden");
});

document.getElementById("closeModal").addEventListener("click", () => {
    modal.classList.add("hidden");
});

modal.addEventListener("click", event => {
    if (event.target === modal) modal.classList.add("hidden");
});

document.querySelectorAll("[data-add]").forEach(button => {
    button.addEventListener("click", () => {
        alert(`${button.dataset.add.toUpperCase()} module will be connected in the next development phase.`);
        modal.classList.add("hidden");
    });
});

dashboard();



