import { Storage, ResetService } from '../Common/';

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
        ResetService.commonServiceFactory(true);
        this.state.go('app');
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
