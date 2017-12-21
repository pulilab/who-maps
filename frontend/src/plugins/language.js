import axios from './axios';
import moment from 'moment';
import fr from 'moment/locale/fr';
import es from 'moment/locale/es';
import pt from 'moment/locale/pt';

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

export const configureDates = ln => {
    const locales = {
        fr,
        es,
        pt
    };
    const localised = moment().locale(ln, locales[ln]);
    config.mdDateLocaleProvider.months = localised.localeData().months();
    config.mdDateLocaleProvider.shortMonths  = localised.localeData().monthsShort();
    config.mdDateLocaleProvider.days  = localised.localeData().weekdays();
    config.mdDateLocaleProvider.shortDays  = localised.localeData().weekdaysShort();
};

export const getLanguage = async () => {
    axios.setLanguageHeader(config.language);
    const { data } = await axios.get('/translation/json/');
    config.gettextCatalog.setCurrentLanguage(config.language);
    config.gettextCatalog.setStrings(config.language, data.catalog);
    exports.configureDates(config.language);
    config.scope.$digest();
};

export const setLanguage = ln => {
    config.language = ln;
    return exports.getLanguage();
};


window.LANG = config;
window.setLanguage = setLanguage;
