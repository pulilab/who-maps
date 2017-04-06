// polyfill for IE11

function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
}

CustomEvent.prototype = window.Event.prototype;

window.CustomEvent = CustomEvent;


const f = fetch;

const hashCode = (str) => {
    let hash = 0;
    let i;
    let chr;
    let len;
    if (str.length === 0) {
        return hash;
    }
    for (i = 0, len = str.length; i < len; i += 1) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
};

const hashArguments = args => {
    let hash = JSON.stringify(args);
    hash += Date.now();
    return hashCode(hash);
};

let requests = {
    started: 0,
    ended: 0
};

let progression = 0;
let firstRequestSent = false;

const emit = (detail) => {
    const event = new CustomEvent('xhrmonitor', { detail });
    window.dispatchEvent(event);
};


const reset = () => {
    requests = {
        started: 0,
        ended: 0,
        end: null,
        start: null
    };
};

let interval = void 0;

const pollingProcess = (stop) => {
    if (!stop) {
        interval = setInterval(() => {
            const current = (requests.ended * 100) / requests.started;
            if (current > progression) {
                progression = current;
                emit({ progression });
            }
        }, 100);
    }
    else {
        reset();
        firstRequestSent = false;
        clearInterval(interval);
    }

};

const getRequests = () => {
    return requests;
};

let checkInterval = null;
const cleanFrozenState = () => {
    if (!checkInterval) {
        checkInterval = setInterval(() => {
            const req = getRequests();
            if (req && !req.end && !req.start) {
                clearInterval(checkInterval);
                checkInterval = null;
            }

            if (req && req.end && req.start && req.end - req.start > 10000) {
                emit({ progression: 100 });
                clearInterval(checkInterval);
                checkInterval = null;
            }
        }, 1000);
    }
};


const progressiveEmit = () => {
    if (!firstRequestSent) {
        pollingProcess(false);
        firstRequestSent = true;
        emit({ progression: 10 });
    }

    if (requests.started === requests.ended && requests.started > 0) {
        pollingProcess(true);
        progression = 0;
        emit({ progression: 90 });
        setTimeout(() => {
            emit({ progression: 100 });
        }, 100);
    }
};

const emitEvent = () => {
    progressiveEmit();
    cleanFrozenState();
};


const preRequest = (hash) => {
    const now = Date.now();
    requests[hash] = {};
    requests[hash].done = false;
    requests.started += 1;
    requests[hash].start = now;
    if (requests.started === 1) {
        requests.start = now;
    }
    emitEvent();
};

const postRequest = (hash) => {
    const now = Date.now();
    requests[hash].done = true;
    requests[hash].end = now;
    requests.ended += 1;
    requests.end = now;
    emitEvent();
};

const failedRequest = () => {
    const event = new CustomEvent('xhrFailedRequest');
    window.dispatchEvent(event);
};

window.fetch = (...args) => {
    const hash = hashArguments(args);
    preRequest(hash);
    return f.apply(this, args).then((data)=> {
        const status = '' + data.status;
        if (status.indexOf('50') > -1) {
            failedRequest();
        }
        postRequest(hash);
        return data;
    }).catch((data) => {
        postRequest(hash);
        failedRequest();
        return data;
    });
};


/* eslint func-names:0 */
XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(value) {
    const hash = hashArguments(this);
    this.addEventListener('progress', function() {
        preRequest(hash);
    }, false);

    this.addEventListener('load', function() {
        postRequest(hash);
    }, false);
    this.addEventListener('error', function() {
        postRequest(hash);
        failedRequest();
    }, false);
    this.realSend(value);
};
