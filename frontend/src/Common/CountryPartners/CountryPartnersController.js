
class CountryPartnersController {

    constructor($scope, $state) {
        const vm = this;
        vm.scope = $scope;
        vm.state = $state;
        vm.$onInit = vm.onInit.bind(vm);
    }

    onInit() {
        this.logos = [
            'https://pbs.twimg.com/media/C2XXpKRUsAAXHWt.jpg',
            'https://pbs.twimg.com/media/C2XXpKRUsAAXHWt.jpg',
            'https://pbs.twimg.com/media/C2XXpKRUsAAXHWt.jpg',
            'https://pbs.twimg.com/media/C2XXpKRUsAAXHWt.jpg'
        ];
        this.scope.$evalAsync();

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
