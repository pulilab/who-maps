import _ from 'lodash';
import { Storage } from '../Common/';

class SystemController {

    constructor($state) {
        this.EE = window.EE;
        this.state = $state;
        this.storage = new Storage();
        this.eventBindings();
        this.cs = require('../Common/CommonServices');
        this.isLogin = this.storage.get('login');
    }

    eventBindings() {
        this.EE.on('login', this.handleLogin.bind(this));
        this.EE.on('unauthorized', this.handleUnauthorized.bind(this));
    }

    handleUnauthorized() {
        this.storage.clear();
        const rs = this.cs.reset();
        rs.loadedPromise.then(() => {
            this.state.go('landing', { appName: null });
        }, () => {
            console.error('failed unauthorized handling ');
        });
    }

    handleLogin() {
        this.storage.set('login', true);
        const rs = this.cs.reset();
        rs.loadedPromise.then(() => {
            let appName = _.last(rs.projectList);
            if (_.isNull(this.cs.userProfile.name)) {
                this.state.go('editProfile');
            }
            else if (appName && appName.id && this.cs.userProfile.account_type === 'I') {
                appName = appName.id;
                this.state.go('dashboard', { appName });
            }
            else {
                appName = appName && appName.id ? appName.id : null;
                this.state.go('country', { appName });
            }
        }, () => {
            console.error('failed login');
        });
    }


    static systemControllerFactory() {

        function systemController($state) {

            return new SystemController($state);
        }

        systemController.$inject = ['$state'];

        return systemController;
    }

}


export default SystemController;
