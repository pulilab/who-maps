import SearchbarService from '../Searchbar/SearchbarService';


class UUIDLoadController {

    constructor($state, CommonServices) {
        this.EE = window.EE;
        this.state = $state;
        this.cs = CommonServices;
         this.ss = new SearchbarService();
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
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
    }

    async handleProjectLoad() {
        const uuid =  this.state.params.projectUUID;
        const filters = {
            all: true
        };

        const search = await this.ss.searchProject(uuid, filters);
        const project = search.slice().pop();
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
        function uuidLoadController($state) {
            return new UUIDLoadController($state, CommonServices);
        }

        uuidLoadController.$inject = ['$state'];

        return uuidLoadController;
    }

}

export default UUIDLoadController;
