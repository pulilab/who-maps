import TrixComponentController from '../../src/Common/TrixComponent/TrixComponentController';

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
        getDocument: jest.fn().mockReturnValue({
          toString: jest.fn().mockReturnValue('some string')
        })
      }
    };
  });

  test('should have an onInit Fn.', () => {
    expect(controller.onInit).toBeDefined();
    controller.onInit();
  });
  test('should have an postLink Fn.', () => {
    expect(controller.postLink).toBeDefined();
  });
  test('should have a Fn. that update the bound value', () => {
    controller.editorInstance.editor.element = {
      value: 1
    };
    controller.updateValue();
    expect(controller.value).toBe(1);
  });
});
