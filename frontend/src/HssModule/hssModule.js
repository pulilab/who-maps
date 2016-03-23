import angular from 'angular';
import uiRoute from 'angular-ui-router';
import ngMaterial from 'angular-material';

import HssModuleController from './HssModuleController';
import Continuum from './Continuum/';
import Interventions from './Interventions/';
import Constraints from './Constraints/';
import ProjectScale from './ProjectScale/';
import ProjectPartners from './ProjectPartners';

import hssTemplate from './HssModule.html';
import './hssModule.scss';

const moduleName = 'hssModule';

function config($stateProvider) {
    $stateProvider
        .state(moduleName, {
            url: '/hss',
            parent: 'app',
            views: {
                main: {
                    template: hssTemplate,
                    controller: moduleName + '.hssModuleController',
                    controllerAs: 'vm'
                }
            }
        });

}

config.$inject = ['$stateProvider'];

angular.module(moduleName,
    [
        uiRoute,
        ngMaterial
    ])
    .controller(moduleName + '.hssModuleController', HssModuleController)
    .component(Continuum.name, Continuum)
    .component(Interventions.name, Interventions)
    .component(Constraints.name, Constraints)
    .component(ProjectScale.name, ProjectScale)
    .component(ProjectPartners.name, ProjectPartners)
    .config(config);

export default moduleName;
