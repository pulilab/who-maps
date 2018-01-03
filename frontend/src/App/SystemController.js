import * as UserModule from '../store/modules/user';

class SystemController {

    constructor($state, $scope, $ngRedux) {
        this.EE = window.EE;
        this.state = $state;
        this.scope = $scope;
        this.unsubscribe = $ngRedux.connect(this.mapState, UserModule)(this);
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
    }

    mapState(state) {
        return {
            userProfile: UserModule.getProfile(state)
        };
    }

    onInit() {
        this.watchers();
    }

    onDestroy() {
        this.unsubscribe();
    }

    watchers() {
        this.scope.$watch(() => {
            return this.state.current.name;
        }, value => {
            this.showCountryTopBar = ['landing', 'terms-of-use'].indexOf(value) > -1;
        });
    }

    hasProfile() {
        return this.userProfile;
    }

    openMenu($mdOpenMenu, event) {
        $mdOpenMenu(event);
    }

    static systemControllerFactory() {

        function systemController($state, $scope, $ngRedux) {

            return new SystemController($state, $scope, $ngRedux);
        }

        systemController.$inject = ['$state', '$scope', '$ngRedux'];

        return systemController;
    }

}


export default SystemController;
