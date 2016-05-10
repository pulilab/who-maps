import SearchbarController from './SearchbarController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn */

let sb = {};

const $scope = {
    $watch: jasmine.createSpy('watch')
};

const $state = {

};

describe('Searchbar Components controller', () => {

    beforeEach(() => {
        sb = SearchbarController.searchbarFactory()($state, $scope);
        sb.$onInit();
    });

    it('can be initiated', () => {
        expect(sb).toBeDefined();
        expect(typeof sb).toBe('object');
    });

    it('fetches basic information about search results', () => {
        expect(typeof sb.filters).toBe('object');
        expect(typeof sb.resultNr).toBe('number');
        expect(Array.isArray(sb.projects)).toBe(true);
    });

    it('should have a function that toggle the showSearch', () => {
        expect(sb.showSearch).toBe(false);
        sb.toggleSearch();
        expect(sb.showSearch).toBe(true);
    });

    it('should have a function that perform a search', () => {
        spyOn(sb.ss, 'searchProject').and.returnValue(Promise.resolve());
        sb.search('yolo');
        expect(sb.ss.searchProject).not.toHaveBeenCalled();
        sb.filters[0].active = true;
        sb.search('swag');
        expect(sb.ss.searchProject).toHaveBeenCalledTimes(1);
    });

});
