import auth from './auth.js';

export default async function ({ store, req, redirect }) {
  // const gotMessages = store.state.i18n.messages && Object.keys(store.state.i18n.messages).length;
  // if (!gotMessages) {
  //   const { data } = await $axios.get('/translation/json/');
  //   store.dispatch('i18n/setMessages', data.catalog);
  //   console.log(store.state.i18n.messages);
  //   console.log('Messages store populated at:', new Date());
  // }

  // const { data } = await $axios.get('/translation/json/');
  // app.i18n.setLocaleMessage(store.state.i18n.locale, data.catalog);
  // // console.log(app.i18n);
  // console.log('2');

  const authOkay = await auth({ store, req });
  if (!authOkay) {
    redirect('/login');
  }
}
