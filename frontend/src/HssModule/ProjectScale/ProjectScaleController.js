import {  Protected } from '../../Common/';
import HssModuleService from '../HssModuleService';

class ProjectScaleController extends Protected {

    constructor($scope, $state) {
        super();
        const vm = this;
        vm.scope = $scope;
        vm.state = $state;
        vm.EE = window.EE;
        vm.$onInit = vm.onInit.bind(vm);
        vm.$onDestroy = vm.onDestroy.bind(vm);
    }

    onInit() {
        const vm = this;
        vm.defaultOnInit();
        vm.bindEvents();
        vm.editMode = false;
        vm.hms = new HssModuleService(this.projectId);
        vm.hms.getDetail().then(this.handleData.bind(this));

    }

    handleData(data) {
        this.projectData = data;
        this.string = data.goals_to_scale;
        this.scope.$evalAsync();
    }
    onDestroy() {
        const vm = this;
        vm.defaultOnDestroy();
        vm.removeEvents();
    }

    bindEvents() {
        const vm = this;
        vm.EE.on('hssEditMode', this.handleEditMode, this);
    }

    removeEvents() {
        const vm = this;
        vm.EE.removeListener('hssEditMode', this.handleEditMode, this);
    }

    handleEditMode(bool) {
        this.editMode = bool;
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
