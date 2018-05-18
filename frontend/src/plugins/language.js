import axios from './axios';
import moment from 'moment';
import 'moment/locale/fr';
import 'moment/locale/pt';
import 'moment/locale/es';

const navigator = window.navigator;
const language = (navigator.languages && navigator.languages[0]) ||
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
  config.mdDateLocaleProvider = provider;
};

export const configureDates = async ln => {
  moment.locale(ln);
  const localised = moment();
  config.mdDateLocaleProvider.months = localised.localeData().months();
  config.mdDateLocaleProvider.shortMonths = localised.localeData().monthsShort();
  config.mdDateLocaleProvider.days = localised.localeData().weekdays();
  config.mdDateLocaleProvider.shortDays = localised.localeData().weekdaysShort();
  window.moment = localised;
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

export const getCurrentLanguage = () => {
  return config.language;
};
