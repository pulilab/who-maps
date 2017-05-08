import EditProfileController from './EditProfileController';


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let sc = {};

const $scope = {
    $evalAsync: jasmine.createSpy('eval')
};

const mockData = {
    countries: [{
        id: 1,
        name: 'asd'
    }]
};


const cs = {
    loadedPromise: Promise.resolve(),
    reset: () => {
        return cs;
    }
};

const $state = {
    params: {},
    go: jasmine.createSpy('go')
};


describe('EditProfileController', () => {

    beforeEach(() => {
        sc = EditProfileController.editProfileFactory()($scope, $state);
        sc.newProjectForm = {
            $valid: true,
            $setValidity: jasmine.createSpy('$setValidity')
        };
        sc.cs = {
            projectStructure: mockData,
            populateProjectStructure: jasmine.createSpy('pps'),
            getProjectData: jasmine.createSpy('gpd')
        };
    });

    it('should redirect to the dashboard if is the first save -no profile name -', (done) => {
        sc.cs = cs;
        spyOn(sc, 'showToast');
        spyOn(sc.storage, 'set');
        const callResponse = {
            data: {
                id: 1,
                name: 'a'
            }
        };
        sc.rawName = 'aaaa';
        sc.handleSuccessSave(callResponse).then(() => {
            expect(sc.showToast).toHaveBeenCalled();
            expect(sc.storage.set).toHaveBeenCalled();
            sc.rawName = undefined;
            sc.handleSuccessSave(callResponse).then(() => {
                expect(sc.state.go).toHaveBeenCalledTimes(1);
                done();
            });
        });


    });
});
