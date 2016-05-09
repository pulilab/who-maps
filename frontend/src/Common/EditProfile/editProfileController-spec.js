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

const $state = {
    params: {

    }
};


describe('EditProfileController', () => {

    beforeEach(() => {
        sc = EditProfileController.newProjectFactory()($scope, $state);
        sc.newProjectForm = {
            $valid: true,
            $setValidity: jasmine.createSpy('$setValidity')
        };
        sc.commonService = {
            projectStructure: mockData,
            populateProjectStructure: jasmine.createSpy('pps'),
            getProjectData: jasmine.createSpy('gpd')
        };
    });
});
