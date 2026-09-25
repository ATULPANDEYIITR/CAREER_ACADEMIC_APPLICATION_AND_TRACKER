function renderPhdManagementModule(records = APP_DATA.phdManagement) {
    const data = Array.isArray(records) ? records : [];

    const total = data.length;
    const funded = data.filter(x => String(x.status || "").toUpperCase() === "FUNDED").length;
    const countries = new Set(data.map(x => x.country).filter(Boolean)).size;
    const target = APP_DATA.managementTarget || 300;

    document.getElementById("content").innerHTML = `
        <div class="page-header">
            <div>
                <h1>PhD — Management</h1>
                <p>European doctoral research positions across management, business, strategy, technology and related fields.</p>
            </div>
            <button class="primary-btn" onclick="showPhdManagementForm()">+ Add Position</button>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <span>QS TARGET</span>
                <strong>${target}</strong>
                <small>European universities</small>
            </div>
            <div class="stat-card">
                <span>POSITIONS</span>
                <strong>${total}</strong>
                <small>Tracked positions</small>
            </div>
            <div class="stat-card">
                <span>FUNDED</span>
                <strong>${funded}</strong>
                <small>Funded opportunities</small>
            </div>
            <div class="stat-card">
                <span>COUNTRIES</span>
                <strong>${countries}</strong>
                <small>European coverage</small>
            </div>
        </div>

        <div class="panel">
            <div class="panel-header">
                <div>
                    <h2>Management PhD Positions</h2>
                    <p>Focus areas include strategy, innovation, technology management, analytics, operations, procurement, AI and management.</p>
                </div>
            </div>

            <div class="filter-row">
                <input id="phdMgmtSearch" class="search-input" placeholder="Search university, country, area..." />

                <select id="phdMgmtArea" class="filter-select">
                    <option value="">All Areas</option>
                    <option>Strategy</option>
                    <option>Technology Management</option>
                    <option>Business Analytics</option>
                    <option>Digital Transformation</option>
                    <option>Operations</option>
                    <option>Innovation</option>
                    <option>Management Science</option>
                    <option>AI and Management</option>
                    <option>Supply Chain</option>
                    <option>Procurement</option>
                    <option>Entrepreneurship</option>
                    <option>Marketing</option>
                    <option>Finance</option>
                    <option>Accounting</option>
                    <option>Sustainability / ESG</option>
                </select>

                <select id="phdMgmtFunding" class="filter-select">
                    <option value="">All Funding</option>
                    <option value="FUNDED">Funded</option>
                    <option value="SELF_FUNDED">Self Funded</option>
                </select>
            </div>

            <div class="table-wrap">
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
                    <tbody id="phdMgmtTable"></tbody>
                </table>
            </div>
        </div>
    `;

    function draw(list) {
        const tbody = document.getElementById("phdMgmtTable");

        if (!list.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">No matching Management PhD positions found.</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = list.map(item => `
            <tr>
                <td><strong>${item.university || ""}</strong></td>
                <td>${item.country || ""}</td>
                <td>${item.position || ""}</td>
                <td>${item.area || ""}</td>
                <td>${badge(item.status || "UNKNOWN")}</td>
                <td>${item.deadline || "Not specified"}</td>
            </tr>
        `).join("");
    }

    function applyFilters() {
        const search = document.getElementById("phdMgmtSearch").value.toLowerCase();
        const area = document.getElementById("phdMgmtArea").value;
        const funding = document.getElementById("phdMgmtFunding").value;

        const filtered = data.filter(item => {
            const text = Object.values(item).join(" ").toLowerCase();

            return (
                (!search || text.includes(search)) &&
                (!area || item.area === area) &&
                (!funding || item.status === funding)
            );
        });

        draw(filtered);
    }

    document.getElementById("phdMgmtSearch").addEventListener("input", applyFilters);
    document.getElementById("phdMgmtArea").addEventListener("change", applyFilters);
    document.getElementById("phdMgmtFunding").addEventListener("change", applyFilters);

    draw(data);
}

function showPhdManagementForm() {
    document.getElementById("modal").classList.add("show");

    document.getElementById("modalContent").innerHTML = `
        <h2>Add Management PhD Position</h2>

        <div class="form-grid">
            <input id="mgmtUniversity" placeholder="University" />
            <input id="mgmtCountry" placeholder="Country" />
            <input id="mgmtPosition" placeholder="Position title" />
            <input id="mgmtArea" placeholder="Research area" />

            <select id="mgmtStatus">
                <option value="FUNDED">FUNDED</option>
                <option value="SELF_FUNDED">SELF_FUNDED</option>
            </select>

            <input id="mgmtDeadline" type="date" />
        </div>

        <div class="modal-actions">
            <button class="secondary-btn" onclick="closeModal()">Cancel</button>
            <button class="primary-btn" onclick="savePhdManagement()">Save Position</button>
        </div>
    `;
}

function savePhdManagement() {
    const item = {
        id: "MGMT-" + Date.now(),
        university: document.getElementById("mgmtUniversity").value.trim(),
        country: document.getElementById("mgmtCountry").value.trim(),
        position: document.getElementById("mgmtPosition").value.trim(),
        area: document.getElementById("mgmtArea").value.trim(),
        status: document.getElementById("mgmtStatus").value,
        deadline: document.getElementById("mgmtDeadline").value
    };

    if (!item.university || !item.country || !item.position || !item.area) {
        alert("Please complete University, Country, Position and Research Area.");
        return;
    }

    const stored = JSON.parse(
        localStorage.getItem("career_tracker_phd_management") || "[]"
    );

    stored.push(item);

    localStorage.setItem(
        "career_tracker_phd_management",
        JSON.stringify(stored)
    );

    APP_DATA.phdManagement = [...APP_DATA.phdManagement, item];

    closeModal();
    renderPhdManagementModule(APP_DATA.phdManagement);
}
