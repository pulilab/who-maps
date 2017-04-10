import { CommonServices, CustomCountryService } from '../../Common/';

class TermOfUseController {

    constructor($scope) {
        this.EE = window.EE;
        this.scope = $scope;
        this.ccs = CustomCountryService;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
    }

    onInit() {
        const vm = this;
        this.menuEntry = ['contact', 'terms of use'];
        this.currentSection = 'terms of use';
        this.style = {
            height: CommonServices.calculateHeight()
        };

        const subDomain = this.ccs.getSubDomain();
        this.ccs.getCountryData(subDomain).then(data => {
            vm.scope.$evalAsync(() => {
                vm.countryData = data;
                vm.countryCover = null;
                vm.showFooter = data.footer_text && data.footer_title;
            });
        });
    }

    onDestroy() {
    }

    openSection(section) {
        this.currentSection = section;
    }

    static termOfUseFactory() {
        require('./TermsOfUse.scss');

        function termOfUseController($scope) {
            return new TermOfUseController($scope);
        }

        termOfUseController.$inject = ['$scope'];

        return termOfUseController;
    }

}

export default TermOfUseController;
