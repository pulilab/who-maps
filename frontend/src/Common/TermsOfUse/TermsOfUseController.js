import { CommonServices } from '../../Common/';

class TermOfUseController {

    constructor($scope) {
        this.EE = window.EE;
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
    }

    onInit() {
        this.menuEntry = ['contact', 'terms of use'];
        this.currentSection = 'terms of use';
        this.style = {
            height: CommonServices.calculateHeight()
        };
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
