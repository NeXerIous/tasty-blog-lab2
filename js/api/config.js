export const API_CONFIG = {
    baseURL: 'https://www.themealdb.com/api/json/v1/1',
    endpoints: {
        search: '/search.php',
        lookup: '/lookup.php',
    },
};

export const APP_CONFIG = {
    defaultQuery: 'chicken',
    cacheDuration: 60 * 60 * 1000,
    maxResults: 6,
    storageKeys: {
        settings: 'tastyblog-app-settings',
        favorites: 'tastyblog-saved-recipes',
        lastSuccessfulQuery: 'tastyblog-last-successful-query',
        lastSearchQuery: 'tastyblog-last-search-query',
        lastSearchResults: 'tastyblog-last-search-results',
    },
};

export const APP_SETTINGS = {
    theme: 'light',
    language: 'en',
    cacheDuration: APP_CONFIG.cacheDuration,
};

