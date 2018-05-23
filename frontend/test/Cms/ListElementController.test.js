import ListElementController from '../../src/Cms/ListElement/ListElementController';

let controller = null;

describe('ListElementController', () => {
  beforeEach(() => {
    controller = ListElementController.factory()();
    controller.item = {
      domain: 1
    };
  });

  test('should have a factory  function', () => {
    expect(ListElementController.factory).toBeDefined();
    const onSpot = ListElementController.factory()();
    expect(onSpot.constructor.name).toBe(controller.constructor.name);
  });

  test('should import a prettifyDate fn. and a itemType fn', () => {
    expect(controller.prettifyDate).toBeDefined();
    expect(controller.itemType).toBeDefined();
  });

  test('should have a fn that compose axis and domain name', () => {
    controller.axisAndDomainName = {
      axisName: 'Groundwork',
      domainName: 'Parameters of Scale'
    };
    const result = controller.showAxisAndDomain();
    expect(result).toBe('Groundwork - Parameters of Scale');
  });

  test('should have a fn that export class according to domains and axis', () => {
    controller.axisAndDomainName = {
      axisName: 'Groundwork',
      domainName: 'Parameters of Scale'
    };
    const result = controller.axisAndDomainClass();
    expect(result).toBe('axis-groundwork domain-parameters-of-scale');
  });
});
