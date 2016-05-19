/* global define, Promise */

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


}


export { StaticUtilities };
