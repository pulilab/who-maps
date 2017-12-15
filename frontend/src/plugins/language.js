import axios from './axios';

const navigator = window.navigator;
const language  = navigator.languages && navigator.languages[0] ||
  navigator.language ||
  navigator.userLanguage;

export const config = {
    gettextCatalog: {},
    language,
    scope: {},
    mdDateLocaleProvider: {}
};

export const setCatalog = catalog => {
    config.gettextCatalog = catalog;
};

export const setScope = scope => {
    config.scope = scope;
};

export const setDateLocaleProvider = provider => {
    config.mdDateLocaleProvider  = provider;
};

export const configureDates = catalog => {
    const c = catalog.catalog;
    if (c.January) {
        config.mdDateLocaleProvider.months = [c.January, c.February, c.March, c.April, c.May, c.June,
            c.July, c.August, c.September, c.October, c.November, c.December];
        config.mdDateLocaleProvider.shortMonths  = config.mdDateLocaleProvider.months.map(m => m.slice(0, 4));
    }
};

export const getLanguage = async () => {
    axios.setLanguageHeader(config.language);
    const { data } = await axios.get('/translation/json/');
    config.gettextCatalog.setCurrentLanguage(config.language);
    config.gettextCatalog.setStrings(config.language, data.catalog);
    exports.configureDates(data);
    config.scope.$digest();
};

export const setLanguage = ln => {
    config.language = ln;
    return exports.getLanguage();
};


window.LANG = config;
window.setLanguage = setLanguage;
