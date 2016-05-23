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
    let hash = void 0;
    args.forEach(item => {
        hash += JSON.stringify(item);
    });
    hash += Date.now();
    return hashCode(hash);
};

let requests = {
    started: 0,
    ended: 0
};

// let emitting = false;
// const waitTime = 200;
let progression = 0;
let firstRequest = false;

const emit = (detail) => {
    const event = new CustomEvent('xhrmonitor', { detail });
    window.dispatchEvent(event);
};


const reset = () => {
    if (requests.started !== 0 && requests.started === requests.ended) {
        requests = {
            started: 0,
            ended: 0
        };
    }
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
        clearInterval(interval);
    }

};


const progressiveEmit = () => {
    // console.log(`started: ${requests.started}, ended: ${requests.ended}`);
    if (!firstRequest) {
        firstRequest = true;
        emit({ progression: 10 });
    }

    if (requests.started === requests.ended) {
        pollingProcess(true);
        progression = 0;
        reset();
        emit({ progression: 90 });
        setTimeout(() => {
            emit({ progression: 100 });
        }, 100);
    }

    if (progression === 0) {
        pollingProcess(false);
    }

};

// const delayedEmit = () => {
//     if (!emitting || requests.started === requests.ended && requests.started !== 0) {
//         emitting = true;
//         setTimeout(() => {
//             const detail = JSON.parse(JSON.stringify(requests));
//             emit(detail);
//             reset();
//             emitting = false;
//         }, waitTime);
//     }
// };

const emitEvent = () => {
    progressiveEmit();
};


const preRequest = (hash) => {
    requests[hash] = false;
    requests.started += 1;
    emitEvent();
};

const postRequest = (hash) => {
    if (requests[hash] === false) {
        requests[hash] = true;
        requests.ended += 1;
        emitEvent();
    }
};

window.fetch = (...args) => {
    const hash = hashArguments(args);
    preRequest(hash);
    return f.apply(this, args).then((data)=> {
        postRequest(hash);
        return data;
    }, (data) => {
        postRequest(hash);
        return data;
    });
};


