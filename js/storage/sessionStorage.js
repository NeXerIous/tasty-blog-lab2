export default class SessionStorageService {
    constructor() {
        this.storage = window.sessionStorage;
    }

    set(key, value) {
        try {
            const item = {
                value,
                timestamp: Date.now(),
            };

            this.storage.setItem(key, JSON.stringify(item));
            return true;
        } catch (error) {
            console.error('Error saving to sessionStorage:', error);
            return false;
        }
    }

    get(key, defaultValue = null) {
        try {
            const item = this.storage.getItem(key);

            if (!item) {
                return defaultValue;
            }

            const parsedItem = JSON.parse(item);
            return parsedItem?.value ?? defaultValue;
        } catch (error) {
            console.error('Error reading from sessionStorage:', error);
            return defaultValue;
        }
    }

    remove(key) {
        try {
            this.storage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from sessionStorage:', error);
            return false;
        }
    }

    getAllKeys() {
        return Object.keys(this.storage);
    }

    clear() {
        try {
            this.storage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing sessionStorage:', error);
            return false;
        }
    }
}
