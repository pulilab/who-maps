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

    it('should have a function that remove already selected platforms', () => {
        controller.structure = {
            technology_platforms: ['a', 'b', 'c']
        };
        const platforms = [
            {
                name: 'a',
                availablePlatforms: []
            },
            {
                name: 'b',
                availablePlatforms: []
            }
        ];
        controller.setPlatformAvailableOptions(platforms);
        expect(platforms[0].availablePlatforms).toEqual(['a', 'c']);

    });
});
