import Vue from 'vue';
import TranslateWrapper from '../components/TranslateWrapper';

Vue.component('translate', TranslateWrapper);

Vue.mixin({
  methods: {
    $gettext (word, parameters) {
      return this.$t(word, parameters);
    }
  }
});

Vue.filter('translate', value => value);

export default function ({ app }) {
  // beforeLanguageSwitch called right before setting a new locale
  app.i18n.beforeLanguageSwitch = (oldLocale, newLocale) => {
  };
  // onLanguageSwitched called right after a new locale has been set
  app.i18n.onLanguageSwitched = (oldLocale, newLocale) => {
  };
};
