import Vue from 'vue';
import VeeValidate from 'vee-validate';

// Needed this, because encountered: https://github.com/ElemeFE/element/issues/4720
const config = {
  // aria: true,
  // classNames: {},
  // classes: false,
  // delay: 0,
  // dictionary: null,
  // errorBagName: 'errors', // change if property conflicts
  // events: 'input|blur',
  fieldsBagName: 'fieldsBag'
  // i18n: null, // the vue-i18n plugin instance
  // i18nRootKey: 'validations', // the nested key under which the validation messages will be located
  // inject: true,
  // locale: 'en',
  // strict: true,
  // validity: false,
};

Vue.use(VeeValidate, config);
