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
        console.log(window.location.href);
        // this.state.go('app');
        window.location.href = window.location.href.replace('login', 'app/');
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
