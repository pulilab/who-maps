import * as SystemModule from '../../store/modules/system';

class UUIDLoadController {

    constructor($state, $ngRedux, CommonServices) {
        this.EE = window.EE;
        this.state = $state;
        this.cs = CommonServices;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.unsubscribe = $ngRedux.connect(this.mapState, SystemModule)(this);
    }

    onInit() {
        this.style = {
            height: this.cs.calculateHeight()
        };
        this.errorMessage = false;

        const reset = this.cs.reset();
        reset.loadedPromise.then(this.handleProjectLoad.bind(this));
    }

    onDestroy() {
        this.unsubscribe();
    }

    mapState(state) {
        return {
            search: state.system.projectSearch
        };
    }

    async handleProjectLoad() {
        const uuid =  this.state.params.projectUUID;
        const filters = {
            all: true
        };
        await this.searchProjects(uuid, filters);
        const project = this.search.slice().pop();
        const id = project && project.id ? project.id : false;

        let state = 'public-dashboard';

        if (id === false) {
            this.errorMessage = true;
            return;
        }

        if (this.cs && this.cs.userProfile) {
            if (this.cs.userProfile.member.indexOf(id) > -1
              || this.cs.userProfile.viewer.indexOf(id) > -1) {
                state = 'dashboard';
            }
        }
        this.state.go(state, { appName: id });
    }

    static uuidLoadFactory() {
        require('./UUIDLoad.scss');
        const CommonServices = require('../CommonServices');
        function uuidLoadController($state, $ngRedux) {
            return new UUIDLoadController($state, $ngRedux, CommonServices);
        }

        uuidLoadController.$inject = ['$state', '$ngRedux'];

        return uuidLoadController;
    }

}

export default UUIDLoadController;
