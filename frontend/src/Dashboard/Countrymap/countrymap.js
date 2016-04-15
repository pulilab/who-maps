import _template from './Countrymap.html';
import CountrymapController from './CountrymapController';

const coutrymap = {
    controller: CountrymapController.countrymapFactory(),
    controllerAs: 'vm',
    template: _template,
    bindings: {
        country: '=',
        data: '='
    }
};

export default coutrymap;
