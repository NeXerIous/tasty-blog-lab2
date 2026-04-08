export default class ApiService {
    constructor(baseURL, apiKey = null) {
        this.baseURL = baseURL;
        this.apiKey = apiKey;
    }

    async get(endpoint, params = {}) {
        try {
            const queryParams = new URLSearchParams({
                ...params,
                ...(this.apiKey ? { api_key: this.apiKey } : {}),
            }).toString();

            const url = `${this.baseURL}${endpoint}${queryParams ? `?${queryParams}` : ''}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('GET request failed:', error);
            throw error;
        }
    }
}

