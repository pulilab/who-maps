import auth from './auth.js';

export default async function ({ store, req, redirect, app }) {
  const authOkay = await auth({ store, req });
  if (!authOkay) {
    redirect('/en/login');
  }
}
