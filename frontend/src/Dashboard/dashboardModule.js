import angular from 'angular';
import DashboardModuleController from './DashboardModuleController';
import linechart from './Linechart/linechart';
import countrymap from './Countrymap/countrymap';

import _template from './Dashboard.html';
import './Dashboard.scss';
import uiRoute from 'angular-ui-router';

const moduleName = 'dashboard';

function config($stateProvider) {
    $stateProvider
        .state(moduleName,
        {
            url: '/dashboard',
            parent: 'app',
            views: {
                main: {
                    template: _template,
                    controller: moduleName + '.' + moduleName + 'Controller',
                    controllerAs: 'vm'
                }
            }
        });
}

config.$inject = ['$stateProvider'];

angular.module(moduleName, [uiRoute])
    .controller(moduleName + '.' + moduleName + 'Controller', DashboardModuleController)
    .component('linechart', linechart)
    .component('countrymap', countrymap)
    .config(config);

export default moduleName;
