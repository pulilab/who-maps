import { default as CountryTopBarController } from '../../src/Common/CountryTopBar/CountryTopBarController';
import { $state, $scope, $timeout, EE, $ngRedux } from '../testUtilities';

/* global it, describe, beforeEach, expect, Promise */

let controller = {};

describe('CountryTopBarController', () => {
  beforeEach(() => {
    controller = CountryTopBarController.countryTopBarControllerFactory()($state(), {}, $timeout, $ngRedux);
    controller.scope = $scope(controller);
    controller.EE = EE;
    controller.state.current = { name: 'something' };
  });

  it('should have a scroll event handler', () => {
    const event = {
      target: {
        scrollTop: 0
      }
    };
    controller.scrollEventHandler(event);
    expect(controller.isScrolled).toBe('not-scrolled');
    event.target.scrollTop = 110;
    controller.scrollEventHandler(event);
    expect(controller.isScrolled).toBe('scrolled-down');
  });
});
