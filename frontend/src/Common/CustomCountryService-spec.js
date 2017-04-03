import CustomCountryService from './CustomCountryService';

/* global define, it, describe, beforeEach, expect, xit, spyOn, Promise, jasmine */

let service = null;

const countries = {
    ug: {
        code: 'ug',
        id: 1,
        mapData: 'someMapData',
        districts: ['a', 'b']
    }
};

const delayedPromise = result => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(result);
        }, 500);
    });
};

describe('CustomCountryService class', () => {

    beforeEach(()=>{
        service = CustomCountryService;
        service.location = { hostname: 'lol.who.int' };
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
        spyOn(service, 'get').and.returnValue(delayedPromise(countryArray));
        spyOn(service.store, 'set').and.callThrough();
        expect(service.countryListPromise).toBe(undefined);
        service.getCountriesList();
        service.getCountriesList();
        service.countryListPromise.then(result => {
            expect(result[0].code).toBe('ug');
            expect(service.get).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('should have a function to find a country based on his ID', (done)=> {
        spyOn(service, 'getCountriesList').and.returnValue(Promise.resolve(countries));
        service.findCountryById(1).then(result => {
            expect(result.code).toBe('ug');
        });
        service.countryLib = countries;
        service.findCountryById(1).then(result => {
            expect(result.code).toBe('ug');
            expect(service.getCountriesList).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('should have a function to return map data based on a country id', (done) => {
        spyOn(service, 'findCountryById').and.returnValue(Promise.resolve(countries.ug.id));
        spyOn(service, 'fetchMapData').and.returnValue(Promise.resolve(countries.ug.mapData));
        service.getCountryMapData(1).then(()=> {
            expect(service.findCountryById).toHaveBeenCalled();
            expect(service.fetchMapData).toHaveBeenCalled();
            done();
        });
    });

    it('should have a function that return the country districts', done => {
        spyOn(service, 'findCountryById').and.returnValue(Promise.resolve(countries.ug.id));
        spyOn(service, 'fetchMapData').and.returnValue(Promise.resolve(countries.ug.mapData));
        expect(service.getCountryDistricts).toBeDefined();
        done();
    });

    it('should have a function that fetch map data based on a country code', done => {
        spyOn(service, 'getCountry').and.returnValue(Promise.resolve(countries.ug));
        spyOn(service, 'get').and.returnValue(Promise.resolve('someMapData'));
        expect(service.fetchMapData).toBeDefined();
        done();
    });

    it('should have a function that return the correct url for a flag ', () => {
        const result = service.getCountryFlag('ug');
        expect(result).toBe('/static/flags/ug.png');
    });

    it('should have a function that mix the data with the default country data', () => {
        const data = {
            name: 'Hungary'
        };
        const result = service.sendDefaultCountryData(data);
        expect(result.name).toBe('Hungary');
        expect(result.code).toBe('who');
    });

    it('should have a function that fetch the country details', () => {
        spyOn(service, 'sendDefaultCountryData');
        spyOn(service, 'get').and.returnValue(Promise.resolve());
        expect(service.getCountryData).toBeDefined();
    });

    it('should only return 2 char long country codes or who', () => {
        const subDomain = service.getSubDomain();
        expect(service.getSubDomain).toBeDefined();
        expect(subDomain).toEqual('who');
        service.location = { hostname: 'ol.who.int' };
        const subDomain2 = service.getSubDomain();
        expect(subDomain2).toEqual('ol');
    });
});
