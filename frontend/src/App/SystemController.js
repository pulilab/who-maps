import _ from 'lodash';
import { Storage } from '../Common/';

class SystemController {

    constructor($state, $scope) {
        this.EE = window.EE;
        this.state = $state;
        this.scope = $scope;
        this.storage = new Storage();
        this.eventBindings();
        this.cs = require('../Common/CommonServices');
        this.isLogin = this.storage.get('login');
        this.userProfile = this.cs.userProfile;
        this.watchers();
    }

    watchers() {
        this.scope.$watch(() => {
            return this.state.current.name;
        }, value => {
            this.showCountryTopBar = ['landing', 'terms-of-use'].indexOf(value) > -1;
        });
    }

    eventBindings() {
        this.EE.once('login', this.handleLogin.bind(this));
    }

    handleLogin() {
        this.storage.set('login', true);
        const rs = this.cs.reset();
        rs.loadedPromise.then(() => {
            let appName = _.last(rs.projectList);
            if (!this.cs.userProfile || _.isNull(this.cs.userProfile.name) || this.cs.userProfile.name === '') {
                this.state.go('editProfile');
            }
            else if (appName && appName.id && this.cs.userProfile.account_type === 'I') {
                appName = appName.id;
                this.state.go('dashboard', { appName });
            }
            else {
                const state = this.cs.userProfile.account_type === 'Y' ? 'inventory' : 'country';
                appName = appName && appName.id ? appName.id : null;
                this.state.go(state, { appName });
            }
        }, () => {
            console.error('failed login');
        });
    }

    hasProfile() {
        return this.cs.hasProfile();
    }

    openMenu($mdOpenMenu, event) {
        $mdOpenMenu(event);
    }

    logout() {
        const rest = this.cs.reset();
        rest.loadedPromise.then(() => {
            this.isLogin = false;
            this.userProfileId = null;
            this.storage.clear();
        });
    }


    static systemControllerFactory() {

        function systemController($state, $scope) {

            return new SystemController($state, $scope);
        }

        systemController.$inject = ['$state', '$scope'];

        return systemController;
    }

}


export default SystemController;
