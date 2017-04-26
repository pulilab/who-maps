import ExperienceListController from './ExperiencesListController';
import { $scope } from '../../testUtilities';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;

describe('ExperienceListController', () => {

    beforeEach(()=> {
        controller = ExperienceListController.factory()($scope(controller));
        controller.axisId = 0;
        controller.domainId = 0;
        controller.onInit();
    });

    it('should have an on init fn', () => {
        spyOn(controller, 'getData');
        spyOn(controller, 'watchers');
        controller.onInit();
        expect(controller.cs.constructor.name).toBe('CmsService');
        expect(controller.getData).toHaveBeenCalled();
        expect(controller.watchers).toHaveBeenCalled();
    });

    it('should have a getData fn', (done)  => {
        spyOn(controller.cs, 'getData').and.returnValue(Promise.resolve([1, 2]));
        controller.getData().then(() => {
            expect(controller.data[0]).toBe(1);
            done();
        });
    });

    it('should have a watcher function', () => {
        controller.data = [{ domain: 1, type:3 }, { domain: 2, type:3 }, { domain: 1, type:2 }, { domain: 2, type:2 }];
        controller.watchers();
        expect(controller.experiences.length).toBe(1);
    });

    it('should have a saveExperience fn', (done) => {
        spyOn(controller.cs, 'addContent').and.returnValue(Promise.resolve());
        controller.saveExperience().then(() => {
            expect(controller.cs.addContent).toHaveBeenCalled();
            expect(controller.newExperience.body).toBe(false);
            done();
        });
    });

    it('should have a factory  function', () => {
        expect(ExperienceListController.factory).toBeDefined();
        const onSpot = ExperienceListController.factory()();
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });
});
