import AuthApi from './AuthApi';

/* global define, it, describe, beforeEach, expect, xit, spyOn, Promise */

let aa = {};

describe('AuthApi class', () => {

    beforeEach(()=>{
        aa = new AuthApi();
        sessionStorage.setItem('token', 'something');
        const res = new window.Response('{"hello":"world"}', {
            status: 200,
            headers: {
                'Content-type': 'application/json'
            }
        });
        spyOn(window, 'fetch').and.returnValue(Promise.resolve(res));
    });

    it('should have a common property that represent and authenticated request', () => {
        expect(aa.request).toBeDefined();
    });

    it('should have a function that perform authenticated get request', () =>{
        aa.get('test');
        expect(window.fetch).toHaveBeenCalled();

    });

    it('should have a function that perform authenticated post request', () =>{
        const mockData = [{}];
        aa.post('test', mockData);

        mockData[0].name = 'keyValue';
        aa.post('test', mockData);

        mockData[0].value = 'valueValue';
        aa.post('test', mockData);
        expect(window.fetch).toHaveBeenCalledTimes(1);
    });

    it('should have a convenient utility method that perform a post with a single payload data', () => {
        aa.postSingle('test', 'key', 'value');
        expect(window.fetch).toHaveBeenCalled();
    });
    
    it('should have a function that retrieve a token from the session storage', () => {
        sessionStorage.clear();
        expect(aa.retrieveToken()).toBeNull();

        sessionStorage.setItem('token', 'something');
        expect(aa.retrieveToken()).toBe('something');
    });

    it('should have a function that return an Headers object with the Authentication token', () => {
        sessionStorage.setItem('token', 'something');
        const headers = aa.generateHeaders();
        expect(headers.get('HTTP_AUTHORIZATION')).toBe('something');
    });

});
