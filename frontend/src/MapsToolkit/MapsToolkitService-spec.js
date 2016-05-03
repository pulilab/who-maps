import MapsToolkitService from './MapsToolkitService';

/* global define, it, describe, expect, beforeEach, spyOn, Promise */
let mts = {};

const res = new window.Response('{"hello":"world"}', {
    status: 200,
    headers: {
        'Content-type': 'application/json'
    }
});
describe('MapsToolkitService', () => {

    beforeEach(() => {
        mts = new MapsToolkitService(0);
    });

    it('should have a function that return the project data', () => {
        spyOn(mts, 'get').and.returnValue(Promise.resolve(res));
        mts.getProjectData();
        expect(mts.get).toHaveBeenCalledWith('0/toolkit/data/');
    });

    it('should have a function that save the project data', () => {
        spyOn(mts, 'post').and.returnValue(Promise.resolve(res));
        mts.saveAnswer('answer');
        expect(mts.post).toHaveBeenCalledWith('0/toolkit/score/', 'answer');
    });

});
