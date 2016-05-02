import angular from 'angular';
const template_ = require('./modal-skeleton.html');

class ThematicController {
    constructor($mdDialog) {

        // this.axis
        // this.domain
        this.EE = window.EE;
        this.modal = $mdDialog;

    }

    showModal() {
        console.log('should show modal for' + this.axis + '/' + this.domain);

        this.modal.show({
            parent: angular.element(document.body),
            template: template_,
            controllerAs: 'vm',
            bindToController: true,
            clickOutsideToClose: true,
            controller: () => null,
            locals: {
                'axis': this.axis,
                'domain': this.domain
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
