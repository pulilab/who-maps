import HssModuleService from '../HssModuleService';

class ProjectScaleController {

    constructor($scope, $state) {
        const vm = this;
        vm.scope = $scope;
        vm.state = $state;
        vm.$onInit = vm.initialization.bind(vm);
    }

    initialization() {
        const vm = this;
        vm.EE = window.EE;
        vm.editMode = false;
        vm.hms = new HssModuleService(this.projectId);

        vm.hms.getDetail()
            .then(data => {
                this.projectData = data;
                this.string = data.goals_to_scale;
                this.scope.$evalAsync();
                }
            );


        vm.EE.on('hssEditMode', bool => {
            vm.editMode = bool;
        });
    }

    updateProjectScale(data) {
        const projectId = this.state.params.appName;
        this.projectData.goals_to_scale = data;
        this.hms.updateDetail(this.projectData, projectId);
    }

    static projectScaleFactory() {
        require('./ProjectScale.scss');
        function project($scope, $state) {
            return new ProjectScaleController($scope, $state);
        }

        project.$inject = ['$scope', '$state'];

        return project;
    }
}

export default ProjectScaleController;
