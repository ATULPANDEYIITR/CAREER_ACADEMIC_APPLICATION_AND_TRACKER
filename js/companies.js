function getCompanies() {
    return JSON.parse(localStorage.getItem("career_tracker_companies") || "[]");
}

function saveCompanies(data) {
    localStorage.setItem("career_tracker_companies", JSON.stringify(data));
}

function renderCompaniesModule() {
    const companies = getCompanies();

    const total = companies.length;
    const watched = companies.filter(x => x.watchlist === true).length;
    const hiring = companies.filter(x => x.hiring === true).length;

    document.getElementById("content").innerHTML = `
        <div class="page-header">
            <div>
                <h1>Companies</h1>
                <p>Track target employers, career pages, hiring activity and watchlists.</p>
            </div>
            <button class="primary-btn" onclick="showCompanyForm()">+ Add Company</button>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <span>COMPANIES</span>
                <strong>${total}</strong>
                <small>Tracked organizations</small>
            </div>

            <div class="stat-card">
                <span>WATCHLIST</span>
                <strong>${watched}</strong>
                <small>Priority companies</small>
            </div>

            <div class="stat-card">
                <span>HIRING</span>
                <strong>${hiring}</strong>
                <small>Currently monitored</small>
            </div>

            <div class="stat-card">
                <span>TARGETS</span>
                <strong>${companies.filter(x => x.target === true).length}</strong>
                <small>Target employers</small>
            </div>
        </div>

        <div class="panel">
            <div class="panel-header">
                <div>
                    <h2>Company Watchlist</h2>
                    <p>Maintain a focused list of employers and organizations.</p>
                </div>
            </div>

            <div class="filter-row">
                <input
                    id="companySearch"
                    class="search-input"
                    placeholder="Search company, sector, location..."
                />

                <select id="companyWatchlist" class="filter-select">
                    <option value="">All Companies</option>
                    <option value="WATCHLIST">Watchlist</option>
                    <option value="TARGET">Target Employers</option>
                    <option value="HIRING">Hiring</option>
                </select>
            </div>

            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Sector</th>
                            <th>Location</th>
                            <th>Careers</th>
                            <th>Watchlist</th>
                            <th>Hiring</th>
                        </tr>
                    </thead>

                    <tbody id="companiesTable"></tbody>
                </table>
            </div>
        </div>
    `;

    function draw(list) {
        const tbody = document.getElementById("companiesTable");

        if (!list.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        No companies found. Click "+ Add Company" to add one.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = list.map(item => `
            <tr>
                <td><strong>${item.name || ""}</strong></td>
                <td>${item.sector || ""}</td>
                <td>${item.location || ""}</td>
                <td>
                    ${
                        item.careers
                        ? `<a href="${item.careers}" target="_blank" rel="noopener noreferrer">Career Page</a>`
                        : "Not added"
                    }
                </td>
                <td>${item.watchlist ? badge("WATCHLIST") : badge("STANDARD")}</td>
                <td>${item.hiring ? badge("HIRING") : badge("MONITOR")}</td>
            </tr>
        `).join("");
    }

    function applyFilters() {
        const search = document.getElementById("companySearch").value.toLowerCase();
        const filter = document.getElementById("companyWatchlist").value;

        const filtered = companies.filter(item => {
            const text = Object.values(item).join(" ").toLowerCase();

            const matchesSearch =
                !search || text.includes(search);

            const matchesFilter =
                !filter ||
                (filter === "WATCHLIST" && item.watchlist === true) ||
                (filter === "TARGET" && item.target === true) ||
                (filter === "HIRING" && item.hiring === true);

            return matchesSearch && matchesFilter;
        });

        draw(filtered);
    }

    document
        .getElementById("companySearch")
        .addEventListener("input", applyFilters);

    document
        .getElementById("companyWatchlist")
        .addEventListener("change", applyFilters);

    draw(companies);
}

function showCompanyForm() {
    document.getElementById("modal").classList.add("show");

    document.getElementById("modalContent").innerHTML = `
        <h2>Add Company</h2>

        <div class="form-grid">
            <input id="companyName" placeholder="Company name" />

            <input id="companySector" placeholder="Sector" />

            <input id="companyLocation" placeholder="Location" />

            <input id="companyCareers" placeholder="Official careers URL" />

            <select id="companyWatch">
                <option value="false">Standard</option>
                <option value="true">Watchlist</option>
            </select>

            <select id="companyHiring">
                <option value="false">Not confirmed hiring</option>
                <option value="true">Hiring</option>
            </select>

            <select id="companyTarget">
                <option value="false">Regular employer</option>
                <option value="true">Target employer</option>
            </select>

            <input id="companyNotes" placeholder="Notes" />
        </div>

        <div class="modal-actions">
            <button class="secondary-btn" onclick="closeModal()">Cancel</button>
            <button class="primary-btn" onclick="saveCompany()">Save Company</button>
        </div>
    `;
}

function saveCompany() {
    const item = {
        id: "COMP-" + Date.now(),
        name: document.getElementById("companyName").value.trim(),
        sector: document.getElementById("companySector").value.trim(),
        location: document.getElementById("companyLocation").value.trim(),
        careers: document.getElementById("companyCareers").value.trim(),
        watchlist: document.getElementById("companyWatch").value === "true",
        hiring: document.getElementById("companyHiring").value === "true",
        target: document.getElementById("companyTarget").value === "true",
        notes: document.getElementById("companyNotes").value.trim()
    };

    if (!item.name) {
        alert("Please enter the company name.");
        return;
    }

    const companies = getCompanies();

    companies.push(item);

    saveCompanies(companies);

    closeModal();
    renderCompaniesModule();
}
