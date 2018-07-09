class SessionStorage {
  constructor () {
    this.storage = window.localStorage;
  }

  set (key, value) {
    if (typeof key !== 'string') {
      throw new TypeError('this.storage key should be a string!');
    }

    const val = typeof value === 'string'
      ? value
      : JSON.stringify(value);

    this.storage.setItem(key, val);
  }

  get (key) {
    try {
      return JSON.parse(this.storage.getItem(key));
    } catch (e) {
      return this.storage.getItem(key);
    }
  }

  remove (key) {
    this.storage.removeItem(key);
  }

  clear () {
    this.storage.clear();
  }

  // DEBUG
  check () {
    console.log('this.storage contains:\n');
    const ret = {};
    for (const key in this.storage) {
      console.log(key + ': ' + this.storage.getItem(key));
      ret[key] = this.storage.getItem(key);
    }
    return ret;
  }
}

export default SessionStorage;
