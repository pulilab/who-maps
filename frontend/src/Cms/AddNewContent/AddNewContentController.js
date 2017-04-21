import angular from 'angular';


class AddNewContentDialog {
    constructor($scope, $mdDialog, Upload, toast, body) {
        this.scope = $scope;
        this.cs = require('../CmsService');
        this.dialog = $mdDialog;
        this.upload = Upload;
        this.toast = toast;
        this.newContent = {
            type: null,
            domain: null,
            name: null,
            cover: null,
            body,
            textValid: false
        };
        this.axes = require('../resources/domains');
    }

    cancel() {
        this.dialog.cancel();
    }

    disableSubmit() {
        return !this.newContent.textValid;
    }

    submit() {
        if (this.form.$valid) {
            this.cs.addContent(this.newContent, this.upload);
            this.dialog.hide(this.newContent);
        }
        else {
            this.showToast('Validation error');
        }
    }

    showToast(text) {
        this.toast.show(
          this.toast.simple()
            .parent(window.document.querySelector('md-dialog'))
            .textContent(text)
            .position('bottom right')
            .hideDelay(3000)
        );
    }


    static factory(content) {

        function addNewContent($scope, $mdDialog, Upload, $mdToast) {
            return new AddNewContentDialog($scope, $mdDialog, Upload, $mdToast, content);
        }

        addNewContent.$inject = ['$scope', '$mdDialog', 'Upload', '$mdToast'];
        return addNewContent;
    }
}

class AddNewContentController {

    constructor($scope, $mdDialog) {
        this.scope = $scope;
        this.dialog = $mdDialog;
        this.newContent = null;
    }

    showAddNewContentDialog(event) {
        const self = this;
        this.dialog.show({
            controller: AddNewContentDialog.factory(self.newContent),
            controllerAs: 'vm',
            template: require('./AddNewContentDialog.html'),
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:true
        });
    }


    static factory() {
        require('./AddNewContent.scss');

        function addNewContent($scope, $mdDialog) {
            return new AddNewContentController($scope, $mdDialog);
        }

        addNewContent.$inject = ['$scope', '$mdDialog'];
        return addNewContent;
    }
}

export default AddNewContentController;
