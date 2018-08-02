import angular from 'angular';
import './plugins/index';
import { StaticUtilities } from './Utilities';

/* global LIVE */

let storeInstance = null;

const storeFetcher = () => {
  if (storeInstance) {
    return storeInstance.getState();
  }
  return undefined;
};

window.addEventListener('storeSetupReady', event => {
  if (event && event.detail) {
    storeInstance = event.detail;
  }
});

const storeFilter = store => {
  try {
    return {
      countries: {
        countryFields: { ...store.countries.countryFields },
        currentCountry: { ...store.countries.currentCountry },
        currentCountryDistricts: { ...store.countries.currentCountryDistricts },
        currentCountryDistrictsProjects: { ...store.countries.currentCountryDistrictsProjects },
        currentCountryProjects: { ...store.countries.currentCountryProjects }
      },
      projects: { ...store.projects },
      user: { ...store.user }
    };
  } catch (e) {
    return e;
  }
};

if (LIVE) {
  const Raven = require('raven-js');
  Raven.config('https://cea32567f8aa4eefa4d2051848d37dea@sentry.vidzor.com/12',
    {
      dataCallback: (data) => {
        const store = storeFetcher();
        if (store) {
          data.extra.store = JSON.parse(JSON.stringify(storeFilter(store)));
        }
        return data;
      }
    })
    .install();

  window.onunhandledrejection = (event) => {
    Raven.captureException(event.reason);
  };
}

/* translation-unfriendly-code */
const appPromise = import('./App/');
const commonPromise = import('./Common/');

Promise.all([appPromise, commonPromise]).then(([app, common]) => {
  common.EE.initialize();
  angular.bootstrap(document, ['app']);
});

/* end-translation-unfriendly-code */

StaticUtilities.prefixHtml();
