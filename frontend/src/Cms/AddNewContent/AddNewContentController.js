import angular from 'angular';

class AddNewContentController {

    constructor($mdDialog) {
        this.dialog = $mdDialog;
    }


    showAddNewContentDialog(event) {
        this.dialog.show({
            controller: AddNewContentController.factory(),
            template: require('./AddNewContentDialog.html'),
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:true
        });
    }

    static factory() {
        require('./AddNewContent.scss');

        function addNewContent($mdDialog) {
            return new AddNewContentController($mdDialog);
        }

        addNewContent.$inject = ['$mdDialog'];
        return addNewContent;
    }
}

export default AddNewContentController;
