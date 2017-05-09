import ListElementController from './ListElementController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */


let controller = null;

describe('ListElementController', () => {

    beforeEach(()=> {
        controller = ListElementController.factory()();
        controller.item = {
            domain: 1
        };
    });

    it('should have a factory  function', () => {
        expect(ListElementController.factory).toBeDefined();
        const onSpot = ListElementController.factory()();
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });

    it('should import a prettifyDate fn. and a itemType fn', () => {
        expect(controller.prettifyDate).toBeDefined();
        expect(controller.itemType).toBeDefined();
    });

    it('should have a fn that compose axis and domain name', () => {
        const result = controller.showAxisAndDomain();
        expect(result).toBe('Groundwork - Parameters of Scale');
    });

    it('should have a fn that export class according to domains and axis', () => {
        const result = controller.axisAndDomainClass();
        expect(result).toBe('axis-groundwork domain-parameters-of-scale');
    });

});
