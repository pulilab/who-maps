import ImplementationOverviewController from './ImplementationOverviewController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */
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

let controller = null;
const $element = {};
const $scope = {
    $watch: jasmine.createSpy('watch').and.callFake(executeWatch),
    $watchGroup: jasmine.createSpy('watchGroup').and.callFake(executeWatch)
};
const structure = {
    interventions: []
};

describe('ImplementationOverview', () => {

    beforeEach(()=> {
        controller = ImplementationOverviewController.factory()($scope, $element);
    });

    it('should have an on init function', () => {
        spyOn(controller, 'watchers');
        spyOn(controller, 'defaultOnInit');
        controller.structure = structure;
        controller.onInit();
        expect(controller.watchers).toHaveBeenCalled();
        expect(controller.defaultOnInit).toHaveBeenCalled();
    });

    it('should have a watcher function', () => {
        controller.project = {};
        controller.project.platforms = [];
        controller.structure = {};
        controller.structure.technology_platform = [];
        spyOn(controller, 'fetchDistricts');
        spyOn(controller, 'setAvailableOptions');
        controller.watchers();
        expect(controller.scope.$watch).toHaveBeenCalled();
        expect(controller.scope.$watchGroup).toHaveBeenCalled();
        expect(controller.fetchDistricts).toHaveBeenCalled();
        expect(controller.setAvailableOptions).toHaveBeenCalled();
    });
});
