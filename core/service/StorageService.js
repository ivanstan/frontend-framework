/**
 * Sets the String type item to local storage.
 *
 * @param {String} name Save under this name.
 * @param {String} value Value to be saved.
 */
Storage.setItem = function(name, value) {
    window.localStorage.setItem(name, value);
};

/**
 * Get String type item from local storage.
 *
 * @param {String} name Name of item to fetch.
 * @param {String} def Default value to use if the item doesn't exist.
 * @returns {String}
 */
Storage.getItem = function(name, def) {
    var value = window.localStorage.getItem(name);
    return value == null ? def : value;
};

/**
 * Set object data type in local storage
 *
 * @param {String} name Save under this name.
 * @param {Object} value Object to be saved.
 */
Storage.setObject = function(name, value) {
    Storage.setItem(name, JSON.stringify(value));
};

/**
 * Get Object data type item from local storage.
 *
 * @param {String} name Name of item to fetch.
 * @param {String} def Default value to use if the item doesn't exist.
 * @returns {String}
 */
Storage.getObject = function(name, def) {
    var value;

    try {
        value = JSON.parse(Storage.getItem(name, def));
    } catch (exception) {
        value = def;
    }

    return value;
};
