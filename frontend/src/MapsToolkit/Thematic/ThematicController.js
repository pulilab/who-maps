import angular from 'angular';
import SkeletonController from './SkeletonController.js';
const template_ = require('./modal-skeleton.html');
import mock from './mockStructure.js';

class ThematicController {
    constructor($mdDialog, $scope) {

        // this.axis
        // this.domain
        this.modal = $mdDialog;
        this.data = mock;
        this.scope = $scope;
        this.images = this.importIconTemplates();
        this.icons = this.data.map((el, i) => require('./images/icon-axis' + (i - 1) + '.svg'));

    }

    importIconTemplates() {
        // Import the whole folder in an collection of string templates, needed for proper webpack optimizations
        const templates = {};
        const templateRequire = require.context('./images/', true, /\.svg$/);
        templateRequire.keys().forEach((item) => {
            const key = item.split('.')[1].replace('/', '');
            templates[key] = templateRequire(item);
        });
        console.log(templates);
        return templates;
    }

    image(key) {
      console.log(key)
      return this.images[key];
    }

    showModal() {

        // https://github.com/angular/material/issues/455
        // https://github.com/angular/material/issues/1016
        // etc... binding here is meant to be solved with scopes
        const scopeToPass = this.scope.$new(false, this.scope);

        this.modal.show({

            parent: angular.element(document.body),
            template: template_,
            controller: SkeletonController.skeletonFactory(),
            controllerAs: 'vm',
            scope: scopeToPass,
            bindToController: true,
            locals: {
                'axis': this.axis,
                'domain': this.domain,
                'data': this.data,
                'text': this.text,
                'icons': this.icons
            },
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
