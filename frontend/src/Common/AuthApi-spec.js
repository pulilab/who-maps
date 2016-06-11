import AuthApi from './AuthApi';
import _ from 'lodash';
import Storage from './Storage';

/* global define, it, describe, beforeEach, expect, xit, spyOn, Promise */

let aa = {};
const storage = new Storage();

describe('AuthApi class', () => {

    beforeEach(()=>{
        aa = new AuthApi();

        storage.set('token', 'something');
        const res = new window.Response('{"hello":"world"}', {
            status: 200,
            headers: {
                'Content-type': 'application/json'
            }
        });
        spyOn(window, 'fetch').and.returnValue(Promise.resolve(res));
    });

    it('should have a function that perform authenticated get request', () =>{
        aa.get('test');
        expect(window.fetch).toHaveBeenCalled();

    });

    it('should have a function that perform authenticated post request with json', () => {
        aa.post('test', {});
        expect(window.fetch).toHaveBeenCalled();
    });

    it('should have a function that perform authenticated post request with form data', () =>{
        const mockData = [{}];
        aa.postFormData('test', mockData);

        mockData[0].name = 'keyValue';
        aa.postFormData('test', mockData);

        mockData[0].value = 'valueValue';
        aa.postFormData('test', mockData);
        expect(window.fetch).toHaveBeenCalledTimes(1);
    });

    it('should have a convenient utility method that perform a post with a single payload data', () => {
        aa.postSingleFormData('test', 'key', 'value');
        expect(window.fetch).toHaveBeenCalled();
    });

    it('should have a function that convert an object in an array of key - value', () => {
        const mockObj = { 'one': 1 };
        const result = aa.objectConverter(mockObj);
        expect(_.isEqual(result, [{ name: 'one', value: 1 }])).toBeTruthy();
    });

    it('should have a function that retrieve a token from the session storage', () => {
        storage.clear();
        aa.retrieveToken(true);
        expect(aa.token).toBeNull();

        storage.set('token', 'something');
        aa.retrieveToken();
        expect(aa.token).toBe('something');
    });

    it('should have a function that return an Headers object with the Authentication token', () => {
        storage.set('token', 'something');
        const headers = aa.generateHeaders();
        expect(headers.get('Authorization')).toBe('Token something');
        expect(headers.get('content-type')).toBe('application/json');
    });

});
