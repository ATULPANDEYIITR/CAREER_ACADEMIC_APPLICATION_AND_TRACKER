const API_BASE_URL = "http://127.0.0.1:8001/api";

async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    if (!response.ok) {
        throw new Error(
            `API request failed: ${response.status} ${response.statusText}`
        );
    }

    return response.json();
}

async function checkBackendConnection() {
    try {
        const result = await apiRequest("/health");
        console.log("Backend connected:", result);
        return true;
    } catch (error) {
        console.error("Backend connection failed:", error);
        return false;
    }
}

window.apiRequest = apiRequest;
window.checkBackendConnection = checkBackendConnection;
