import UUIDLoadController from '../../src/Common/UUIDLoad/UUIDLoadController';

/* global Promise, define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn */

let ulc = {};

const $state = {
    go: jasmine.createSpy('go'),
    params: {
        projectUUID: 'randomxstuffcontainxxxx1'
    }

};

const cs = {
    userProfile: {
        member: [],
        viewer: []
    }
};


describe('UUID Project load Components controller', () => {

    beforeEach(() => {
        ulc = UUIDLoadController.uuidLoadFactory()($state);

        ulc.$onInit();
    });

    it('can be initiated', () => {
        expect(ulc).toBeDefined();
        expect(typeof ulc).toBe('object');
    });

    it('should have a function that can transform an UUID in a projectID', async (done) => {
        expect(ulc.handleProjectLoad).toBeDefined();
        ulc.cs.userProfile = cs.userProfile;
        spyOn(ulc.ss, 'searchProject').and.returnValue([{ id:1 }]);

        await ulc.handleProjectLoad();

        expect(ulc.state.go).toHaveBeenCalledWith('public-dashboard', { appName: 1 });

        ulc.cs.userProfile.member.push(1);
        await ulc.handleProjectLoad();
        expect(ulc.state.go).toHaveBeenCalledWith('dashboard', { appName: 1 });
        done();
    });

});
