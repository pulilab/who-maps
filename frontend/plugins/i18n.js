import Vue from 'vue';
import TranslateWrapper from '../components/TranslateWrapper';

Vue.component('translate', TranslateWrapper);

Vue.mixin({
  methods: {
    $gettext (word, parameters) {
      const locale = this.$i18n.locale;
      // safely search for translation string if not found default to word
      let msg = this.$i18n.messages &&
      this.$i18n.messages[locale] &&
      this.$i18n.messages[locale][word]
        ? this.$i18n.messages[locale][word]
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

export default function ({ app, store, $axios }) {
  const loadLocales = async (ln) => {
    if (!app.i18n.messages[ln]) {
      const { data } = await $axios.get('/translation/json/');
      app.i18n.setLocaleMessage(ln, data.catalog);
    }
  };
  loadLocales(store.state.i18n.locale);

  // beforeLanguageSwitch called right before setting a new locale
  app.i18n.beforeLanguageSwitch = (oldLocale, newLocale) => {
    loadLocales(newLocale);
  };

  // onLanguageSwitched called right after a new locale has been set
  app.i18n.onLanguageSwitched = (oldLocale, newLocale) => {
  };
};
