import SearchableSelectionMenuController from './SearchableSelectionMenuController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn */

let sc = {};
const $timeout = arg => {
    arg();
};
let tmp = void 0;

describe('searchableSelectionMenuController', () => {

    beforeEach(() => {
        sc = SearchableSelectionMenuController.ssMenuFactory()(null, $timeout);
        sc.element = {
            find: () => {
                return [tmp];
            }
        };
        tmp = document.createElement('span');
        tmp.innerHTML = 'a,b,c,d';
    });

    it('should have a function that stop events immediate propagation', () => {
        const eventSpy = jasmine.createSpy('eventSpy');
        const mockEvent = document.createEvent('Event');
        mockEvent.initEvent('mock', true, true);
        window.addEventListener('mock', sc.searchKey);
        window.addEventListener('mock', eventSpy);
        window.dispatchEvent(mockEvent);
        expect(eventSpy).not.toHaveBeenCalled();
    });

    it('should have a function that set the open flag to true', () => {
        expect(sc.isOpen).toBeFalsy();
        sc.selectOpen();
        expect(sc.isOpen).toBeTruthy();
    });

    it('should call the onOpenCallback when the select get open', () => {
        const spy = jasmine.createSpy('onOpen');
        sc.onOpenCallback = spy;
        sc.selectOpen();
        expect(sc.onOpenCallback).toHaveBeenCalled();
    });

    it('should have a function that set the open flag to false and call the fix comma function', () => {
        spyOn(sc, 'fixComma');
        sc.isOpen = true;
        sc.selectClose();
        expect(sc.isOpen).toBeFalsy();
        expect(sc.fixComma).toHaveBeenCalled();
    });

    it('should call the onOpenCallback when the select get close', () => {
        const spy = jasmine.createSpy('onclose');
        sc.onCloseCallback = spy;
        sc.selectClose();
        expect(sc.onCloseCallback).toHaveBeenCalled();
    });

    it('should have a function that remove commas from a underlying span when replaceComma is true', () => {
        sc.replaceComma = true;
        sc.fixComma();
        expect(tmp.innerHTML).not.toContain(',');
    });

    it('should have a function that remove commas from a underlying span only when replaceComma is true', () => {
        sc.replaceComma = false;
        sc.fixComma();
        expect(tmp.innerHTML).toContain(',');
    });
});
