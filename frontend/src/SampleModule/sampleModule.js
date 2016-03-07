import SampleController from './SampleModuleController';
import SampleComponent from './SampleComponent/sampleComponent';


import sampleTemplate from './SampleModule.html';
import uiRoute from 'angular-ui-router';

var moduleName='sampleModule';



function config($stateProvider, $urlRouterProvider){
    $stateProvider
        .state(moduleName,
            {
                url: '/sampleModule',
                template: sampleTemplate,
                controller:'sampleModule.sampleModuleController',
                controllerAs:'vm'
            });
    $urlRouterProvider.otherwise('/sampleModule');


}

config.$inject = ['$stateProvider', '$urlRouterProvider'];


var app = angular.module(moduleName, [uiRoute])
    .controller('sampleModule.sampleModuleController', SampleController)
    .component('sampleComponent', SampleComponent)
    .config(config)
    //.run(debugRouter);


function debugRouter($rootScope) {
    $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
        console.log('$stateChangeStart to '+toState.to+'- fired when the transition begins. toState,toParams : \n',toState, toParams);
    });
    $rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams, error){
        console.log('$stateChangeError - fired when an error occurs during transition.');
        console.log(arguments);
    });
    $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
        console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.');
    });
    $rootScope.$on('$viewContentLoaded',function(event){
        console.log('$viewContentLoaded - fired after dom rendered',event);
    });
    $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
        console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
        console.log(unfoundState, fromState, fromParams);
    });
}




export default moduleName;