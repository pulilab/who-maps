
export default function ({ app, store, $axios }) {
  const loadLocales = async (ln) => {
    if (!app.i18n.messages[ln]) {
      const { data } = await $axios.get('/translation/json/');
      app.i18n.setLocaleMessage(ln, data.catalog);
      console.log('LOADING: ', ln);
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
}
