import angular from 'angular';
import  Protected from '../../Common/Protected';


class AddNewContentDialog {
    constructor($scope, $mdDialog, Upload, toast, content, isSuperUser) {
        this.cs = require('../CmsService');
        this.axes = require('../resources/domains');
        this.scope = $scope;
        this.dialog = $mdDialog;
        this.upload = Upload;
        this.toast = toast;
        this.showTrixError = false;
        this.disableSubmit = false;
        this.newContent = content;
        this.isSuperUser = isSuperUser;
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

    beforeImageSelect() {
        this.disableSubmit = true;
    }

    imageSelected() {
        this.disableSubmit = false;
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


    static factory(content, isSuperUser) {

        function addNewContent($scope, $mdDialog, Upload, $mdToast) {
            return new AddNewContentDialog($scope, $mdDialog, Upload, $mdToast, content, isSuperUser);
        }

        addNewContent.$inject = ['$scope', '$mdDialog', 'Upload', '$mdToast'];
        return addNewContent;
    }
}

class AddNewContentController extends Protected {

    constructor($scope, $mdDialog) {
        super();
        this.scope = $scope;
        this.dialog = $mdDialog;
        this.defaultOnInit();
    }

    showAddNewContentDialog(event) {
        const content = this.toEdit ? Object.assign({}, this.toEdit) : {};

        if (!this.isSuperUser && !this.toEdit) {
            content.type = 1;
        }

        this.dialog.show({
            controller: AddNewContentDialog.factory(content, this.isSuperUser),
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
export { AddNewContentDialog };
