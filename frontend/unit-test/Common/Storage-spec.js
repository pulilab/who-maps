import SessionStorage from '../../src/Common/Storage';

/* global define, it, describe, expect, xit, spyOn */

define('SessionStorage class', () => {

    it('is defined', () => {
        const store = new SessionStorage();
        expect(store).toBeDefined();
    });


    it('can store and read data into/from localStorage', () => {
        const store = new SessionStorage();
        spyOn(window.localStorage, 'setItem');
        store.set('a', 'asdf');
        expect(window.localStorage.setItem).toHaveBeenCalledWith('a', 'asdf');

        spyOn(window.localStorage, 'getItem');
        store.get('a');
        expect(window.localStorage.getItem).toHaveBeenCalledWith('a');
    });


    it('throws a TypeError, if you\'re using a no-string key when storing', () => {
        const store = new SessionStorage();
        expect(() => store.set(11, 'asdf')).toThrow();
    });


    it('can remove a key', () => {
        const store = new SessionStorage();
        spyOn(window.localStorage, 'removeItem');
        store.remove('a');
        expect(window.localStorage.removeItem).toHaveBeenCalledWith('a');
    });


    it('can clean the whole localStorage', () => {
        const store = new SessionStorage();
        spyOn(window.localStorage, 'clear');
        store.clear();
        expect(window.localStorage.clear).toHaveBeenCalled();
    });


    it('has a debug function, which returns and logs', () => {
        const store = new SessionStorage();
        spyOn(console, 'log');
        const ret = store.check();
        expect(console.log).toHaveBeenCalled();
        expect(typeof ret).toBe('object');
    });


});
