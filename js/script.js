import ApiService from './api/apiService.js';
import { API_CONFIG, APP_CONFIG } from './api/config.js';
import { initComments } from './components/comments.js';
import { initCookingTimer } from './components/cooking-timer.js';
import { initRecipeTabs } from './components/recipe-tabs.js';
import LocalStorageService from './storage/localStorage.js';
import SessionStorageService from './storage/sessionStorage.js';
import {
    createElementFromData,
    formatDate,
    parseMealsResponse,
    truncateText,
} from './utils/dataParser.js';
import { getElement } from './utils/dom.js';

class APIIntegrationManager {
    constructor() {
        this.localStorage = new LocalStorageService();
        this.sessionStorage = new SessionStorageService();
        this.api = null;
        this.currentData = [];
        this.currentQuery = '';
        this.notificationTimeout = null;
        this.cachePrefix = 'tastyblog-cache-search:';
        this.sessionCachePrefix = 'tastyblog-session-search:';
        this.elements = this.getElements();
        this.init();
    }

    getElements() {
        return {
            searchForm: document.getElementById('search-form'),
            searchInput: document.getElementById('search-input'),
            refreshButton: document.getElementById('refresh-btn'),
            clearCacheButton: document.getElementById('clear-cache-btn'),
            loadingIndicator: document.getElementById('loading-indicator'),
            dataContainer: document.getElementById('data-container'),
            favoritesContainer: document.getElementById('favorites-container'),
            searchStatus: getElement('[data-search-status]'),
            searchMeta: getElement('[data-search-meta]'),
        };
    }

    async init() {
        if (!this.elements.searchForm || !this.elements.dataContainer || !this.elements.favoritesContainer) {
            return;
        }

        this.initializeAPI();
        this.setupEventListeners();
        this.setupConnectionListeners();
        this.localStorage.clearExpired();
        this.renderFavorites();
        await this.loadInitialData();
    }

    initializeAPI() {
        this.api = new ApiService(API_CONFIG.baseURL);
        this.logAsyncOperation('API initialized', API_CONFIG.baseURL);
    }

