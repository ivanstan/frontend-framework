/**
 * Sets the String type item to local storage.
 *
 * @param {String} name Save under this name.
 * @param {String} value Value to be saved.
 */
class StorageService {

    setItem(name, value) {
        window.localStorage.setItem(name, value);
    };

    /**
     * Get String type item from local storage.
     *
     * @param {String} name Name of item to fetch.
     * @param {String} def Default value to use if the item doesn't exist.
     * @returns {String}
     */
    getItem(name, def) {
        var value = window.localStorage.getItem(name);
        return value == null ? def : value;
    };

    /**
     * Set object data type in local storage
     *
     * @param {String} name Save under this name.
     * @param {Object} value Object to be saved.
     */
    setObject(name, value) {
        Storage.setItem(name, JSON.stringify(value));
    };

    /**
     * Get Object data type item from local storage.
     *
     * @param {String} name Name of item to fetch.
     * @param {String} def Default value to use if the item doesn't exist.
     * @returns {String}
     */
    getObject(name, def) {
        var value;

        try {
            value = JSON.parse(Storage.getItem(name, def));
        } catch (exception) {
            value = def;
        }

        return value;
    };
}