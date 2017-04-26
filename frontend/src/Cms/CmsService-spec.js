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

const cmsDataWithComments = () => {
    return [{
        id: 1,
        comments: [
            {
                id: 1
            },
            {
                id: 2
            }
        ]
    }];
};

const response = (item) => {
    return {
        json: jasmine.createSpy('json').and.returnValue(Promise.resolve(item))
    };
};

describe('CmsService', () => {

    beforeEach(()=> {
        service = CmsService;
        service.commonServices = cs;
        service.init();

    });

    it('should return a compiled CmsService class', () => {
        expect(service.constructor.name).toBe('CmsService');
    });

    it('should have a proper init fn', () => {
        service.commonServices.userProfile = {
            id: 1,
            name: 'Aldo'
        };
        service.commonServices.usersProfiles = [user];
        service.init();
        expect(service.currentUserId).toBe(1);
        expect(service.currentUserName).toBe('Aldo');
        expect(service.users[0].id).toBe(user.id);
    });

    it('should have a function that return a user name from an object with a user param', () => {
        service.users = [user];
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

        spyOn(service, 'put').and.returnValue(Promise.resolve(response(item)));

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

    it('should have a report content function', (done) => {
        service.cmsData = cmsData.slice();
        spyOn(service, 'patch').and.returnValue(Promise.resolve(response({})));
        service.reportContent({ id: 1, state: 2 }).then(() => {
            expect(service.patch).toHaveBeenCalled();
            expect(service.cmsData[0].state).toBe(2);
            done();
        });
    });

    it('should have a find comment fn.', () => {
        service.cmsData = cmsDataWithComments();
        const r = service.findComment({ id: 1 });
        expect(r.index).toBe(0);
        expect(r.resourceItem.id).toBe(1);
    });

    it('should have an addComment fn,', (done) => {
        spyOn(service, 'post').and.returnValue(Promise.resolve(response({ id: 3 })));
        service.cmsData = cmsDataWithComments();
        service.addComment({ id: 3 }, { id: 1 }).then(() => {
            expect(service.post).toHaveBeenCalled();
            expect(service.cmsData[0].comments[2].id).toBe(3);
            done();
        });
    });

    it('should have an updateComment fn', (done) => {
        const toUpdate = { id: 1, msg: 'a' };
        service.cmsData = cmsDataWithComments();
        spyOn(service, 'put').and.returnValue(Promise.resolve(response(toUpdate)));
        service.updateComment(toUpdate).then(()=> {
            expect(service.put).toHaveBeenCalled();
            expect(service.cmsData[0].comments[0].msg).toBe('a');
            done();
        });
    });

    it('should have a deleteComment fn', (done) => {
        service.cmsData = cmsDataWithComments();
        spyOn(service, 'del').and.returnValue(Promise.resolve());
        service.deleteComment({ id: 1 }).then(() => {
            expect(service.del).toHaveBeenCalled();
            expect(service.cmsData[0].comments[0].id).toBe(2);
            done();
        });
    });

    it('should have a report comment fn', (done) => {
        spyOn(service, 'patch').and.returnValue(Promise.resolve(response({})));
        service.cmsData = cmsDataWithComments();
        service.reportComment({ id: 1, state: 2 }).then(() => {
            expect(service.patch).toHaveBeenCalled();
            expect(service.cmsData[0].comments[0].state).toBe(2);
            done();
        });
    });

    it('should have a purge function', () => {
        expect(service.purge).toBeDefined();
        service.purge();
    });

});
