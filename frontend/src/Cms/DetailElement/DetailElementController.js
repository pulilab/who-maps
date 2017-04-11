import angular from 'angular';

class DetailElementDialog {
    constructor($scope, $mdDialog, content) {
        this.scope = $scope;
        this.dialog = $mdDialog;
        this.content = content;
    }

    cancel() {
        this.dialog.cancel();
    }


    static factory(content) {

        function detailElement($scope, $mdDialog) {
            return new DetailElementDialog($scope, $mdDialog, content);
        }

        detailElement.$inject = ['$scope', '$mdDialog'];
        return detailElement;
    }
}

class DetailElementController {

    constructor($mdDialog) {
        this.dialog = $mdDialog;
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
    }


    showDetailDialog(event) {
        const self = this;
        this.dialog.show({
            controller: DetailElementDialog.factory(self.item),
            controllerAs: 'vm',
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
