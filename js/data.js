const APP_DATA = {
    jobs: [
        {
            title: "Product Operations Manager",
            company: "Technology Company",
            location: "Bengaluru, India",
            mode: "HYBRID",
            category: "Product Management",
            source: "Company Careers",
            deadline: "2026-10-08"
        },
        {
            title: "Project Manager — AI Programs",
            company: "Enterprise Technology",
            location: "Mumbai, India",
            mode: "ONSITE",
            category: "Project Management",
            source: "LinkedIn",
            deadline: "2026-10-02"
        },
        {
            title: "Business Analyst — Digital Transformation",
            company: "Consulting Firm",
            location: "India",
            mode: "REMOTE_INDIA",
            category: "Business Analysis",
            source: "Naukri",
            deadline: "2026-10-14"
        },
        {
            title: "AI Data Operations Specialist",
            company: "AI Company",
            location: "India",
            mode: "REMOTE_INDIA",
            category: "Data Annotation / AI Data",
            source: "Company Careers",
            deadline: "2026-10-11"
        },
        {
            title: "AI Adoption & Enablement Manager",
            company: "Global Technology Company",
            location: "Pune, India",
            mode: "HYBRID",
            category: "AI / AI Operations",
            source: "Indeed",
            deadline: "2026-10-19"
        }
    ],

    phdCS: [
        ["ETH Zurich", "Switzerland", "Doctoral Researcher — AI / Machine Learning", "AI / ML", "FUNDED", "2026-11-15"],
        ["Technical University of Munich", "Germany", "PhD Position — Cybersecurity", "Cybersecurity", "FUNDED", "2026-10-30"],
        ["KU Leuven", "Belgium", "PhD Researcher — Responsible AI", "Responsible AI", "FUNDED", "2026-11-20"],
        ["University of Amsterdam", "Netherlands", "PhD Candidate — Distributed Systems", "Distributed Systems", "FUNDED", "2026-12-01"]
    ],

    phdManagement: [
        ["London Business School", "UK", "PhD — Strategy and Innovation", "Strategy", "FUNDED", "2026-12-05"],
        ["INSEAD", "France", "PhD — Technology and Management", "Technology Management", "FUNDED", "2026-11-28"],
        ["Erasmus University Rotterdam", "Netherlands", "PhD — Business Analytics", "Business Analytics", "FUNDED", "2026-12-10"],
        ["University of St. Gallen", "Switzerland", "PhD — Digital Transformation", "Digital Transformation", "FUNDED", "2026-11-18"]
    ],

    applications: 3,
    tasks: 4,
    csTarget: 300,
    managementTarget: 300
};

try {
    const savedCsTarget = localStorage.getItem("career_tracker_cs_target");
    const savedManagementTarget = localStorage.getItem("career_tracker_management_target");

    if (savedCsTarget) {
        APP_DATA.csTarget = Number(savedCsTarget);
    }

    if (savedManagementTarget) {
        APP_DATA.managementTarget = Number(savedManagementTarget);
    }
} catch {
}
