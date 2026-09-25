function renderAnalyticsModule() {
    const jobs = Array.isArray(APP_DATA.jobs) ? APP_DATA.jobs : [];
    const cs = Array.isArray(APP_DATA.phdCS) ? APP_DATA.phdCS : [];
    const mgmt = Array.isArray(APP_DATA.phdManagement) ? APP_DATA.phdManagement : [];

    const applications = typeof getApplications === "function"
        ? getApplications()
        : [];

    const tasks = typeof getTrackerTasks === "function"
        ? getTrackerTasks()
        : [];

    const companies = typeof getCompanies === "function"
        ? getCompanies()
        : [];

    const jobByCategory = {};

    jobs.forEach(job => {
        const category = job.category || "Other";
        jobByCategory[category] = (jobByCategory[category] || 0) + 1;
    });

    const csByArea = {};
    cs.forEach(item => {
        const area = item.area || "Other";
        csByArea[area] = (csByArea[area] || 0) + 1;
    });

    const mgmtByArea = {};
    mgmt.forEach(item => {
        const area = item.area || "Other";
        mgmtByArea[area] = (mgmtByArea[area] || 0) + 1;
    });

    const applicationStatus = {};

    applications.forEach(item => {
        const status = item.status || "SAVED";
        applicationStatus[status] = (applicationStatus[status] || 0) + 1;
    });

    const completedTasks = tasks.filter(x => x.status === "DONE").length;

    const totalTracked =
        jobs.length +
        cs.length +
        mgmt.length +
        applications.length +
        companies.length;

    document.getElementById("content").innerHTML = `
        <div class="page-header">
            <div>
                <h1>Analytics</h1>
                <p>Overview of your jobs, applications, PhD research and activity.</p>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <span>JOBS</span>
                <strong>${jobs.length}</strong>
                <small>Tracked opportunities</small>
            </div>

            <div class="stat-card">
                <span>PHD POSITIONS</span>
                <strong>${cs.length + mgmt.length}</strong>
                <small>CS + Management</small>
            </div>

            <div class="stat-card">
                <span>APPLICATIONS</span>
                <strong>${applications.length}</strong>
                <small>Total applications</small>
            </div>

            <div class="stat-card">
                <span>TASK COMPLETION</span>
                <strong>${tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0}%</strong>
                <small>${completedTasks} of ${tasks.length} completed</small>
            </div>
        </div>

        <div class="analytics-grid">

            <div class="panel">
                <div class="panel-header">
                    <div>
                        <h2>Jobs by Category</h2>
                        <p>Distribution of tracked job opportunities.</p>
                    </div>
                </div>

                <div class="analytics-list">
                    ${
                        Object.keys(jobByCategory).length
                        ? Object.entries(jobByCategory).map(([key, value]) => `
                            <div class="analytics-row">
                                <span>${key}</span>
                                <strong>${value}</strong>
                            </div>
                        `).join("")
                        : `<div class="empty-state">No job data available.</div>`
                    }
                </div>
            </div>

            <div class="panel">
                <div class="panel-header">
                    <div>
                        <h2>Application Pipeline</h2>
                        <p>Current application distribution.</p>
                    </div>
                </div>

                <div class="analytics-list">
                    ${
                        Object.keys(applicationStatus).length
                        ? Object.entries(applicationStatus).map(([key, value]) => `
                            <div class="analytics-row">
                                <span>${key}</span>
                                <strong>${value}</strong>
                            </div>
                        `).join("")
                        : `<div class="empty-state">No applications yet.</div>`
                    }
                </div>
            </div>

            <div class="panel">
                <div class="panel-header">
                    <div>
                        <h2>PhD — CS Research Areas</h2>
                        <p>Tracked Computer Science research positions.</p>
                    </div>
                </div>

                <div class="analytics-list">
                    ${
                        Object.keys(csByArea).length
                        ? Object.entries(csByArea).map(([key, value]) => `
                            <div class="analytics-row">
                                <span>${key}</span>
                                <strong>${value}</strong>
                            </div>
                        `).join("")
                        : `<div class="empty-state">No CS PhD data available.</div>`
                    }
                </div>
            </div>

            <div class="panel">
                <div class="panel-header">
                    <div>
                        <h2>PhD — Management Areas</h2>
                        <p>Tracked Management research positions.</p>
                    </div>
                </div>

                <div class="analytics-list">
                    ${
                        Object.keys(mgmtByArea).length
                        ? Object.entries(mgmtByArea).map(([key, value]) => `
                            <div class="analytics-row">
                                <span>${key}</span>
                                <strong>${value}</strong>
                            </div>
                        `).join("")
                        : `<div class="empty-state">No Management PhD data available.</div>`
                    }
                </div>
            </div>

        </div>

        <div class="panel">
            <div class="panel-header">
                <div>
                    <h2>Command Center Coverage</h2>
                    <p>Current records stored in the local tracker.</p>
                </div>
            </div>

            <div class="analytics-summary">
                <div>
                    <span>Total tracked records</span>
                    <strong>${totalTracked}</strong>
                </div>

                <div>
                    <span>Companies</span>
                    <strong>${companies.length}</strong>
                </div>

                <div>
                    <span>Tasks</span>
                    <strong>${tasks.length}</strong>
                </div>

                <div>
                    <span>Completed tasks</span>
                    <strong>${completedTasks}</strong>
                </div>
            </div>
        </div>
    `;
}
