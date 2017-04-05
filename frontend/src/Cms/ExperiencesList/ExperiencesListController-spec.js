import ExperienceListController from './ExperiencesListController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;

describe('ExperienceListController', () => {

    beforeEach(()=> {
        controller = ExperienceListController.factory()();
    });

    it('should have a factory  function', () => {
        expect(ExperienceListController.factory).toBeDefined();
        const onSpot = ExperienceListController.factory()();
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });
});
