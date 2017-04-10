import StrategyController from './StrategyController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;
const $scope = {};
const $element = {};

describe('StrategyController', () => {

    beforeEach(()=> {
        controller = StrategyController.strategyControllerFactory()($scope, $element);
    });

    it('should have an on init function', () => {
        spyOn(controller, 'watchers');
        spyOn(controller, 'defaultOnInit');
        controller.onInit();
        expect(controller.watchers).toHaveBeenCalled();
        expect(controller.defaultOnInit).toHaveBeenCalled();
    });
});
