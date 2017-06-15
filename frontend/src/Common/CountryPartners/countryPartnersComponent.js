import _template from './CountryPartners.html';
import CountryPartnersController from './CountryPartnersController';

const countryPartnersComponent = {
    controller: CountryPartnersController.countryPartnersFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'countryPartners',
    bindings: {
        footerText: '<',
        footerTitle: '<',
        partners: '<',
        permanentFooter: '<'
    }
};

export default countryPartnersComponent;
