import EventEmitter from 'eventemitter3';

class EE {
  constructor () {
    window.EE = new EventEmitter();
  }

  static initialize () {
    return new EE();
  }
}

export default EE;
