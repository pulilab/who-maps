import HssModuleService from '../HssModuleService';

class ProjectScaleController {

    constructor($scope) {
        const vm = this;
        vm.scope = $scope;
        vm.$onInit = vm.initialization.bind(vm);
    }

    initialization() {
        const vm = this;
        vm.EE = window.EE;
        vm.editMode = false;
        vm.hms = new HssModuleService(this.projectId);

        vm.hms.getDetail().then(data => {
            console.log(data);
            this.string = data.goals_to_scale;
            this.scope.$evalAsync();
        }
        );


        vm.EE.on('hssEditMode', bool => {
            vm.editMode = bool;
        });
    }

    static projectScaleFactory() {
        require('./ProjectScale.scss');
        function project($scope) {
            return new ProjectScaleController($scope);
        }

        project.$inject = ['$scope', '$state'];

        return project;
    }
}

export default ProjectScaleController;
