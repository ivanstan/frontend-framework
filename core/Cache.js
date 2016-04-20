class Cache {

    constructor() {
        this.data = {};
    }

    remove(key) {
        delete this.data[key];
    }

    exist(key) {
        return this.data.hasOwnProperty(key) && this.data[key] !== null;
    }

    get(key) {
        return this.data[key];
    }

    set(key, cachedData) {
        this.remove(key);
        this.data[key] = cachedData;
    }
}