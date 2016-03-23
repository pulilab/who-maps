// import _ from 'lodash';
import { partnerLogoUrls } from '../hssMockData';

class ProjectPartnersController {

    constructor($timeout, $mdDialog) {
        const vm = this;
        $timeout(() => {
            vm.EE = window.EE;
            vm.dialog = $mdDialog;

            vm.EE.on('hssEditMode', bool => {
                vm.editMode = bool;
            });

            vm.editMode = false;
            vm.logos = partnerLogoUrls;
        });
    }

    delLogo(logo) {
        if (this.editMode) {
            this.logos = this.logos.filter(l => l !== logo);
        }
        // handle backend here!
    }

    addLogoDialog() {
        console.warn('should show modal with upload features');

        const modal = this.dialog.alert()
            .clickOutsideToClose(true)
            .title('Upload Project Partner logos')
            // .textContent('Content, should template this somehow')
            .textContent('Content, should template this somehow')
            .ariaLabel('Modal for uploading Project Partners logos')
            .ok('Done uploading')
            // You can specify either string with query selector (docs...)
            .openFrom('#uploadmodalanchor')
            .closeTo('#uploadmodalanchor');

        this.dialog.show(modal);
    }

    static projectPartnersFactory() {
        require('./ProjectPartners.scss');
        function project($timeout, $mdDialog) {
            return new ProjectPartnersController($timeout, $mdDialog);
        }

        project.$inject = ['$timeout', '$mdDialog'];

        return project;
    }
}

export default ProjectPartnersController;
