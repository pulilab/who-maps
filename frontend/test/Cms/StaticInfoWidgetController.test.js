import StaticInfoWidgetController from '../../src/Cms/StaticInfoWidget/StaticInfoWidgetController';


let controller = null;

describe('StaticInfoWidgetController', () => {
  beforeEach(() => {
    controller = StaticInfoWidgetController.factory()();
  });

  test('should have a factory  function', () => {
    expect(StaticInfoWidgetController.factory).toBeDefined();
    const onSpot = StaticInfoWidgetController.factory()();
    expect(onSpot.constructor.name).toBe(controller.constructor.name);
  });
});
