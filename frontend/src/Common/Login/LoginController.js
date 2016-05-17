import _ from 'lodash';
import LoginService from './LoginService';

class LoginModuleController {

    constructor($scope) {
        this.ls = new LoginService();
        this.EE = window.EE;
        this.scope = $scope;
        this.user = {
            username: '',
            password: ''
        };
        this.style = {
            height: this.calculateHeight()
        };
    }

    calculateHeight() {
        const contentHeight = window.innerHeight - 48;
        return contentHeight + 'px';
    }

    login() {
        const vm = this;
        if (this.loginForm.$valid) {
            this.ls.login(this.user)
                .then(result => {
                    if (result) {
                        this.user.password = void 0;
                        this.ls.storeUser(this.user);
                        this.EE.emit('login');
                    }
                }, data => {
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
                });
        }
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
