/* global define DEV, DEBUG */

// General imports
import angular from 'angular';
import uiRoute from 'angular-ui-router';
import ngMessages from 'angular-messages';
import 'angular-password';
import angularMd from 'angular-material';
import ngRedux from 'ng-redux';
import angularGettext from 'angular-gettext';
import { config } from './app-config';
import { run } from './app-run';

import './app.scss';

const singletonCollection = [];

window.addEventListener('singletonRegistered', evt => {
    singletonCollection.push(evt.detail);
});

const AppComponent = require('./appComponent');
const SystemController = require('./SystemController');

// MODULE REGISTRATION
angular.module('ngHtmlCompile', [])
  .directive('ngHtmlCompile', ['$compile', ($compile) => {
      return {
          restrict: 'A',
          link(scope, element, attrs) {
              scope.$watch(attrs.ngHtmlCompile, (newValue) => {
                  element.html(newValue);
                  $compile(element.contents())(scope);
              });
          }
      };
  }]);

angular.module('app',
    [
        uiRoute,
        angularMd,
        ngMessages,
        'ngPassword',
        'ngHtmlCompile',
        ngRedux,
        angularGettext,
        'Components',
        require('../Project/'),
        require('../Cms/'),
        require('../Dashboard/'),
        require('../Assessment/'),
        require('../LandingPage/'),
        require('../MapsToolkit/'),
        require('../MyProjects/')
    ]
)
  .controller('systemController', SystemController.systemControllerFactory())
  .component(AppComponent.name, AppComponent)
  .config(config)
  .run(run);


export default 'app';
