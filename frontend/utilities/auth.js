import Cookie from 'js-cookie';

export const safeSaveToken = (name, value) => {
  if (value) {
    if (process.client) {
      window.localStorage.setItem(name, value);
    }
    Cookie.set(name, value, { expires: 365 });
  }
};

export const saveToken = token => {
  if (process.SERVER_BUILD) return;
  safeSaveToken('jwt_token', token);
};

export const deleteToken = () => {
  if (process.SERVER_BUILD) { return; }
  if (process.client) {
    window.localStorage.removeItem('jwt_token');
  }
  Cookie.remove('jwt_token');
};

export const getValueFromCookie = (req, value) => {
  let result = req.headers.cookie.split(';').find(c => c.trim().startsWith(`${value}=`));
  return result ? result.split('=')[1] : null;
};

export const getTokenFromCookie = (req) => {
  if (!req.headers.cookie) { return; }
  const jwt = getValueFromCookie(req, 'jwt_token');
  return jwt;
};

export const getTokenFromLocalStorage = () => {
  const jwt = window.localStorage.getItem('jwt_token');
  return jwt;
};
