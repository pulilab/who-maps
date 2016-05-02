import angular from 'angular';
const template_ = require('./modal-skeleton.html');
import mock from './mockStructure.js';

class ThematicController {
    constructor($mdDialog) {

        // this.axis
        // this.domain
        this.EE = window.EE;
        this.modal = $mdDialog;
        this.data = mock;

    }

    showModal() {

        this.modal.show({
            parent: angular.element(document.body),
            template: template_,
            controllerAs: 'vm',
            bindToController: true,
            clickOutsideToClose: true,
            controller: () => null,
            fullScreen: true,
            locals: {
                'axis': this.axis,
                'domain': this.domain,
                'data': this.data
            }
        });
    }

    static thematicFactory() {
        const thematic = ($mdDialog) => {
            require('./Thematic.scss');
            return new ThematicController($mdDialog);
        };
        thematic.$inject = ['$mdDialog'];
        return thematic;
    }
}

export default ThematicController;
