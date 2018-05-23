import ReportButtonController from '../../src/Cms/ReportDeleteButton/ReportDeleteButtonController';
import {$ngRedux} from '../testUtilities';


let controller = null;

describe('ReportDeleteButtonController', () => {
  beforeEach(() => {
    controller = ReportButtonController.factory()($ngRedux);
  });

  test('should have a factory  function', () => {
    expect(ReportButtonController.factory).toBeDefined();
    const onSpot = ReportButtonController.factory()($ngRedux);
    expect(onSpot.constructor.name).toBe(controller.constructor.name);
  });
});
