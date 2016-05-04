import SearchableSelectionMenuController from './SearchableSelectionMenuController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn */

let sc = {};
const $timeout = arg => {
    arg();
};
const $scope = {
    $watch: (preFun, fun) => {
        preFun();
        fun(true);
    }
};

let tmp = void 0;
const $element = {
    find: () => {
        return [tmp];
    }
};

describe('searchableSelectionMenuController', () => {

    beforeEach(() => {
        spyOn(SearchableSelectionMenuController.prototype, 'initialization').and.callThrough();
        spyOn(SearchableSelectionMenuController.prototype, 'fixComma').and.callThrough();
        sc = SearchableSelectionMenuController.ssMenuFactory()($element, $timeout, $scope);
        tmp = document.createElement('span');
        tmp.innerHTML = 'a,b,c,d';
    });

    it('should have a function that initialize the comoponent', () => {
        spyOn(sc, 'prepareOptionsArray');
        spyOn(sc, 'watchers');
        sc.$onInit();
        expect(sc.initialization).toHaveBeenCalled();
        expect(sc.prepareOptionsArray).toHaveBeenCalled();
        expect(sc.fixComma).toHaveBeenCalled();
        expect(sc.watchers).toHaveBeenCalled();
    });

    it('should have a function that if the limit is set stop the content selection to the limit value', () => {
        sc.ngModel = [1, 2];
        sc.checkLimit();
        expect(sc.ngModel.length).toBe(2);
        sc.limit = 1;
        sc.checkLimit();
        expect(sc.ngModel.length).toBe(1);
    });

    it('should have a function that set some scope watchers', () => {
        spyOn(sc, 'prepareOptionsArray');
        spyOn(sc, 'checkLimit');
        sc.watchers();
        expect(sc.prepareOptionsArray).toHaveBeenCalled();
        expect(sc.checkLimit).toHaveBeenCalled();
    })

    it('should have a function that prepare the options array according to the input values', () => {
        sc.options = [1, 2];
        sc.prepareOptionsArray();
        expect(sc.fields[0][0][0]).toBe(1);
        sc.subOptions = ['sub'];
        sc.prepareOptionsArray();
        expect(sc.fields[0]).toBe(1)
    })

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
