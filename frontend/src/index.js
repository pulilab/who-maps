import angular from 'angular';
import './plugins/index';
import { StaticUtilities } from './Utilities';

/* global define LIVE */

if (LIVE) {
    const Raven = require('raven-js');
    Raven.config('https://cea32567f8aa4eefa4d2051848d37dea@sentry.vidzor.com/12')
      .install();

    window.onunhandledrejection = (event) => {
        Raven.captureException(event.reason);
    };
}


const appPromise = import('./App/');
const commonPromise = import('./Common/');

Promise.all([appPromise, commonPromise]).then(([app, common]) => {
    common.EE.initialize();
    angular.bootstrap(document, [app]);
});


StaticUtilities.prefixHtml();


