export const state = () => ({
  csrfToken: null
});

export const getters = {
  getCsrfToken: state => {
    return state.csrfToken;
  }
};

export const actions = {
};

export const mutations = {
  SET_CSRF_TOKEN: (state, token) => {
    state.csrfToken = token;
  }
};
