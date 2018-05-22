import ProjectComponentController from '../../src/Common/ProjectComponent/ProjectComponentController';
import {$ngRedux, $state} from '../testUtilities';

/* global it, describe, expect, beforeEach, afterEach, spyOn, Promise */

let pcc = {};

describe('ProjectComponentController', () => {
  beforeEach(() => {
    spyOn(ProjectComponentController.prototype, 'onInit').and.callThrough();
    pcc = new ProjectComponentController($state(), $ngRedux);
  });

  it('should have a function that handle the initialization', () => {
    pcc.$onInit();
    expect(pcc.onInit).toHaveBeenCalled();
  });
});
