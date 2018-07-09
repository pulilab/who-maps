import ProjectComponentController from '../../src/Common/ProjectComponent/ProjectComponentController';
import {$ngRedux, $state} from '../testUtilities';

let pcc = {};

describe('ProjectComponentController', () => {
  beforeEach(() => {
    jest.spyOn(ProjectComponentController.prototype, 'onInit');
    pcc = new ProjectComponentController($state(), $ngRedux);
  });

  test('should have a function that handle the initialization', () => {
    pcc.$onInit();
    expect(pcc.onInit).toHaveBeenCalled();
  });
});
