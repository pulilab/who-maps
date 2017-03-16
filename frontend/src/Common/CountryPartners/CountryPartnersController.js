
class CountryPartnersController {

    constructor($scope, $state) {
        const vm = this;
        vm.scope = $scope;
        vm.state = $state;
        vm.$onInit = vm.onInit.bind(vm);
    }

    onInit() {

    }

    computeLogoStyle(logo) {
        return { 'background-image': `url(${logo})` };
    }

    static countryPartnersFactory() {
        require('./countryPartners.scss');
        function countryPartners($scope, $state) {
            return new CountryPartnersController($scope, $state);
        }

        countryPartners.$inject = ['$scope', '$state'];

        return countryPartners;
    }
}

export default CountryPartnersController;
