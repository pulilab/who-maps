import { partnerLogoUrls } from '../hssMockData';
import ProjectPartnerService from './ProjectPartnersService';

class ProjectPartnersController {

    constructor($scope, $state, Upload) {

        const vm = this;
        vm.scope = $scope;
        vm.state = $state;
        vm.pps = new ProjectPartnerService(Upload);
        vm.$onInit = vm.initialization;
    }

    initialization() {
        this.EE = window.EE;
        this.EE.on('hssEditMode', bool => {
            this.editMode = bool;
        });

        this.editMode = false;
        this.logos = partnerLogoUrls;
    }

    delLogo(logo) {

        if (this.editMode) {
            this.logos = this.logos.filter(l => l !== logo);
        }

        // backend update...
    }


    uploadLogo(data) {
        const projectId = this.state.params.appName;
        this.pps.uploadLogo(data, projectId);
    }

    static projectPartnersFactory() {
        require('./ProjectPartners.scss');
        function project($scope, $state, Upload) {
            return new ProjectPartnersController($scope, $state, Upload);
        }

        project.$inject = ['$scope', '$state', 'Upload'];

        return project;
    }
}

export default ProjectPartnersController;
