import ProjectDetailsController from './ProjectDetailsController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;

const executeWatch = (observable, toCall) => {
    if (observable instanceof  Array) {
        observable = observable.map(obs => {
            return obs();
        });
    }
    else {
        observable = observable();
    }
    toCall(observable);
};

const $scope = {
    $watch: jasmine.createSpy('watch').and.callFake(executeWatch),
    $watchGroup: jasmine.createSpy('watchGroup').and.callFake(executeWatch)
};
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

    it('should have an onInit function', () => {
        spyOn(controller, 'watchers');
        spyOn(controller, 'defaultOnInit');
        spyOn(controller, 'bindFunctions');
        spyOn(controller, 'getStructureData');

        controller.onInit();
        expect(controller.defaultOnInit).toHaveBeenCalled();
        expect(controller.watchers).toHaveBeenCalled();
        expect(controller.bindFunctions).toHaveBeenCalled();
        expect(controller.getStructureData).toHaveBeenCalled();
    });

    it('should have a watcher function', () => {
        controller.project = {};
        spyOn(controller, 'fetchDistricts');
        spyOn(controller, 'validateDateRange');
        controller.watchers();
        expect(controller.scope.$watch).toHaveBeenCalled();
        expect(controller.scope.$watchGroup).toHaveBeenCalled();
        expect(controller.fetchDistricts).toHaveBeenCalled();
        expect(controller.validateDateRange).toHaveBeenCalled();
    });
    it('should have a function that validates a date range', () => {
        spyOn(controller, 'setCustomError');
        spyOn(controller, 'handleCustomError');
        const dates = [new Date(), new Date()];
        controller.validateDateRange(dates);
        expect(controller.handleCustomError).toHaveBeenCalled();
        dates[0].setYear(2200);
        controller.validateDateRange(dates);
        expect(controller.setCustomError).toHaveBeenCalled();

    });
});
