import forEach from 'lodash/forEach';
import * as UserModule from '../../store/modules/user';
import { calculateHeight } from '../../Utilities';

class LoginModuleController {

    constructor($scope, $state, $ngRedux, $urlService) {
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;
        this.$urlService = $urlService;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.mapState = this.mapState.bind(this);
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
            height: calculateHeight()
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
                if (this.state.params.location) {
                    const rule  = this.$urlService.match({ path: this.state.params.location });
                    this.state.go(rule.rule.state.name, rule.match);
                }
                else {
                    this.state.go('my-projects');
                }
            }
            catch (e) {
                console.warn(e);
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
        forEach(data, (item, key) => {
            if (vm.loginForm[key] && key !== 'non_field_errors') {
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

        function loginController($scope, $state, $ngRedux, $urlService) {
            return new LoginModuleController($scope, $state, $ngRedux, $urlService);
        }

        loginController.$inject = ['$scope', '$state', '$ngRedux', '$urlService'];

        return loginController;
    }

}

export default LoginModuleController;
