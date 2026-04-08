import { APP_CONFIG, APP_SETTINGS } from '../api/config.js';

export default class LocalStorageService {
    constructor() {
        this.storage = window.localStorage;
        this.initializeStorage();
    }

    initializeStorage() {
        if (!this.get(APP_CONFIG.storageKeys.settings)) {
            this.set(APP_CONFIG.storageKeys.settings, APP_SETTINGS, { persist: true });
        }
    }

    set(key, value, options = {}) {
        try {
            const item = {
                value,
                timestamp: Date.now(),
                persist: Boolean(options.persist),
            };

            this.storage.setItem(key, JSON.stringify(item));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    get(key, defaultValue = null, maxAge = null) {
        try {
            const item = this.storage.getItem(key);

            if (!item) {
                return defaultValue;
            }

            const parsedItem = JSON.parse(item);

            if (!parsedItem || typeof parsedItem !== 'object') {
                return defaultValue;
            }

            if (parsedItem.persist) {
                return parsedItem.value;
            }

            if (maxAge && Date.now() - parsedItem.timestamp > maxAge) {
                this.remove(key);
                return defaultValue;
            }

            return parsedItem.value;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    }

    remove(key) {
        try {
            this.storage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }

    getAllKeys() {
        return Object.keys(this.storage);
    }

    hasValidData(key, maxAge = null) {
        return this.get(key, null, maxAge) !== null;
    }

    clearExpired() {
        const cacheDuration = this.get(APP_CONFIG.storageKeys.settings, APP_SETTINGS).cacheDuration || APP_CONFIG.cacheDuration;

        Object.keys(this.storage).forEach((key) => {
            const item = this.storage.getItem(key);

            if (!item) {
                return;
            }

            try {
                const parsedItem = JSON.parse(item);

                if (parsedItem?.persist) {
                    return;
                }

                if (Date.now() - parsedItem.timestamp > cacheDuration) {
                    this.remove(key);
                }
            } catch (error) {
                this.remove(key);
            }
        });
    }

    getFavorites() {
        return this.get(APP_CONFIG.storageKeys.favorites, []);
    }

    saveFavorite(recipe) {
        const favorites = this.getFavorites();
        const alreadySaved = favorites.some((item) => item.id === recipe.id);

        if (alreadySaved) {
            return false;
        }

        favorites.unshift({
            ...recipe,
            savedAt: new Date().toISOString(),
        });

        this.set(APP_CONFIG.storageKeys.favorites, favorites, { persist: true });
        return true;
    }

    removeFavorite(recipeId) {
        const favorites = this.getFavorites().filter((item) => item.id !== recipeId);

        this.set(APP_CONFIG.storageKeys.favorites, favorites, { persist: true });
        return true;
    }

    isFavorite(recipeId) {
        return this.getFavorites().some((item) => item.id === recipeId);
    }
}

