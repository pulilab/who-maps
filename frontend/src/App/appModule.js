// General imports
import angular from 'angular';
import 'angular-ui-router';
import 'angular-messages';
import 'angular-password';
import 'angular-material';
import 'ng-redux';
import 'angular-gettext';
import { config } from './app-config';
import { run } from './app-run';
import Project from '../Project/';
import Cms from '../Cms/';
import Dashboard from '../Dashboard/';
import Assessment from '../Assessment/';
import LandingPage from '../LandingPage/';
import MapsToolkit from '../MapsToolkit/';
import MyProjects from '../MyProjects/';
import AppComponent from './appComponent';
import SystemController from './SystemController';
import './app.scss';

const singletonCollection = [];

window.addEventListener('singletonRegistered', evt => {
  singletonCollection.push(evt.detail);
});

// MODULE REGISTRATION
angular.module('ngHtmlCompile', [])
  .directive('ngHtmlCompile', ['$compile', ($compile) => {
    return {
      restrict: 'A',
      link (scope, element, attrs) {
        scope.$watch(attrs.ngHtmlCompile, (newValue) => {
          element.html(newValue);
          $compile(element.contents())(scope);
        });
      }
    };
  }]);

angular.module('app',
  [
    'ui.router',
    'ngMaterial',
    'ngMessages',
    'ngPassword',
    'ngHtmlCompile',
    'ngRedux',
    'gettext',
    'Components',
    Project,
    Cms,
    Dashboard,
    Assessment,
    LandingPage,
    MapsToolkit,
    MyProjects
  ]
)
  .controller('systemController', SystemController.systemControllerFactory())
  .component(AppComponent.name, AppComponent)
  .config(config)
  .run(run);

export default 'app';
