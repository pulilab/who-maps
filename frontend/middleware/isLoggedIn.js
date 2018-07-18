import auth from './auth.js';

export default async function ({ store, req, redirect }) {
  const authOkay = await auth({ store, req });
  if (!authOkay) {
    redirect('/login');
  }
}
