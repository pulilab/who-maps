class SessionStorage {

    set(key, value) {

        if (typeof key !== 'string') {
            throw new TypeError('SessionStorage key should be a string!');
        }

        const val = typeof value === 'string' ?
            value :
            JSON.stringify(value);

        sessionStorage.setItem(key, val);

    }

    get(key) {
        try {
            return JSON.parse(sessionStorage.getItem(key));
        } catch (e) {
            return null;
        }
    }

    remove(key) {
        sessionStorage.removeItem(key);
    }

    clear() {
        sessionStorage.clear();
    }

    // DEBUG
    check() {
        console.log('sessionStorage contains:\n');
        const ret = {};
        for (const key in sessionStorage) {
            console.log(key + ': ' + sessionStorage.getItem(key));
            ret[key] = sessionStorage.getItem(key);
        }
        return ret;
    }
}

export default SessionStorage;
