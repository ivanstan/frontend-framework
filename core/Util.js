class Util {

    /**
     * Uppercase first letter of string.
     *
     * @param string
     * @returns {string}
     */
    static capitalize(string) {
        return string[0].toUpperCase() + string.slice(1);
    }

    /**
     * Returns html template from html import tag.
     *
     * @param link
     * @returns {*}
     */
    static link2html(link) {
        var template = $(link[0].import).find('template');

        if (template.length == 0) {
            return false;
        }

        return template.html();
    }

    static pathInfo(path) {
        let filename = path.replace(/^.*[\\\/]/, ''),
            extension = filename.split('.').pop();

        return {
            path: path,
            filename: filename,
            extension: extension,
            basename: filename.replace('.' + extension, ''),
            dirname: path.replace(filename, '')
        }
    }

}


