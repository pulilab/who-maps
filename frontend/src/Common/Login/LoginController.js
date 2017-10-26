import _ from 'lodash';
import * as UserModule from '../../store/modules/user';

class LoginModuleController {

    constructor($scope, $state, $ngRedux) {
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.handleDataError = this.handleDataError.bind(this);
        this.unsubscribe = $ngRedux.connect(this.mapState, UserModule)(this);
    }

    mapState(state) {
        return {
            userModel: state.user
        };
    }

    onInit() {
        this.user = {
            username: '',
            password: ''
        };
        this.style = {
            height: 300
        };
    }

    onDestroy() {
        this.user = void 0;
        this.unsubscribe();
    }

    async  login() {
        if (this.loginForm.$valid) {
            try {
                await this.doLogin(this.user);
                this.state.go('dashboard');
            }
            catch (e) {
                this.handleDataError(e);
            }
        }
    }

    handleDataError(data) {
        const vm = this;
        if (!data) {
            data = {
                non_field_errors: ['Security error']
            };
        }
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

    handleCustomError(key) {
        this.loginForm[key].$setValidity('custom', true);
        this.loginForm[key].customError = [];
    }


    static loginFactory() {
        require('./Login.scss');

        function loginController($scope, $state, $ngRedux) {
            return new LoginModuleController($scope, $state, $ngRedux);
        }

        loginController.$inject = ['$scope', '$state', '$ngRedux'];

        return loginController;
    }

}

export default LoginModuleController;
