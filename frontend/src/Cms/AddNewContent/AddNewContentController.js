import angular from 'angular';


class AddNewContentDialog {
    constructor($scope, $mdDialog, content) {
        this.scope = $scope;
        this.dialog = $mdDialog;
        this.newContent = content;
        this.axes = require('../resources/domains');
    }

    cancel() {
        this.dialog.cancel();
    }

    submit() {
        this.dialog.hide(this.newContent);
    }


    static factory(content) {

        function addNewContent($scope, $mdDialog) {
            return new AddNewContentDialog($scope, $mdDialog, content);
        }

        addNewContent.$inject = ['$scope', '$mdDialog'];
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
        }).then(answer => {
            console.debug(answer);
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
