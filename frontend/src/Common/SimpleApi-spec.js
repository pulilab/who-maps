import SimpleApi from './SimpleApi';

/* global define, it, describe, beforeEach, expect, xit, spyOn, Promise */

let aa = {};

describe('SimpleApi class', () => {

    beforeEach(()=>{
        aa = new SimpleApi();
        const res = new window.Response('{"hello":"world"}', {
            status: 200,
            headers: {
                'Content-type': 'application/json'
            }
        });
        spyOn(window, 'fetch').and.returnValue(Promise.resolve(res));
    });

    it('should have a common property that represent a request', () => {
        expect(aa.request).toBeDefined();
    });

    it('should have a function that perform get request', () =>{
        aa.get('test');
        expect(window.fetch).toHaveBeenCalled();

    });

    it('should have a function that perform post request with json', () => {
        aa.post('test', {});
        expect(window.fetch).toHaveBeenCalled();
    });

    it('should have a function that return an Headers object with the Authentication token', () => {
        const headers = aa.generateHeaders();
        expect(headers.get('content-type')).toBe('application/json');
    });

});
