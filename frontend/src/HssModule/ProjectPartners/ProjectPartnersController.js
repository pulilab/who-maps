// import _ from 'lodash';
import { projectPartners } from '../hssMockData';

class ProjectPartnersController {

    constructor($timeout) {
        const vm = this;
        $timeout(() => {
            vm.EE = window.EE;
            vm.editMode = false;
            vm.string = projectPartners;
            vm.EE.on('hssEditMode', bool => {
                vm.editMode = bool;
            });
        });
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
