import CustomCountryService from './CustomCountryService';

/* global define, it, describe, beforeEach, expect, xit, spyOn, Promise, jasmine */

let service = null;

const countries = {
    ug: {
        code: 'ug',
        mapData: 'someMapData'
    }
};

describe('CustomCountryService class', () => {

    beforeEach(()=>{
        service = CustomCountryService;
        service.countryLib = {};
    });

    it('should have a function that return the subDomain or a default', () => {
        const result = service.getSubDomain();
        expect(result).toBe('who');
    });

    it('should have a function that get the country', (done) => {
        spyOn(service, 'getCountriesList').and.returnValue(Promise.resolve(countries));
        service.getCountry('ug').then((value)=>{
            expect(value.code).toBe('ug');
        });
        service.countryLib = countries;
        service.getCountry('ug').then((value)=>{
            expect(value.code).toBe('ug');
            expect(service.getCountriesList).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('should have a function to remove the map data from an array of countries', ()=> {
        const countryArray = [countries.ug];
        const result = service.stripMapData(countryArray);
        expect(result[0].mapData).toBeNull();
    });

    it('should have a function to get an array of countries WITHOUT the map data', (done)=> {
        spyOn(service, 'stripMapData').and.returnValue([countries.ug]);
        spyOn(service, 'getCountriesList').and.returnValue(Promise.resolve(countries));
        service.getCountries().then(result => {
            expect(result[0].code).toBe('ug');
        });
        service.countryLib = countries;
        service.getCountries().then(result => {
            expect(result[0].code).toBe('ug');
            expect(service.stripMapData).toHaveBeenCalledTimes(2);
            expect(service.getCountriesList).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('should have a function to get the countries list from the server', done => {
        const countryArray = [countries.ug];
        spyOn(service, 'get').and.returnValue(Promise.resolve(countryArray));
        expect(service.countryListPromise).toBe(undefined);
        service.getCountriesList().then(result => {
            expect(result.ug.code).toBe('ug');
        });
        done();
    });

});
