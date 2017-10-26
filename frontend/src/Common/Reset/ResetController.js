import _ from 'lodash';
import ResetService from './ResetService';

class ResetModuleController {

    constructor($scope) {
        this.rs = new ResetService();
        this.EE = window.EE;
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
    }

    onInit() {
        this.email = '';
        this.sent = false;
        this.style = {
            height: 300
        };
    }

    onDestroy() {
        this.email = void 0;
    }

    reset() {
        const vm = this;
        if (vm.resetForm.$valid) {
            vm.rs.reset({ email: vm.email })
                .then(result => {
                    if (!result.success) {
                        vm.handleDataError(result.data);
                    }
                    else {
                        vm.sent = true;
                    }
                });
        }
    }

    handleDataError(data) {
        const vm = this;
        _.forEach(data, (item, key) => {
            if (vm.resetForm[key]) {
                vm.resetForm[key].customError = item;
                vm.resetForm[key].$setValidity('custom', false);

            }
            else {
                vm.resetForm[key] = item;
            }
        });
        vm.scope.$evalAsync();
    }

    handleCustomError(key) {
        this.resetForm[key].$setValidity('custom', true);
        this.resetForm[key].customError = [];
    }


    static resetFactory() {
        require('./Reset.scss');

        function resetController($scope) {
            return new ResetModuleController($scope);
        }

        resetController.$inject = ['$scope'];

        return resetController;
    }

}

export default ResetModuleController;
