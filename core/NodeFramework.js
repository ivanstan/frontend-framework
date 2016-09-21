module.exports = {

    setConfig: function (config) {
        this.config = config;
        return this;
    },

    getResources() {
        var libraries = this.resolveDependencies('dependencies');

        var fileIndex,
            file;

        var remoteInternalStylesheet = [],
            remoteExternalStylesheet = [],
            localInternalStylesheet = [],
            localExternalStylesheet = [];

        var remoteInternalJavascript = [],
            remoteExternalJavascript = [],
            localInternalJavascript = [],
            localExternalJavascript = [];

        var localJavascript = [],
            localStylesheet = [],
            remoteStylesheet = [],
            remoteJavascript = [];

        for (var libraryIndex in libraries) {
            var library = libraries[libraryIndex];
            var pack = typeof libraries[libraryIndex]['package'] != 'undefined' ? libraries[libraryIndex]['package'] : true;

            if(library.hasOwnProperty('active') && !library.active) continue;

            if (library.hasOwnProperty('stylesheet')) {
                for (fileIndex in library.stylesheet) {
                    file = library.stylesheet[fileIndex];

                    if (file.indexOf('//') == -1) {
                        if (pack) {
                            localInternalStylesheet.push(file);
                        } else {
                            localInternalStylesheet.push(file);
                        }
                        localStylesheet.push(file);
                    } else {
                        if (pack) {
                            remoteInternalStylesheet.push(file);
                        } else {
                            remoteExternalStylesheet.push(file);
                        }
                        remoteStylesheet.push(file);
                    }
                }
            }

            if (library.hasOwnProperty('javascript')) {
                for (fileIndex in library.javascript) {
                    file = library.javascript[fileIndex];

                    if (file.indexOf('//') == -1) {
                        if (pack) {
                            localInternalJavascript.push(file);
                        } else {
                            localExternalJavascript.push(file);
                        }
                        localJavascript.push(file);
                    } else {
                        if (pack) {
                            remoteInternalJavascript.push(file);
                        } else {
                            remoteExternalJavascript.push(file);
                        }
                        remoteJavascript.push(file);
                    }
                }
            }
        }

        return {
            'remoteInternalStylesheet': remoteInternalStylesheet,
            'remoteExternalStylesheet': remoteExternalStylesheet,
            'localInternalStylesheet': localInternalStylesheet,
            'localExternalStylesheet': localExternalStylesheet,
            'remoteInternalJavascript': remoteInternalJavascript,
            'remoteExternalJavascript': remoteExternalJavascript,
            'localInternalJavascript': localInternalJavascript,
            'localExternalJavascript': localExternalJavascript,
            'localJavascript': localJavascript,
            'localStylesheet': localStylesheet,
            'remoteStylesheet': remoteStylesheet,
            'remoteJavascript': remoteJavascript
        }
    },

    resolveDependencies: function (key) {
        var sorted = [],
            resolved = [];

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

        while (this.config.build.libs.length > 0) {
            for (var i in this.config.build.libs) {
                if (canResolve(this.config.build.libs[i], resolved)) {
                    sorted.push(this.config.build.libs[i]);
                    this.config.build.libs.splice(i, 1);
                    resolved = arrayFromKey(sorted, 'name');
                }
            }
        }

        return sorted;
    },

    getLibrary: function (name) {
        var libs = this.resolveDependencies('dependencies');

        for (var i in libs) {
            if(libs[i].name == name) {
                return libs[i];
            }
        }
    }
};