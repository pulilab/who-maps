import angular from 'angular';
import 'whatwg-fetch';
import './XHRMonitor';
import { StaticUtilities } from './Utilities';

// import { default as app } from './App/';
require.ensure([], require => {
    const app = require('./App/');
    angular.bootstrap(document, [app]);
});

StaticUtilities.prefixHtml();
