import angular from 'angular';


class AddNewContentDialog {
    constructor($scope, $mdDialog, Upload, toast, content) {
        this.scope = $scope;
        this.cs = require('../CmsService');
        this.dialog = $mdDialog;
        this.upload = Upload;
        this.toast = toast;
        this.showTrixError = false;
        this.newContent = content;
        this.axes = require('../resources/domains');
    }

    cancel() {
        this.dialog.cancel();
    }

    submit() {
        if (this.form.$valid) {
            if (this.newContent.id) {
                this.cs.updateContent(this.newContent, this.upload);
            }
            else {
                this.cs.addContent(this.newContent, this.upload);
            }
            this.dialog.hide(this.newContent);
        }
        else {
            if (!this.newContent.textValid) {
                this.showTrixError = true;
            }
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
    }

    showAddNewContentDialog(event) {
        const content = this.toEdit ? Object.assign({}, this.toEdit) : {};
        this.dialog.show({
            controller: AddNewContentDialog.factory(content),
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
