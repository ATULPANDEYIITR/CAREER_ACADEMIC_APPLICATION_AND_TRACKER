function renderJobsModule(records = APP_DATA.jobs) {
    const container = document.getElementById("content");

    const counts = {
        all: records.length,
        onsite: records.filter(j => j.classification === "ONSITE").length,
        hybrid: records.filter(j => j.classification === "HYBRID").length,
        remoteIndia: records.filter(j => j.classification === "REMOTE_INDIA").length
    };

    container.innerHTML = `
        <div class="section-title">
            <div>
                <h2>Jobs Intelligence</h2>
                <span>India-focused opportunities and explicitly eligible Remote India roles</span>
            </div>
            <button class="primary-button" onclick="showJobForm()">+ ADD JOB</button>
        </div>

        <div class="dashboard-grid">
            <div class="card">
                <div class="metric-label">Total Jobs</div>
                <div class="metric-value">${counts.all}</div>
                <div class="metric-sub">Tracked records</div>
            </div>

            <div class="card">
                <div class="metric-label">Onsite</div>
                <div class="metric-value">${counts.onsite}</div>
                <div class="metric-sub">India locations</div>
            </div>

            <div class="card">
                <div class="metric-label">Hybrid</div>
                <div class="metric-value">${counts.hybrid}</div>
                <div class="metric-sub">India locations</div>
            </div>

            <div class="card">
                <div class="metric-label">Remote India</div>
                <div class="metric-value">${counts.remoteIndia}</div>
                <div class="metric-sub">Explicit India eligibility</div>
            </div>
        </div>

        <div class="section card">
            <div class="top-actions" style="margin-bottom:15px">
                <input id="jobFilter" type="search"
                    placeholder="Filter by role, company, category, location..."
                    style="flex:1;width:auto">
                <select id="jobModeFilter"
                    style="padding:11px;border:1px solid var(--border);border-radius:8px;background:var(--panel);color:var(--text)">
                    <option value="">All modes</option>
                    <option value="ONSITE">Onsite</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="REMOTE_INDIA">Remote India</option>
                </select>
            </div>

            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Role</th>
                            <th>Company</th>
                            <th>Location</th>
                            <th>Mode</th>
                            <th>Category</th>
                            <th>Source</th>
                            <th>Deadline</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="jobsTableBody"></tbody>
                </table>
            </div>
        </div>
    `;

    const filterInput = document.getElementById("jobFilter");
    const modeFilter = document.getElementById("jobModeFilter");

    function updateTable() {
        const query = filterInput.value.toLowerCase().trim();
        const mode = modeFilter.value;

        const filtered = records.filter(job => {
            const searchable = Object.values(job).join(" ").toLowerCase();
            return searchable.includes(query) &&
                   (!mode || job.classification === mode);
        });

        document.getElementById("jobsTableBody").innerHTML =
            filtered.map(job => `
                <tr>
                    <td>${job.id}</td>
                    <td><strong>${job.title}</strong></td>
                    <td>${job.company}</td>
                    <td>${job.location}</td>
                    <td>${badge(job.classification)}</td>
                    <td>${job.category}</td>
                    <td>${job.source}</td>
                    <td>${job.deadline}</td>
                    <td>${badge(job.status)}</td>
                </tr>
            `).join("") ||
            `<tr><td colspan="9"><div class="empty">No matching jobs found.</div></td></tr>`;
    }

    filterInput.addEventListener("input", updateTable);
    modeFilter.addEventListener("change", updateTable);

    updateTable();
}

function showJobForm() {
    const modal = document.getElementById("modal");

    modal.querySelector(".modal-card").innerHTML = `
        <button class="modal-close" onclick="document.getElementById('modal').classList.add('hidden')">×</button>
        <h2>Add Job</h2>

        <div style="display:grid;gap:10px">
            <input id="newJobTitle" placeholder="Job title">
            <input id="newJobCompany" placeholder="Company">
            <input id="newJobLocation" placeholder="Location">
            <input id="newJobCategory" placeholder="Category">

            <select id="newJobMode">
                <option value="ONSITE">ONSITE</option>
                <option value="HYBRID">HYBRID</option>
                <option value="REMOTE_INDIA">REMOTE_INDIA</option>
            </select>

            <input id="newJobDeadline" type="date">

            <button class="primary-button" onclick="saveNewJob()">SAVE JOB</button>
        </div>
    `;

    modal.classList.remove("hidden");
}

function saveNewJob() {
    const title = document.getElementById("newJobTitle").value.trim();
    const company = document.getElementById("newJobCompany").value.trim();
    const location = document.getElementById("newJobLocation").value.trim();
    const category = document.getElementById("newJobCategory").value.trim();
    const mode = document.getElementById("newJobMode").value;
    const deadline = document.getElementById("newJobDeadline").value;

    if (!title || !company || !location) {
        alert("Job title, company and location are required.");
        return;
    }

    const job = {
        id: `LOCAL-${Date.now()}`,
        title,
        company,
        location,
        country: "India",
        mode,
        classification: mode,
        category: category || "Uncategorized",
        source: "Manual Entry",
        sourceType: "MANUAL",
        url: "",
        deadline: deadline || "",
        status: "NEW"
    };

    APP_DATA.jobs.push(job);

    localStorage.setItem(
        "career_tracker_jobs",
        JSON.stringify(APP_DATA.jobs)
    );

    document.getElementById("modal").classList.add("hidden");
    renderJobsModule();
}

const storedJobs = localStorage.getItem("career_tracker_jobs");

if (storedJobs) {
    try {
        APP_DATA.jobs = JSON.parse(storedJobs);
    } catch {
        console.warn("Saved job data could not be loaded.");
    }
}
