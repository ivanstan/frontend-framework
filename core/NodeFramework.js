module.exports = {
    resolveDependencies: function (array, key) {
        var sorted = [], resolved = [];

        function arrayFromKey(array, key) {
            var rval = [];
            for (var i in array) {
                rval.push(array[i][key]);
            }
            return rval;
        }

        function canResolve(library, resolved) {
            if (library.hasOwnProperty(key) && library[key].length > 0) {
                for (var i in library[key]) {
                    if (resolved.indexOf(library[key][i]) == -1) {
                        return false;
                    }
                }
            }
            return true;
        }

        while (array.length > 0) {
            for (var i in array) {
                if (canResolve(array[i], resolved)) {
                    sorted.push(array[i]);
                    array.splice(i, 1);
                    resolved = arrayFromKey(sorted, 'name');
                }
            }
        }

        return sorted;
    }
};