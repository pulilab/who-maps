import angular from 'angular';

class DetailElementController {

    constructor($mdDialog) {
        this.dialog = $mdDialog;
    }


    showDetailDialog(event) {
        this.dialog.show({
            controller: DetailElementController.factory(),
            template: require('./DetailElementDialog.html'),
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:true
        });
    }

    static factory() {
        require('./DetailElement.scss');

        function detailElement($mdDialog) {
            return new DetailElementController($mdDialog);
        }

        detailElement.$inject = ['$mdDialog'];
        return detailElement;
    }
}

export default DetailElementController;
