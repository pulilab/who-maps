// import _ from 'lodash';
import { projectScale } from '../hssMockData';

class ProjectScaleController {

    constructor($timeout) {
        const vm = this;
        $timeout(() => {
            vm.EE = window.EE;
            vm.editMode = false;
            vm.string = projectScale;
            vm.EE.on('hssEditMode', bool => {
                vm.editMode = bool;
            });
        });
    }

    static projectScaleFactory() {
        require('./ProjectScale.scss');
        function project($timeout) {
            return new ProjectScaleController($timeout);
        }

        project.$inject = ['$timeout'];

        return project;
    }
}

export default ProjectScaleController;
