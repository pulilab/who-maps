import _ from 'lodash';
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
        this.logos = [];
        this.projectId = this.state.params.appName;
        this.pps.getLogoList(this.projectId)
            .then(this.getLogoUrl.bind(this));

        this.editMode = false;
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
