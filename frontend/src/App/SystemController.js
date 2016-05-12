import _ from 'lodash';
import { Storage, CommonService } from '../Common/';

class SystemController {

    constructor($state) {
        this.EE = window.EE;
        this.state = $state;
        this.storage = new Storage();

        this.eventBindings();
    }

    eventBindings() {
        this.EE.on('login', this.handleLogin.bind(this));
    }

    handleLogin() {
        this.storage.set('login', true);
        const rs = CommonService.reset();
        rs.loadedPromise.then(() => {
            const appName = _.last(rs.projectList).id;
            this.state.go('dashboard', { appName });
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
