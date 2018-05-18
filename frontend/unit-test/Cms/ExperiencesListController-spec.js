import ExperienceListController from '../../src/Cms/ExperiencesList/ExperiencesListController';
import { $scope, $ngRedux, angularForm } from '../testUtilities';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;

describe('ExperienceListController', () => {
  beforeEach(() => {
    controller = ExperienceListController.factory()($scope(controller), $ngRedux);
    controller.axisId = 0;
    controller.domainId = 0;
    controller.form = angularForm;
  });

  it('should have a factory  function', () => {
    expect(ExperienceListController.factory).toBeDefined();
    const onSpot = ExperienceListController.factory()($scope(controller), $ngRedux);
    expect(onSpot.constructor.name).toBe(controller.constructor.name);
  });

  it('should have an on init fn', () => {
    spyOn(controller, 'watchers');
    controller.onInit();
    expect(controller.watchers).toHaveBeenCalled();
  });

  it('should have a watcher function', () => {
    controller.data = [{ domain: 1, type: 3 }, { domain: 2, type: 3 }, { domain: 1, type: 2 }, { domain: 2, type: 2 }];
    controller.domain = {
      id: 1
    };
    controller.watchers();
    expect(controller.experiences.length).toBe(1);
  });

  it('should have a saveExperience fn', async (done) => {
    controller.saveOrUpdateContent = jasmine.createSpy('saveOrUpdateContent').and.returnValue(Promise.resolve());
    controller.newExperience = {};
    await controller.saveExperience();
    expect(controller.saveOrUpdateContent).toHaveBeenCalled();
    expect(controller.newExperience.body).toBe(false);
    expect(controller.form.$setUntouched).toHaveBeenCalled();
    expect(controller.form.$setPristine).toHaveBeenCalled();
    done();
  });
});
