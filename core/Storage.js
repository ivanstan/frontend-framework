Storage.setObject = function(key, value) {
    Storage.setItem(key, JSON.stringify(value));
};

Storage.getObject = function(key, def) {
    var value;

    try {
        value = JSON.parse(Storage.getItem(key, def));
    } catch (exception) {
        value = def;
    }

    return value;
};

Storage.setItem = function(name, value) {
    window.localStorage.setItem(name, value);
};

Storage.getItem = function(name, def) {
    var value = window.localStorage.getItem(name);
    return value == null ? def : value;
};
