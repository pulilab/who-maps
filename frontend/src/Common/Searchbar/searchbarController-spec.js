import SearchbarController from './SearchbarController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn */

let sb = {};

describe('Searchbar Components controller', () => {

    beforeEach(() => {
        sb = SearchbarController.searchbarFactory()();
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

});
