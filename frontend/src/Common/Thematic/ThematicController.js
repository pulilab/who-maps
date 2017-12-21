import angular from 'angular';
import SkeletonController from './SkeletonController.js';
import * as SystemModule from '../../store/modules/system';

class ThematicController {
    constructor($mdDialog, $scope, $ngRedux) {
        this.modal = $mdDialog;
        this.scope = $scope;
        this.$ngRedux = $ngRedux;
        this.$onInit = this.onInit.bind(this);


    }
    mapState(state) {
        const data = SystemModule.getDomainsForThematic(state);
        const icons = data.map((el, i) => require('./images/icon-axis' + (i - 1) + '.svg'));
        return {
            icons,
            data
        };
    }
    onInit() {
        this.$ngRedux.connect(this.mapState, null)(this);
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
        const thematic = ($mdDialog, $scope, $ngRedux) => {
            require('./Thematic.scss');
            return new ThematicController($mdDialog, $scope, $ngRedux);
        };
        thematic.$inject = ['$mdDialog', '$scope', '$ngRedux'];
        return thematic;
    }
}

export default ThematicController;
