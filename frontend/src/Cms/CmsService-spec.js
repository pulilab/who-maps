import CmsService from './CmsService';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let service = null;

const user = {
    id: 1,
    user: 1,
    name: 'lol'
};

const cs = {
    userProfile: user,
    usersProfiles: [
        {
            id: 1,
            name: 'lol'
        }
    ]
};

const prom = data => {
    return {
        then(toCall) {
            toCall(data);
        }
    };
};

const cmsData = [{ id: 1 }, { id: 2 }];

describe('CmsService', () => {

    beforeEach(()=> {
        service = CmsService;
        service.commonServices = cs;
        service.init();
    });

    it('should return a compiled CmsService class', () => {
        expect(service.constructor.name).toBe('CmsService');
    });

    it('should have a function that return a user name from an object with a user param', () => {
        const result = service.getNameFromId(user);
        expect(result).toBe(user.name);
    });
    it('should have Fn that return the CMS data', (done) => {
        spyOn(service, 'fetchData').and.returnValue(Promise.resolve([1]));
        service.lastUpdate = Date.now();
        service.cmsData = [1];
        service.getData().then(data => {
            expect(data.length).toBe(1);
        });

        service.lastUpdate = Date.now() - 120;
        service.getData().then(data => {
            expect(service.fetchData).toHaveBeenCalledTimes(1);
            expect(data.length).toBe(1);
            done();
        });
    });
    it('should have a Fn. that fetch the data from the backend', () => {
        spyOn(service, 'get').and.returnValue(prom([1]));
        service.fetchData();
        expect(service.cmsData.length).toBe(1);
        expect(service.lastUpdate).toBeCloseTo(Date.now());
    });

    it('should have a Fn. that return the index from an id', () => {
        service.cmsData = cmsData.slice();
        const result = service.findContentIndex({ id: 2 });
        expect(result).toBe(1);
    });


});
