import SessionStorage from './Storage';

/* global define, it, describe, expect, xit, spyOn */

define('SessionStorage class', () => {

    it('is defined', () => {
        const store = new SessionStorage();
        expect(store).toBeDefined();
    });


    it('can store and read data into/from sessionStorage', () => {
        const store = new SessionStorage();
        spyOn(window.sessionStorage, 'setItem');
        store.set('a', 'asdf');
        expect(window.sessionStorage.setItem).toHaveBeenCalledWith('a', 'asdf');

        spyOn(window.sessionStorage, 'getItem');
        store.get('a');
        expect(window.sessionStorage.getItem).toHaveBeenCalledWith('a');
    });


    it('throws a TypeError, if you\'re using a no-string key when storing', () => {
        const store = new SessionStorage();
        expect(() => store.set(11, 'asdf')).toThrow();
    });


    it('can remove a key', () => {
        const store = new SessionStorage();
        spyOn(window.sessionStorage, 'removeItem');
        store.remove('a');
        expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('a');
    });


    it('can clean the whole sessionStorage', () => {
        const store = new SessionStorage();
        spyOn(window.sessionStorage, 'clear');
        store.clear();
        expect(window.sessionStorage.clear).toHaveBeenCalled();
    });


    it('has a debug function, which returns and logs', () => {
        const store = new SessionStorage();
        spyOn(console, 'log');
        const ret = store.check();
        expect(console.log).toHaveBeenCalled();
        expect(typeof ret).toBe('object');
    });


});
