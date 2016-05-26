import platform from 'platform';

/* global define, Promise, URL */

const components = {};

class StaticUtilities {

    constructor(_path) {
        this.path = _path;
    }

    lazyLoader(provider, element) {
        const vm = this;
        const prom = new Promise((resolve) => {
            require([], require => {
                const ctrl = require(`./${vm.path}/${element}`);
                if (!components[element]) {
                    components[element] = true;
                    provider.component(ctrl.name, ctrl);
                }
                resolve();
            });
        });
        return prom;
    }

    static getComponents() {
        return components;
    }

    static launchDownload(data, filename) {
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        const url = URL.createObjectURL(data);
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    static classifyString(str) {
        return str.replace(/ /g, '_').toLowerCase();
    }

    static prefixHtml() {
        const html = document.querySelector('html');
        const strippedVersion = platform.version.split('.')[0];
        html.classList.add('browser-' + StaticUtilities.classifyString(platform.name));
        html.classList.add('version-' + StaticUtilities.classifyString(strippedVersion));
        html.classList.add('os-' + StaticUtilities.classifyString(platform.os.family));
        html.classList.add('os-version-' + StaticUtilities.classifyString(platform.os.version));
    }
}


export { StaticUtilities };
