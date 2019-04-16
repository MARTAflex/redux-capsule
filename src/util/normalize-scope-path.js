'use strict';

module.exports = (path) => {
    if (!path) {
        return path;
    }

    // FIXME: delim '.' => '/'
    var components = path.split(/\./g), // path component array
        buffer = []; // component buffer while normalizing

    components.forEach(component => {
        if (!component) {
            return;
        }

        // FIXME: '#<<' should be '..'
        if (component === '#<<') {
            if (buffer.length) {
                buffer.pop()
            }
            else {
                throw new Error('above root scope');
            }
        }
        else {
            buffer.push(component)
        }
    });

    // FIXME: '.' => '/'
    return buffer.join('.');
}
