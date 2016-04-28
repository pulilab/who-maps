import _template from './Countrymap.html';
import CountrymapController from './CountryMapController';

const coutrymap = {
    controller: CountrymapController.countrymapFactory(),
    controllerAs: 'vm',
    template: _template,
    bindings: {
        country: '=',
        data: '='
    },
    name: 'countrymap'
};

export default coutrymap;
