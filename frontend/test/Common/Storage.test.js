import SessionStorage from '../../src/Storage';
let store = {};
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('SessionStorage class', () => {
  test('is defined', () => {
    store = new SessionStorage();
    expect(store).toBeDefined();
  });

  test('can store and read data into/from localStorage', () => {
    store.set('a', 'asdf');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('a', 'asdf');
    store.get('a');
    expect(window.localStorage.getItem).toHaveBeenCalledWith('a');
  });

  test('throws a TypeError, if you\'re using a no-string key when storing', () => {
    expect(() => store.set(11, 'asdf')).toThrow();
  });

  test('can remove a key', () => {
    store.remove('a');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('a');
  });

  test('can clean the whole localStorage', () => {
    store.clear();
    expect(window.localStorage.clear).toHaveBeenCalled();
  });

  test('has a debug function, which returns and logs', () => {
    jest.spyOn(console, 'log').mockReturnValue(undefined);
    const ret = store.check();
    expect(console.log).toHaveBeenCalled();
    expect(typeof ret).toBe('object');
  });
});
