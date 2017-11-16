import _ from 'lodash';
import { calculateHeight } from '../../Utilities';
import { resetPassword } from '../../store/modules/user';

class ResetModuleController {

    constructor($scope) {
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
    }

    onInit() {
        this.email = '';
        this.sent = false;
        this.style = {
            height: calculateHeight()
        };
    }

    onDestroy() {
        this.email = void 0;
    }

    async reset() {
        if (this.resetForm.$valid) {
            try {
                await resetPassword({ email: this.email });
                this.sent = true;
            }
            catch (e) {
                this.handleDataError(e.data);
            }
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
