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
        this.icons = this.data.map((el, i) => require('./images/icon-axis' + (i - 1) + '.svg'));
        // console.log(this.icons);

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
                'data': this.data,
                'text': this.text,
                'icons': this.icons
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
