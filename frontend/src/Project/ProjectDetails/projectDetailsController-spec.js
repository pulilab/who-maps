import ProjectDetailsController from './ProjectDetailsController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;
const $scope = {};
const $element = {};

describe('ProjectDetailsController', () => {

    beforeEach(()=> {
        controller = ProjectDetailsController.projectDetailFactory()($scope, $element);
    });

    it('has a function, that parses all users, and returns if they contain the string (#1 fn param)', () => {
        expect(controller.getUsers).toBeDefined();
        controller.users = [
            {
                name: 'Jess', organisation_name: 'Flikli'
            }, {
                name: 'Nico', organisation_name: 'Pulilab'
            }, {
                name: 'Tigest', organisation_name: 'WHO'
            }
        ];
        expect(controller.getUsers('tig')[0].organisation_name).toBe('WHO');
        expect(controller.getUsers('E').length).toBe(2);
    });
});
