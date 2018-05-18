import NavigationController from '../../src/Project/Navigation/NavigationController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = {};

const EEmock = {
  emit: jasmine.createSpy('emit')
};

describe('NavigationController', () => {
  beforeEach(() => {
    controller = new NavigationController();
    controller.EE = EEmock;
  });

  it('should have a function that emit a scroll request', () => {
    expect(controller.scrollTo).toBeDefined();
    controller.scrollTo();
    expect(controller.EE.emit).toHaveBeenCalled();
  });
  it('should have a factory function', () => {
    expect(NavigationController.navigationFactory).toBeDefined();
    const factored = NavigationController.navigationFactory()();
    expect(factored instanceof NavigationController).toBeTruthy();
  });
});
