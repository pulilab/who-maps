import angular from 'angular';
import SkeletonController from './SkeletonController.js';
import mock from './mockStructure.js';

class ThematicController {
    constructor($mdDialog, $scope) {
        this.modal = $mdDialog;
        this.data = mock;
        this.scope = $scope;
        this.icons = this.data.map((el, i) => require('./images/icon-axis' + (i - 1) + '.svg'));

    }
    showModal() {
        this.axis = parseInt(this.axis, 10);
        this.domain = parseInt(this.domain, 10);
        this.modal.show({
            parent: angular.element(document.body),
            template: require('./modal-skeleton.html'),
            controller: SkeletonController.skeletonFactory(this.data, this.axis, this.domain, this.icons),
            controllerAs: 'vm',
            clickOutsideToClose: true,
            fullScreen: true
        });
    }

    static thematicFactory() {
        const thematic = ($mdDialog, $scope) => {
            require('./Thematic.scss');
            return new ThematicController($mdDialog, $scope);
        };
        thematic.$inject = ['$mdDialog', '$scope'];
        return thematic;
    }
}

export default ThematicController;
