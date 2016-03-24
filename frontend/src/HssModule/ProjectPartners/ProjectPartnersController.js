// import _ from 'lodash';
import { partnerLogoUrls } from '../hssMockData';
import modalHtml from './UploadModal.html';

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

        this.dialog.show(
            {
                template: modalHtml,
                openFrom: '#uploadmodalanchor',
                closeTo: '#uploadmodalanchor',
                clickOutsideToClose: true
            }
        );
    }

    upLoadLogo() {
        // dont forget to refresh the view!
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
