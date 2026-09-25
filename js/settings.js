function getTrackerSettings() {
    const defaults = {
        rankingYear: "2026",
        jobsPerPage: 25,
        defaultJobLocation: "India",
        phdRegion: "Europe",
        autoSave: true
    };

    try {
        const saved = JSON.parse(
            localStorage.getItem("career_tracker_settings") || "{}"
        );

        return { ...defaults, ...saved };
    } catch {
        return defaults;
    }
}

function saveTrackerSettings(settings) {
    localStorage.setItem(
        "career_tracker_settings",
        JSON.stringify(settings)
    );
}

function renderSettingsModule() {
    const settings = getTrackerSettings();

    document.getElementById("content").innerHTML = `
        <div class="page-header">
            <div>
                <h1>Settings</h1>
                <p>Configure ranking coverage, job preferences and tracker behavior.</p>
            </div>
        </div>

        <div class="panel">
            <div class="panel-header">
                <div>
                    <h2>PhD Ranking Configuration</h2>
                    <p>Configure the ranking year and university coverage targets.</p>
                </div>
            </div>

            <div class="form-grid settings-grid">
                <label>
                    QS Ranking Year
                    <select id="settingRankingYear">
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                    </select>
                </label>

                <label>
                    CS Target Universities
                    <input id="settingCsTarget" type="number" min="1" value="${APP_DATA.csTarget || 300}">
                </label>

                <label>
                    Management Target Universities
                    <input id="settingManagementTarget" type="number" min="1" value="${APP_DATA.managementTarget || 300}">
                </label>
            </div>
        </div>

        <div class="panel">
            <div class="panel-header">
                <div>
                    <h2>Job Search Preferences</h2>
                    <p>Default preferences for India-focused job tracking.</p>
                </div>
            </div>

            <div class="form-grid settings-grid">
                <label>
                    Default Job Location
                    <select id="settingJobLocation">
                        <option value="India">India</option>
                        <option value="Remote India">Remote India</option>
                        <option value="Any India Location">Any India Location</option>
                    </select>
                </label>

                <label>
                    Jobs Per Page
                    <select id="settingJobsPerPage">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </label>
            </div>
        </div>

        <div class="panel">
            <div class="panel-header">
                <div>
                    <h2>System Preferences</h2>
                    <p>Control local tracker behavior.</p>
                </div>
            </div>

            <div class="form-grid settings-grid">
                <label>
                    PhD Region
                    <select id="settingPhdRegion">
                        <option value="Europe">Europe</option>
                        <option value="European Union">European Union</option>
                    </select>
                </label>

                <label>
                    Auto Save
                    <select id="settingAutoSave">
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                    </select>
                </label>
            </div>

            <div class="modal-actions">
                <button class="primary-btn" id="saveSettingsButton">
                    Save Settings
                </button>
            </div>

            <div id="settingsMessage"></div>
        </div>

        <div class="panel">
            <div class="panel-header">
                <div>
                    <h2>Data Management</h2>
                    <p>Export your tracker data as a JSON file.</p>
                </div>
            </div>

            <div class="modal-actions">
                <button class="secondary-btn" id="exportJsonButton">
                    Export JSON
                </button>
            </div>

            <div id="exportMessage"></div>
        </div>
    `;

    document.getElementById("settingRankingYear").value = settings.rankingYear;
    document.getElementById("settingJobsPerPage").value = String(settings.jobsPerPage);
    document.getElementById("settingJobLocation").value = settings.defaultJobLocation;
    document.getElementById("settingPhdRegion").value = settings.phdRegion;
    document.getElementById("settingAutoSave").value = String(settings.autoSave);

    document.getElementById("saveSettingsButton").addEventListener(
        "click",
        saveSettings
    );

    document.getElementById("exportJsonButton").addEventListener(
        "click",
        exportTrackerData
    );
}

function saveSettings() {
    const settings = {
        rankingYear: document.getElementById("settingRankingYear").value,
        jobsPerPage: Number(
            document.getElementById("settingJobsPerPage").value
        ),
        defaultJobLocation:
            document.getElementById("settingJobLocation").value,
        phdRegion:
            document.getElementById("settingPhdRegion").value,
        autoSave:
            document.getElementById("settingAutoSave").value === "true"
    };

    const csTarget =
        Number(document.getElementById("settingCsTarget").value) || 300;

    const managementTarget =
        Number(document.getElementById("settingManagementTarget").value) || 300;

    saveTrackerSettings(settings);

    localStorage.setItem(
        "career_tracker_cs_target",
        String(csTarget)
    );

    localStorage.setItem(
        "career_tracker_management_target",
        String(managementTarget)
    );

    APP_DATA.csTarget = csTarget;
    APP_DATA.managementTarget = managementTarget;

    const message = document.getElementById("settingsMessage");

    if (message) {
        message.innerHTML = `
            <div class="settings-success">
                Settings saved successfully.
            </div>
        `;
    }
}

function exportTrackerData() {
    const data = {
        exportedAt: new Date().toISOString(),
        jobs: Array.isArray(APP_DATA.jobs) ? APP_DATA.jobs : [],
        phdCS: Array.isArray(APP_DATA.phdCS) ? APP_DATA.phdCS : [],
        phdManagement: Array.isArray(APP_DATA.phdManagement)
            ? APP_DATA.phdManagement
            : [],
        applications:
            typeof getApplications === "function"
                ? getApplications()
                : [],
        companies:
            typeof getCompanies === "function"
                ? getCompanies()
                : [],
        tasks:
            typeof getTrackerTasks === "function"
                ? getTrackerTasks()
                : [],
        settings: getTrackerSettings()
    };

    try {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], {
            type: "application/json"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download =
            "career-academic-tracker-" +
            new Date().toISOString().slice(0, 10) +
            ".json";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);

        const message = document.getElementById("exportMessage");

        if (message) {
            message.innerHTML = `
                <div class="settings-success">
                    JSON export created successfully.
                </div>
            `;
        }
    } catch (error) {
        alert("JSON export failed: " + error.message);
    }
}

function clearTrackerData() {
    if (!confirm("Clear locally stored tracker data?")) {
        return;
    }

    localStorage.removeItem("career_tracker_applications");
    localStorage.removeItem("career_tracker_companies");
    localStorage.removeItem("career_tracker_tasks");
    localStorage.removeItem("career_tracker_settings");
    localStorage.removeItem("career_tracker_phd_cs");
    localStorage.removeItem("career_tracker_phd_management");
    localStorage.removeItem("career_tracker_cs_target");
    localStorage.removeItem("career_tracker_management_target");

    renderSettingsModule();
}
