import _ from 'lodash';

class UUIDLoadController {

    constructor($state, CommonServices) {
        this.EE = window.EE;
        this.state = $state;
        this.cs = CommonServices;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
    }

    onInit() {
        this.style = {
            height: this.cs.calculateHeight()
        };

        const reset = this.cs.reset();
        reset.loadedPromise.then(this.handleProjectLoad.bind(this));
    }

    onDestroy() {
    }

    handleProjectLoad() {
        let appName = _.chain(this.state.params.projectUUID)
            .split('/')
            .last()
            .split('x')
            .last()
            .value();
        appName = _.parseInt(appName, 10);

        let state = 'public-dashboard';

        if (this.cs && this.cs.userProfile) {
            if (this.cs.userProfile.member.indexOf(appName) > -1
                || this.cs.userProfile.viewer.indexOf(appName) > -1) {
                state = 'dashboard';
            }
        }
        this.state.go(state, { appName });
    }

    static uuidLoadFactory() {
        require('./UUIDLoad.scss');
        const CommonServices = require('../CommonServices');
        function uuidLoadController($state) {
            return new UUIDLoadController($state, CommonServices);
        }

        uuidLoadController.$inject = ['$state'];

        return uuidLoadController;
    }

}

export default UUIDLoadController;
