/* eslint prefer-promise-reject-errors: 0 */
import { state, getters, actions, mutations } from '~/store/user';
import { mockAxios } from '../utils'; ;

test('user state is unique between calls', () => {
  const s = state();
  expect(s).not.toBe(state());
  expect(s).toEqual(state());
});

describe('getters', () => {
  let s = null;

  beforeEach(() => {
    s = state();
  });

  test('getCsrfToken', () => {
    expect(getters.getCsrfToken(s)).toEqual(s.csrfToken);
  });
});

describe('actions', () => {
  const vuex = {};

  beforeEach(() => {
    vuex.commit = jest.fn();
    vuex.dispatch = jest.fn();
    vuex.getters = {};
    vuex.state = state();
    actions.$axios = mockAxios();
  });

  test('setCsrfToken', async () => {
    await actions.setCsrfToken(vuex, null);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_CSRF_TOKEN', null]);

    await actions.setCsrfToken(vuex, 1);
    expect(vuex.commit.mock.calls[1]).toEqual(['SET_CSRF_TOKEN', 1]);
  });
});

describe('mutations', () => {
  test('SET_CSRF_TOKEN', () => {
    const s = {};
    mutations.SET_CSRF_TOKEN(s, 1);
    expect(s.csrfToken).toEqual(1);
  });
});
