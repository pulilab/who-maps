import angular from 'angular';
import 'whatwg-fetch';
import './XHRMonitor';
import { StaticUtilities } from './Utilities';

/* global define LIVE */

if (LIVE) {
    const Raven = require('raven-js');
    Raven.config('http://cea32567f8aa4eefa4d2051848d37dea@sentry.vidzor.com/12')
        .install();

    window.onunhandledrejection = (event) => {
        Raven.captureException(event.reason);

    };
}

// import { default as app } from './App/';
require.ensure([], require => {
    const app = require('./App/');
    angular.bootstrap(document, [app]);
});

StaticUtilities.prefixHtml();
