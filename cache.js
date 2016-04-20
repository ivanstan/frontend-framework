var localCache = {
    data: {},
    remove: function (url) {
        delete localCache.data[url];
    },
    exist: function (url) {
        return localCache.data.hasOwnProperty(url) && localCache.data[url] !== null;
    },
    get: function (url) {
        return localCache.data[url];
    },
    set: function (url, cachedData) {
        localCache.remove(url);
        localCache.data[url] = cachedData;
    }
};