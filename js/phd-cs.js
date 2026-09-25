function renderPhdCSModule(records = APP_DATA.phdCS) {
    const data = Array.isArray(records) ? records : [];

    const total = data.length;
    const funded = data.filter(x => String(x.status || "").toUpperCase() === "FUNDED").length;
    const countries = new Set(data.map(x => x.country).filter(Boolean)).size;
    const target = APP_DATA.csTarget || 300;

    document.getElementById("content").innerHTML = `
        <div class="page-header">
            <div>
                <h1>PhD — Computer Science</h1>
                <p>European doctoral research positions, universities, funding and research areas.</p>
            </div>
            <button class="primary-btn" onclick="showPhdCSForm()">+ Add Position</button>
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
                    <h2>CS PhD Positions</h2>
                    <p>Focus areas include AI, ML, cybersecurity, quantum computing, data science and related fields.</p>
                </div>
            </div>

            <div class="filter-row">
                <input id="phdCsSearch" class="search-input" placeholder="Search university, country, area..." />
                <select id="phdCsArea" class="filter-select">
                    <option value="">All Areas</option>
                    <option>AI / ML</option>
                    <option>Cybersecurity</option>
                    <option>Quantum Computing</option>
                    <option>Data Science</option>
                    <option>Responsible AI</option>
                    <option>Distributed Systems</option>
                    <option>Software Engineering</option>
                    <option>Cloud Computing</option>
                    <option>NLP</option>
                    <option>Computer Vision</option>
                    <option>Robotics</option>
                </select>
                <select id="phdCsFunding" class="filter-select">
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
                    <tbody id="phdCsTable"></tbody>
                </table>
            </div>
        </div>
    `;

    function draw(list) {
        const tbody = document.getElementById("phdCsTable");

        if (!list.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">No matching PhD positions found.</td>
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
        const search = document.getElementById("phdCsSearch").value.toLowerCase();
        const area = document.getElementById("phdCsArea").value;
        const funding = document.getElementById("phdCsFunding").value;

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

    document.getElementById("phdCsSearch").addEventListener("input", applyFilters);
    document.getElementById("phdCsArea").addEventListener("change", applyFilters);
    document.getElementById("phdCsFunding").addEventListener("change", applyFilters);

    draw(data);
}

function showPhdCSForm() {
    document.getElementById("modal").classList.add("show");

    document.getElementById("modalContent").innerHTML = `
        <h2>Add CS PhD Position</h2>

        <div class="form-grid">
            <input id="csUniversity" placeholder="University" />
            <input id="csCountry" placeholder="Country" />
            <input id="csPosition" placeholder="Position title" />
            <input id="csArea" placeholder="Research area" />
            <select id="csStatus">
                <option value="FUNDED">FUNDED</option>
                <option value="SELF_FUNDED">SELF_FUNDED</option>
            </select>
            <input id="csDeadline" type="date" />
        </div>

        <div class="modal-actions">
            <button class="secondary-btn" onclick="closeModal()">Cancel</button>
            <button class="primary-btn" onclick="savePhdCS()">Save Position</button>
        </div>
    `;
}

function savePhdCS() {
    const item = {
        id: "CS-" + Date.now(),
        university: document.getElementById("csUniversity").value.trim(),
        country: document.getElementById("csCountry").value.trim(),
        position: document.getElementById("csPosition").value.trim(),
        area: document.getElementById("csArea").value.trim(),
        status: document.getElementById("csStatus").value,
        deadline: document.getElementById("csDeadline").value
    };

    if (!item.university || !item.country || !item.position || !item.area) {
        alert("Please complete University, Country, Position and Research Area.");
        return;
    }

    const stored = JSON.parse(localStorage.getItem("career_tracker_phd_cs") || "[]");
    stored.push(item);

    localStorage.setItem(
        "career_tracker_phd_cs",
        JSON.stringify(stored)
    );

    APP_DATA.phdCS = [...APP_DATA.phdCS, item];

    closeModal();
    renderPhdCSModule(APP_DATA.phdCS);
}
