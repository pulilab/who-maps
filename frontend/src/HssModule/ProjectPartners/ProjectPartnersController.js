import _ from 'lodash';
import { Protected } from '../../Common/';
import ProjectPartnerService from './ProjectPartnersService';

class ProjectPartnersController extends Protected {

    constructor($scope, $state, Upload) {
        super();
        const vm = this;
        vm.scope = $scope;
        vm.state = $state;
        this.EE = window.EE;
        vm.pps = new ProjectPartnerService(Upload);
        vm.$onInit = vm.onInit.bind(vm);
        vm.$onDestroy = vm.onDestroy.bind(vm);
    }

    onDestroy() {
        const vm = this;
        vm.defaultOnDestroy();
        vm.removeEvents();
    }

    onInit() {
        const vm = this;
        vm.defaultOnInit();
        vm.bindEvents();
        this.editMode = false;
        this.logos = [];
        this.projectId = this.state.params.appName;
        this.pps.getLogoList(this.projectId).then(this.getLogoUrl.bind(this));
    }

    bindEvents() {
        this.EE.on('hssEditMode', this.handleEditMode, this);
    }

    removeEvents() {
        this.EE.removeListener('hssEditMode', this.handleEditMode, this);
    }

    handleEditMode(bool) {
        this.editMode = bool;
    }

    getLogoUrl(logos) {
        this.logos = logos;
        this.scope.$evalAsync();
    }

    delLogo(logo) {
        if (this.editMode) {
            this.pps.deleteLogo(logo.id)
                .then(() => {
                    this.logos = _.filter(this.logos, item => {
                        return item.id !== logo.id;
                    });
                    this.scope.$evalAsync();
                });

        }


    }


    uploadLogo(data) {
        this.projectId = this.state.params.appName;
        this.pps.uploadLogo(data, this.projectId)
            .then(response => {
                this.logos = _.concat(this.logos, response.data);
                this.scope.$evalAsync();
            });
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
