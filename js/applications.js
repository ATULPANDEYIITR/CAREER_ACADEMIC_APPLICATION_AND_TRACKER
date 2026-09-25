function getApplications() {
    return JSON.parse(localStorage.getItem("career_tracker_applications") || "[]");
}

function saveApplications(data) {
    localStorage.setItem("career_tracker_applications", JSON.stringify(data));
}

function renderApplicationsModule() {
    const applications = getApplications();

    const applied = applications.filter(x => x.status === "APPLIED").length;
    const interviews = applications.filter(x => x.status === "INTERVIEW").length;
    const offers = applications.filter(x => x.status === "OFFER").length;
    const rejected = applications.filter(x => x.status === "REJECTED").length;

    document.getElementById("content").innerHTML = `
        <div class="page-header">
            <div>
                <h1>Applications & Interviews</h1>
                <p>Track applications, interviews, follow-ups and outcomes.</p>
            </div>
            <button class="primary-btn" onclick="showApplicationForm()">+ Add Application</button>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <span>APPLIED</span>
                <strong>${applied}</strong>
                <small>Active applications</small>
            </div>

            <div class="stat-card">
                <span>INTERVIEWS</span>
                <strong>${interviews}</strong>
                <small>Interview stage</small>
            </div>

            <div class="stat-card">
                <span>OFFERS</span>
                <strong>${offers}</strong>
                <small>Offers received</small>
            </div>

            <div class="stat-card">
                <span>REJECTED</span>
                <strong>${rejected}</strong>
                <small>Closed applications</small>
            </div>
        </div>

        <div class="panel">
            <div class="panel-header">
                <div>
                    <h2>Application Pipeline</h2>
                    <p>Jobs and academic opportunities can be tracked in one workflow.</p>
                </div>
            </div>

            <div class="filter-row">
                <input
                    id="applicationSearch"
                    class="search-input"
                    placeholder="Search company, university, role..."
                />

                <select id="applicationStatus" class="filter-select">
                    <option value="">All Statuses</option>
                    <option value="SAVED">Saved</option>
                    <option value="APPLIED">Applied</option>
                    <option value="SCREENING">Screening</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="WITHDRAWN">Withdrawn</option>
                </select>
            </div>

            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Organization</th>
                            <th>Role / Position</th>
                            <th>Type</th>
                            <th>Applied</th>
                            <th>Status</th>
                            <th>Next Action</th>
                        </tr>
                    </thead>

                    <tbody id="applicationsTable"></tbody>
                </table>
            </div>
        </div>
    `;

    function draw(list) {
        const tbody = document.getElementById("applicationsTable");

        if (!list.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        No applications found. Click "+ Add Application" to create one.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = list.map(item => `
            <tr>
                <td><strong>${item.organization || ""}</strong></td>
                <td>${item.role || ""}</td>
                <td>${item.type || ""}</td>
                <td>${item.appliedDate || "Not specified"}</td>
                <td>${badge(item.status || "SAVED")}</td>
                <td>${item.nextAction || "None"}</td>
            </tr>
        `).join("");
    }

    function applyFilters() {
        const search = document.getElementById("applicationSearch").value.toLowerCase();
        const status = document.getElementById("applicationStatus").value;

        const filtered = applications.filter(item => {
            const text = Object.values(item).join(" ").toLowerCase();

            return (
                (!search || text.includes(search)) &&
                (!status || item.status === status)
            );
        });

        draw(filtered);
    }

    document
        .getElementById("applicationSearch")
        .addEventListener("input", applyFilters);

    document
        .getElementById("applicationStatus")
        .addEventListener("change", applyFilters);

    draw(applications);
}

function showApplicationForm() {
    document.getElementById("modal").classList.add("show");

    document.getElementById("modalContent").innerHTML = `
        <h2>Add Application</h2>

        <div class="form-grid">
            <input id="applicationOrganization" placeholder="Company / University" />

            <input id="applicationRole" placeholder="Role / Position" />

            <select id="applicationType">
                <option value="JOB">JOB</option>
                <option value="PHD_CS">PHD_CS</option>
                <option value="PHD_MANAGEMENT">PHD_MANAGEMENT</option>
            </select>

            <input id="applicationDate" type="date" />

            <select id="applicationStatusInput">
                <option value="SAVED">SAVED</option>
                <option value="APPLIED">APPLIED</option>
                <option value="SCREENING">SCREENING</option>
                <option value="INTERVIEW">INTERVIEW</option>
                <option value="OFFER">OFFER</option>
                <option value="REJECTED">REJECTED</option>
                <option value="WITHDRAWN">WITHDRAWN</option>
            </select>

            <input id="applicationNextAction" placeholder="Next action" />

            <input id="applicationInterviewDate" type="date" />

            <input id="applicationNotes" placeholder="Notes" />
        </div>

        <div class="modal-actions">
            <button class="secondary-btn" onclick="closeModal()">Cancel</button>
            <button class="primary-btn" onclick="saveApplication()">Save Application</button>
        </div>
    `;
}

function saveApplication() {
    const item = {
        id: "APP-" + Date.now(),
        organization: document.getElementById("applicationOrganization").value.trim(),
        role: document.getElementById("applicationRole").value.trim(),
        type: document.getElementById("applicationType").value,
        appliedDate: document.getElementById("applicationDate").value,
        status: document.getElementById("applicationStatusInput").value,
        nextAction: document.getElementById("applicationNextAction").value.trim(),
        interviewDate: document.getElementById("applicationInterviewDate").value,
        notes: document.getElementById("applicationNotes").value.trim()
    };

    if (!item.organization || !item.role) {
        alert("Please enter the Company / University and Role / Position.");
        return;
    }

    const applications = getApplications();
    applications.push(item);
    saveApplications(applications);

    closeModal();
    renderApplicationsModule();
}

function renderInterviewsModule() {
    const applications = getApplications();

    const interviews = applications.filter(
        x => x.status === "INTERVIEW" || x.interviewDate
    );

    document.getElementById("content").innerHTML = `
        <div class="page-header">
            <div>
                <h1>Interviews</h1>
                <p>Track upcoming and completed interviews.</p>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <span>INTERVIEWS</span>
                <strong>${interviews.length}</strong>
                <small>Tracked interviews</small>
            </div>

            <div class="stat-card">
                <span>UPCOMING</span>
                <strong>${interviews.filter(x => x.interviewDate).length}</strong>
                <small>Scheduled interviews</small>
            </div>
        </div>

        <div class="panel">
            <div class="panel-header">
                <div>
                    <h2>Interview Schedule</h2>
                    <p>Interview records connected to your application pipeline.</p>
                </div>
            </div>

            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Organization</th>
                            <th>Role</th>
                            <th>Interview Date</th>
                            <th>Status</th>
                            <th>Notes</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${
                            interviews.length
                            ? interviews.map(item => `
                                <tr>
                                    <td><strong>${item.organization || ""}</strong></td>
                                    <td>${item.role || ""}</td>
                                    <td>${item.interviewDate || "Not scheduled"}</td>
                                    <td>${badge(item.status || "INTERVIEW")}</td>
                                    <td>${item.notes || ""}</td>
                                </tr>
                            `).join("")
                            : `
                                <tr>
                                    <td colspan="5" class="empty-state">
                                        No interviews scheduled.
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
