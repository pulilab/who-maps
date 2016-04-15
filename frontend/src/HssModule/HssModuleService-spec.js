import HssModuleService from './HssModuleService';

/* global define, it, describe, beforeEach, expect, xit, spyOn, Promise */

let hs = {};
const res = new window.Response('{"hello":"world"}', {
    status: 200,
    headers: {
        'Content-type': 'application/json'
    }
});

describe('HssModuleService class', () => {

    beforeEach(()=>{
        hs = new HssModuleService(1);
        spyOn(window, 'fetch').and.returnValue(Promise.resolve(res));
    });

    it('should have a function that perform a get'
    + 'request on the structure api', () => {
        spyOn(hs, 'get');
        hs.getStructure();
        expect(hs.get).toHaveBeenCalled();
    });

    it('should have a function that perform a get'
    + 'request on the data api', () => {
        spyOn(hs, 'get');
        hs.getData();
        expect(hs.get).toHaveBeenCalled();
    });

    it('should have a function that perform a post'
    + 'request on the continuum api', () => {
        spyOn(hs, 'post');
        const mockData = {
            colSpan: 2,
            columnId: 0
        };
        hs.postContinuum(mockData);
        expect(hs.post).toHaveBeenCalledTimes(2);
    });

    it('should have a function that perform a post'
    + 'request on the interventions api', () => {
        spyOn(hs, 'post');
        hs.postInterventions(0, []);
        expect(hs.post).toHaveBeenCalled();
    });

    it('should have a function that perform a post'
    + 'request on the bubbles api', () => {
        spyOn(hs, 'post');
        hs.postBubbles([]);
        expect(hs.post).toHaveBeenCalled();
    });

    it('should have a function that perform a post'
    + 'request on the constraints api', () => {
        spyOn(hs, 'post');
        hs.postConstraints([]);
        expect(hs.post).toHaveBeenCalled();
    });

    it('should have a function that perform a post'
    + 'request on the taxonomy api', () => {
        spyOn(hs, 'post');
        hs.postTaxonomy(null, null, 'asd');
        expect(hs.post).toHaveBeenCalled();
        hs.postTaxonomy(null, null, []);
        expect(hs.post).toHaveBeenCalledTimes(1);
    });

});
