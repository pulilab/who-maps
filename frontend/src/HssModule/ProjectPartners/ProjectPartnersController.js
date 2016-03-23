// import _ from 'lodash';
import { partnerLogoUrls } from '../hssMockData';

class ProjectPartnersController {

    constructor($timeout) {
        const vm = this;
        $timeout(() => {
            vm.EE = window.EE;
            vm.editMode = false;
            vm.EE.on('hssEditMode', bool => {
                vm.editMode = bool;
            });

            vm.logos = partnerLogoUrls;
        });
    }

    delLogo(logo) {
        if (this.editMode) {
            this.logos = this.logos.filter(l => l !== logo);
        }
        // handle backend here!
    }

    addLogo() {
        console.warn('should show modal with upload features');
    }

    static projectPartnersFactory() {
        require('./ProjectPartners.scss');
        function project($timeout) {
            return new ProjectPartnersController($timeout);
        }

        project.$inject = ['$timeout'];

        return project;
    }
}

export default ProjectPartnersController;