    setupEventListeners() {
        this.elements.searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleSearch();
        });

        this.elements.refreshButton.addEventListener('click', () => {
            this.refreshData();
        });

        this.elements.clearCacheButton.addEventListener('click', () => {
            this.clearCache();
        });
    }

    setupConnectionListeners() {
        window.addEventListener('online', () => {
            this.setStatus('Connection restored. Live requests are available again.', 'You can refresh the latest query or continue searching.', 'success');
            this.showNotification('Internet connection restored.', 'success');
        });

        window.addEventListener('offline', () => {
            this.setStatus('You are offline now. Cached results and saved recipes are still available.', 'The favorites panel remains available from localStorage.', 'warning');
            this.showNotification('Offline mode: saved recipes remain available.', 'warning');
        });
    }

    async loadInitialData() {
        const sessionQuery = this.sessionStorage.get(APP_CONFIG.storageKeys.lastSearchQuery, '');
        const localQuery = this.localStorage.get(APP_CONFIG.storageKeys.lastSuccessfulQuery, APP_CONFIG.defaultQuery);
        const initialQuery = sessionQuery || localQuery || APP_CONFIG.defaultQuery;

        this.currentQuery = initialQuery;
        this.elements.searchInput.value = initialQuery;

        const sessionResults = this.sessionStorage.get(this.getSessionCacheKey(initialQuery), []);

        if (sessionResults.length) {
            this.currentData = sessionResults;
            this.renderData(sessionResults);
            this.setStatus('Loaded the latest results from sessionStorage.', `Current query: ${initialQuery}`, 'success');
            this.logAsyncOperation('Loaded data from sessionStorage', initialQuery);
            return;
        }

        const localCacheKey = this.getCacheKey(initialQuery);
        const cachedLocalResults = this.localStorage.get(localCacheKey, [], APP_CONFIG.cacheDuration);

        if (cachedLocalResults.length) {
            this.currentData = cachedLocalResults;
            this.renderData(cachedLocalResults);
            this.setStatus('Loaded cached results from localStorage.', `Current query: ${initialQuery}`, 'success');
            this.logAsyncOperation('Loaded data from localStorage', initialQuery);
            return;
        }

        if (!navigator.onLine) {
            this.renderOfflineFallback();
            this.setStatus('You are offline and there is no cached search data yet.', 'Saved recipes in the sidebar are still available.', 'warning');
            return;
        }

        await this.fetchData({ query: initialQuery });
    }

    async handleSearch() {
        const query = this.elements.searchInput.value.trim();

        if (!query) {
            this.showError('Please enter a search query.');
            return;
        }

        this.currentQuery = query;
        this.sessionStorage.set(APP_CONFIG.storageKeys.lastSearchQuery, query);
        await this.fetchData({ query });
    }

    async refreshData() {
        const query = this.elements.searchInput.value.trim() || this.currentQuery || APP_CONFIG.defaultQuery;

        if (!query) {
            this.showError('Nothing to refresh yet. Enter a recipe name first.');
            return;
        }

        this.currentQuery = query;
        this.logAsyncOperation('Manual refresh requested', query);
        await this.fetchData({ query }, { forceRefresh: true });
    }

    async fetchData(params = {}, options = {}) {
        const normalizedQuery = this.normalizeQuery(params.query || this.currentQuery || APP_CONFIG.defaultQuery);
        const localCacheKey = this.getCacheKey(normalizedQuery);
        const useCache = !options.forceRefresh;

        this.showLoading(true);
        this.currentQuery = normalizedQuery;
        this.elements.searchInput.value = normalizedQuery;
        this.sessionStorage.set(APP_CONFIG.storageKeys.lastSearchQuery, normalizedQuery);

        try {
            if (useCache) {
                const sessionData = this.getSessionResults(normalizedQuery);

                if (sessionData.length && this.currentQuery === normalizedQuery) {
                    this.currentData = sessionData;
                    this.renderData(sessionData);
                    this.setStatus('Loaded results from sessionStorage.', `Current query: ${normalizedQuery}`, 'success');
                    this.logAsyncOperation('Session cache hit', normalizedQuery);
                    return;
                }

                const cachedData = this.localStorage.get(localCacheKey, [], APP_CONFIG.cacheDuration);

                if (cachedData.length) {
                    this.currentData = cachedData;
                    this.sessionStorage.set(this.getSessionCacheKey(normalizedQuery), cachedData);
                    this.renderData(cachedData);
                    this.setStatus('Loaded results from localStorage cache.', `Current query: ${normalizedQuery}`, 'success');
                    this.showNotification('Recipes loaded from cache.', 'success');
                    this.logAsyncOperation('Local cache hit', normalizedQuery);
                    return;
                }
            }

            if (!navigator.onLine) {
                throw new Error('offline');
            }

            this.logAsyncOperation('Fetching recipes from API', normalizedQuery);

            const response = await this.api.get(API_CONFIG.endpoints.search, { s: normalizedQuery });
            const recipes = parseMealsResponse(response).slice(0, APP_CONFIG.maxResults);

            if (!recipes.length) {
                this.currentData = [];
                this.renderData([]);
                this.setStatus('No recipes matched your request.', `Try a broader query such as "${APP_CONFIG.defaultQuery}".`, 'warning');
                this.showNotification('No recipes found for this query.', 'warning');
                this.localStorage.set(APP_CONFIG.storageKeys.lastSuccessfulQuery, normalizedQuery, { persist: true });
                this.sessionStorage.set(this.getSessionCacheKey(normalizedQuery), []);
                return;
            }

            this.currentData = recipes;
            this.sessionStorage.set(this.getSessionCacheKey(normalizedQuery), recipes);
            this.localStorage.set(localCacheKey, recipes);
            this.localStorage.set(APP_CONFIG.storageKeys.lastSuccessfulQuery, normalizedQuery, { persist: true });
            this.renderData(recipes);
            this.setStatus('Fresh data loaded from TheMealDB API.', `Current query: ${normalizedQuery}`, 'success');
            this.showNotification('Recipes loaded successfully.', 'success');
            this.logAsyncOperation('API response stored in cache', {
                query: normalizedQuery,
                results: recipes.length,
            });
        } catch (error) {
            this.handleAPIError(error);
        } finally {
            this.showLoading(false);
        }
    }

    getSessionResults(query) {
        const results = this.sessionStorage.get(this.getSessionCacheKey(query), []);
        return Array.isArray(results) ? results : [];
    }

    renderData(recipes) {
        this.renderFavorites();

        if (!Array.isArray(recipes) || !recipes.length) {
            this.elements.dataContainer.innerHTML = `
                <article class="recipe-search-card recipe-search-card--empty">
                    <h3>No recipes found</h3>
                    <p>Try another query, refresh the data, or use your saved recipes from the offline panel.</p>
                </article>
            `;
            return;
        }

        this.elements.dataContainer.innerHTML = '';
        recipes.forEach((recipe) => {
            const element = this.createRecipeElement(recipe);
            this.elements.dataContainer.appendChild(element);
        });
    }

    createRecipeElement(recipe) {
        const template = `
            <article class="recipe-search-card">
                <img class="recipe-search-card__image" src="{{image}}" alt="{{title}}">
                <div class="recipe-search-card__body">
                    <h3 class="recipe-search-card__title">{{title}}</h3>
                    <div class="recipe-search-card__meta">
                        <span class="recipe-search-card__pill">{{category}}</span>
                        <span class="recipe-search-card__pill">{{area}}</span>
                    </div>
                    <p class="recipe-search-card__text">{{description}}</p>
                    <p class="recipe-search-card__ingredients"><strong>Ingredients:</strong> {{ingredients}}</p>
                    <div class="recipe-search-card__actions">
                        <button type="button" class="btn--outline recipe-search-card__button" data-save-id="{{id}}">{{buttonText}}</button>
                    </div>
                </div>
            </article>
        `;

        const isSaved = this.localStorage.isFavorite(recipe.id);
        const element = createElementFromData(
            {
                id: recipe.id,
                title: recipe.title,
                image: recipe.image,
                category: recipe.category,
                area: recipe.area,
                description: truncateText(recipe.description, 180),
                ingredients: truncateText(recipe.ingredients.join(', '), 120),
                buttonText: isSaved ? 'Saved for Offline' : 'Save to Favorites',
            },
            template,
        );

        const saveButton = element.querySelector('[data-save-id]');

        if (isSaved) {
            saveButton.disabled = true;
        }

        saveButton.addEventListener('click', () => {
            this.saveFavorite(recipe.id);
        });

        return element;
    }

    async saveFavorite(recipeId) {
        let recipe = this.findRecipeById(recipeId);

        if (!recipe) {
            this.showError('Recipe details are not available yet.');
            return;
        }

        if (navigator.onLine) {
            try {
                this.logAsyncOperation('Refreshing recipe details before saving favorite', recipeId);
                const response = await this.api.get(API_CONFIG.endpoints.lookup, { i: recipeId });
                const [freshRecipe] = parseMealsResponse(response);

                if (freshRecipe) {
                    recipe = freshRecipe;
                }
            } catch (error) {
                this.logAsyncOperation('Lookup fallback used for favorite', error.message);
            }
        }

        const isSaved = this.localStorage.saveFavorite(recipe);

        if (!isSaved) {
            this.showNotification('This recipe is already saved.', 'warning');
            return;
        }

        this.renderData(this.currentData);
        this.renderFavorites();
        this.showNotification('Recipe saved for offline access.', 'success');
        this.setStatus('Saved recipe to localStorage.', `Saved item: ${recipe.title}`, 'success');
        this.logAsyncOperation('Favorite saved', recipe.title);
    }

    renderFavorites() {
        const favorites = this.localStorage.getFavorites();

        if (!favorites.length) {
            this.elements.favoritesContainer.innerHTML = `
                <article class="recipe-favorite-card recipe-favorite-card--empty">
                    <h4>No saved recipes yet</h4>
                    <p>Search for a meal and save it to build your offline recipe list.</p>
                </article>
            `;
            return;
        }

        this.elements.favoritesContainer.innerHTML = '';
        favorites.forEach((recipe) => {
            const element = this.createFavoriteElement(recipe);
            this.elements.favoritesContainer.appendChild(element);
        });
    }

    createFavoriteElement(recipe) {
        const template = `
            <article class="recipe-favorite-card">
                <img class="recipe-favorite-card__image" src="{{image}}" alt="{{title}}">
                <div class="recipe-favorite-card__body">
                    <h4 class="recipe-favorite-card__title">{{title}}</h4>
                    <div class="recipe-favorite-card__meta">
                        <span class="recipe-favorite-card__pill">{{category}}</span>
                        <span class="recipe-favorite-card__pill">{{area}}</span>
                    </div>
                    <p class="recipe-favorite-card__text">{{description}}</p>
                    <p class="recipe-favorite-card__ingredients"><strong>Saved:</strong> {{savedAt}}</p>
                    <div class="recipe-favorite-card__actions">
                        <button type="button" class="btn--outline recipe-favorite-card__button recipe-favorite-card__button--remove" data-remove-id="{{id}}">Remove</button>
                    </div>
                </div>
            </article>
        `;

        const element = createElementFromData(
            {
                id: recipe.id,
                title: recipe.title,
                image: recipe.image,
                category: recipe.category,
                area: recipe.area,
                description: truncateText(recipe.description, 120),
                savedAt: formatDate(recipe.savedAt),
            },
            template,
        );

        const removeButton = element.querySelector('[data-remove-id]');

        removeButton.addEventListener('click', () => {
            this.removeFavorite(recipe.id);
        });

        return element;
    }

    removeFavorite(recipeId) {
        this.localStorage.removeFavorite(recipeId);
        this.renderFavorites();
        this.renderData(this.currentData);
        this.showNotification('Recipe removed from saved list.', 'warning');
        this.setStatus('Saved recipe removed.', 'The offline list has been updated.', 'warning');
        this.logAsyncOperation('Favorite removed', recipeId);
    }

    findRecipeById(recipeId) {
        return this.currentData.find((item) => item.id === recipeId) || this.localStorage.getFavorites().find((item) => item.id === recipeId);
    }

    clearCache() {
        this.localStorage.getAllKeys().forEach((key) => {
            if (key.startsWith(this.cachePrefix)) {
                this.localStorage.remove(key);
            }
        });

        this.localStorage.remove(APP_CONFIG.storageKeys.lastSuccessfulQuery);
        this.sessionStorage.remove(APP_CONFIG.storageKeys.lastSearchQuery);
        this.sessionStorage.getAllKeys().forEach((key) => {
            if (key.startsWith(this.sessionCachePrefix)) {
                this.sessionStorage.remove(key);
            }
        });

        this.showNotification('Search cache cleared.', 'success');
        this.setStatus('Search cache was cleared.', 'Saved favorites and comments were left untouched.', 'success');
        this.logAsyncOperation('Cache cleared');
    }

    renderOfflineFallback() {
        this.elements.dataContainer.innerHTML = `
            <article class="recipe-search-card recipe-search-card--empty">
                <h3>Offline mode is active</h3>
                <p>Live search needs an internet connection, but your saved recipes in the sidebar are still available from localStorage.</p>
            </article>
        `;
    }

    handleAPIError(error) {
        console.error('API Error:', error);

        let errorMessage = 'Something went wrong while loading recipes.';
        let metaMessage = 'Try again in a moment or use your saved offline recipes.';

        if (error.message.includes('404')) {
            errorMessage = 'The requested endpoint was not found.';
        } else if (error.message.includes('429')) {
            errorMessage = 'The API request limit has been reached. Please try again later.';
        } else if (error.message.includes('401')) {
            errorMessage = 'Authorization failed while contacting the API.';
        } else if (error.message === 'offline' || !navigator.onLine) {
            errorMessage = 'No internet connection. Offline mode is active.';
            metaMessage = 'Saved recipes from localStorage remain available in the right panel.';
            this.renderOfflineFallback();
        }

        this.setStatus(errorMessage, metaMessage, 'error');
        this.showNotification(errorMessage, 'error');
        this.logAsyncOperation('API error', errorMessage);
    }

    showLoading(show = true) {
        this.elements.loadingIndicator.hidden = !show;
    }

    showError(message) {
        this.setStatus(message, 'Enter a valid query and try again.', 'error');
        this.showNotification(message, 'error');
    }

    setStatus(message, meta = '', type = 'info') {
        if (this.elements.searchStatus) {
            this.elements.searchStatus.textContent = message;
            this.elements.searchStatus.dataset.state = type;
        }

        if (this.elements.searchMeta) {
            this.elements.searchMeta.textContent = meta;
            this.elements.searchMeta.dataset.state = type;
        }
    }

    showNotification(message, type = 'success') {
        const existingNotification = document.querySelector('.recipe-finder-notification');

        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `recipe-finder-notification recipe-finder-notification--${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.classList.add('is-visible');
        });

        clearTimeout(this.notificationTimeout);
        this.notificationTimeout = window.setTimeout(() => {
            notification.classList.remove('is-visible');
            window.setTimeout(() => {
                notification.remove();
            }, 240);
        }, 2800);
    }

    getCacheKey(query) {
        return `${this.cachePrefix}${this.normalizeQuery(query)}`;
    }

    getSessionCacheKey(query) {
        return `${this.sessionCachePrefix}${this.normalizeQuery(query)}`;
    }

    normalizeQuery(query) {
        return String(query || '')
            .trim()
            .toLowerCase();
    }

    logAsyncOperation(action, payload = null) {
        if (payload === null) {
            console.log(`[TastyBlog API] ${action}`);
            return;
        }

        console.log(`[TastyBlog API] ${action}:`, payload);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initRecipeTabs();
    initComments();
    initCookingTimer();
    new APIIntegrationManager();
});
