import { partnerLogoUrls } from '../hssMockData';
import ProjectPartnerService from './ProjectPartnersService';

class ProjectPartnersController {

    constructor($scope, Upload) {

        const vm = this;
        vm.scope = $scope;
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
        this.pps.uploadLogo(data);
    }

    static projectPartnersFactory() {
        require('./ProjectPartners.scss');
        function project($scope, Upload) {
            return new ProjectPartnersController($scope, Upload);
        }

        project.$inject = ['$scope', 'Upload'];

        return project;
    }
}

export default ProjectPartnersController;
