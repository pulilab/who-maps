import TrixComponentController from '../../src/Common/TrixComponent/TrixComponentController';

/* global define, it, describe, beforeEach, afterEach, expect, jasmine, spyOn, Promise */

let controller = {};

const $scope = {
  $watch: () => {},
  $evalAsync: (toCall) => {
    toCall();
  }
};

const element = [
  window.document.createElement('div')
];

describe('TrixComponentController', () => {
  beforeEach(() => {
    controller = TrixComponentController.factory()($scope, element);
    controller.editorInstance = {
      editor: {
        getDocument: jasmine.createSpy('getDocument').and.returnValue({
          toString: jasmine.createSpy('toString').and.returnValue('some string')
        })
      }
    };
  });

  afterEach(() => {
  });

  it('should have an onInit Fn.', () => {
    expect(controller.onInit).toBeDefined();
    controller.onInit();
  });
  it('should have an postLink Fn.', () => {
    expect(controller.postLink).toBeDefined();
  });
  it('should have a Fn. that update the bound value', () => {
    controller.editorInstance.editor.element = {
      value: 1
    };
    controller.updateValue();
    expect(controller.value).toBe(1);
  });
});
