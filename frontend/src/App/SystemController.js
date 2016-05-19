import _ from 'lodash';
import { Storage } from '../Common/';

class SystemController {

    constructor($state) {
        this.EE = window.EE;
        this.state = $state;
        this.storage = new Storage();
        this.eventBindings();
        this.cs = require('../Common/CommonServices');
    }

    eventBindings() {
        this.EE.on('login', this.handleLogin.bind(this));
        this.EE.on('unauthorized', this.handleUnauthorized.bind(this));
    }

    handleUnauthorized() {
        console.log('unauthorized');
        this.storage.clear();
        const rs = this.cs.reset();
        rs.loadedPromise.then(() => {
            this.state.go('base.landing', { appName: null });
        }, () => {
            console.error('failed unauthorized handling ');
        });
    }

    handleLogin() {
        this.storage.set('login', true);
        const rs = this.cs.reset();
        rs.loadedPromise.then(() => {
            let appName = _.last(rs.projectList);
            if (appName && appName.id) {
                appName = appName.id;
                this.state.go('dashboard', { appName });
            }
            else {
                this.state.go('country');
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
