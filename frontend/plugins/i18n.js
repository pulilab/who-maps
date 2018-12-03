import Vue from 'vue';
import TranslateWrapper from '../components/TranslateWrapper';

Vue.component('translate', TranslateWrapper);

Vue.mixin({
  methods: {
    $gettext (word, parameters) {
      // safely search for translation string if not found default to word
      let msg = this.$i18n &&
      this.$i18n.locale &&
      this.$i18n.messages &&
      this.$i18n.messages[this.$i18n.locale] &&
      this.$i18n.messages[this.$i18n.locale][word]
        ? this.$i18n.messages[this.$i18n.locale][word]
        : word;

      if (parameters) {
        for (let k in parameters) {
          msg = msg.replace(`{${k}}`, parameters[k]);
        }
      }
      return msg;
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
