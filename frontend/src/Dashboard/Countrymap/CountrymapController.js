/* global d3 */

class CountrymapController {

    constructor() {
        const vm = this;

        console.log('Scope', vm);
    }

    drawMap() {

    }

    static countrymapFactory() {
        require('./Countrymap.scss');
        require('d3');

        function countrymap() {
            return new CountrymapController();
        }

        countrymap.$inject = [];

        return countrymap;
    }

}

export default CountrymapController;
