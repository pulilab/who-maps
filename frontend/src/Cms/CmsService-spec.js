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
        let result = service.getNameFromId(user);
        expect(result).toBe(user.name);
        result = service.getNameFromId({ user: 99 });
        expect(result).toBe('');
    });
    it('should have Fn that return the CMS data', (done) => {
        spyOn(service, 'fetchData').and.returnValue(Promise.resolve([1]));
        service.lastUpdate = Date.now();
        service.cmsData = [1];
        service.getData().then(data => {
            expect(data.length).toBe(1);
            done();
        });
    });
    it('should have a Fn. that fetch the data from the backend', () => {
        spyOn(service, 'get').and.returnValue(prom([1]));
        service.fetchData();
        expect(service.cmsData.length).toBe(1);
        expect((Date.now() - service.lastUpdate < 100)).toBeTruthy();
    });

    it('should have a Fn. that return the index from an id', () => {
        service.cmsData = cmsData.slice();
        const result = service.findContentIndex({ id: 2 });
        expect(result).toBe(1);
    });

    it('should have a function to add content', (done) => {
        const item = { id: 99 };
        const response = {
            json: jasmine.createSpy('json').and.returnValue(Promise.resolve(item))
        };
        spyOn(service, 'post').and.returnValue(Promise.resolve(response));
        const upService = {
            upload: jasmine.createSpy('upload').and.returnValue(Promise.resolve({ data: item }))
        };
        service.addContent(item).then(data => {
            expect(data.id).toBe(item.id);
            expect(service.post).toHaveBeenCalledTimes(1);
        });
        service.addContent(item, upService).then(data => {
            expect(data.id).toBe(item.id);
            expect(upService.upload).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('should have a function to update content', (done) => {
        const item = { id: 99, cover: '' };
        const response = {
            json: jasmine.createSpy('json').and.returnValue(Promise.resolve(item))
        };
        spyOn(service, 'put').and.returnValue(Promise.resolve(response));

        const upService = {
            upload: jasmine.createSpy('upload').and.returnValue(Promise.resolve({ data: item }))
        };
        service.updateContent(item).then(data => {
            expect(data.id).toBe(item.id);
            expect(service.post).toHaveBeenCalledTimes(2);
        });

        service.updateContent(item, upService).then(data => {
            expect(data.id).toBe(item.id);
        });

        const itemWithCover = {
            cover: new Blob()
        };

        service.updateContent(itemWithCover, upService).then(data => {
            expect(data.id).toBe(item.id);
            expect(upService.upload).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('should have a delete content function', (done) => {
        service.cmsData = cmsData.slice();
        spyOn(service, 'del').and.returnValue(Promise.resolve());
        service.deleteContent({ id: 1 }).then(() => {
            expect(service.del).toHaveBeenCalled();
            expect(service.cmsData[0].id).toBe(2);
            done();
        });
    });


});
