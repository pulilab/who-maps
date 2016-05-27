import _ from 'lodash';
import LoginService from './LoginService';

class LoginModuleController {

    constructor($scope) {
        this.ls = new LoginService();
        this.EE = window.EE;
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
    }

    onInit() {
        this.user = {
            username: '',
            password: ''
        };
        this.style = {
            height: this.calculateHeight()
        };
    }

    onDestroy() {
        this.user = void 0;
    }

    calculateHeight() {
        const contentHeight = window.innerHeight - 48;
        return contentHeight + 'px';
    }

    login() {
        const vm = this;
        if (vm.loginForm.$valid) {
            vm.ls.login(vm.user)
                .then(result => {
                    if (result) {
                        const user = _.cloneDeep(vm.user);
                        user.password = void 0;
                        vm.ls.storeUser(user);
                        vm.EE.emit('login');
                    }
                }, vm.handleDataError.bind(vm));
        }
    }

    handleDataError(data) {
        const vm = this;
        _.forEach(data, (item, key) => {
            if (vm.loginForm[key]) {
                vm.loginForm[key].customError = item;
                vm.loginForm[key].$setValidity('custom', false);

            }
            else {
                vm.loginForm[key] = item;
            }
        });
        vm.scope.$evalAsync();
    }


    static loginFactory() {
        require('./Login.scss');

        function loginController($scope) {
            return new LoginModuleController($scope);
        }

        loginController.$inject = ['$scope'];

        return loginController;
    }

}

export default LoginModuleController;
