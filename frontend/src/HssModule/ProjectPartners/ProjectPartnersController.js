import { partnerLogoUrls } from '../hssMockData';

class ProjectPartnersController {

    constructor($scope, $timeout) {

        const vm = this;

        $timeout(() => {
            vm.scope = $scope;
            vm.EE = window.EE;
            vm.file = document.getElementById('file-input');
            window.fileChange = vm.fileChange;

            vm.EE.on('hssEditMode', bool => {
                vm.editMode = bool;
            });

            vm.EE.on('uploadLogo', file => {
                vm.uploadLogo(file);
            });

            vm.editMode = false;
            vm.logos = partnerLogoUrls;
        });
    }

    delLogo(logo) {

        if (this.editMode) {
            this.logos = this.logos.filter(l => l !== logo);
        }

        // backend update...
    }

    // It gets out to the global, because Angular doesn't let binding to the file,
    // so ng-change isn't working
    fileChange() {

        const fileElement = document.getElementById('file-input');
        const fileObj = fileElement ? fileElement.files[0] : null;

        if (fileObj) {
            window.EE.emit('uploadLogo', fileObj);
        }
    }

    uploadLogo(/* fileObj */) {

        // upload to API...

        // refresh view/img sources from API...
    }

    static projectPartnersFactory() {
        require('./ProjectPartners.scss');
        function project($scope, $timeout) {
            return new ProjectPartnersController($scope, $timeout);
        }

        project.$inject = ['$scope', '$timeout'];

        return project;
    }
}

export default ProjectPartnersController;
