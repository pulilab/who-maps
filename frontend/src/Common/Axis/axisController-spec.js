import axisController from './AxisController';


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let ac = void 0;

describe('axisController', () => {

    beforeEach(() => {
        ac = axisController.axisFactory()();
        ac.$onInit();
    });

    it('should have a function that parse the domain data', () => {
        ac.parseDomainData()
        expect(ac.domains[0].index).toBe(0);
    });
    it('should have a function that emit a domain change event', () => {
        spyOn(window.EE, 'emit');
        ac.changeDomain({ index: 0 });
        expect(window.EE.emit).toHaveBeenCalled();
    });

    it('should have a function that calculate the axis completition', () => {
        const c = ac.axisCompletitionCalculator();
        expect(c).toBeDefined();
    })

    it('should have a fuonction that initialize the system', () => {
        spyOn(axisController.prototype, 'initialization');
        ac = axisController.axisFactory()();
        ac.$onInit();
        expect(ac.initialization).toHaveBeenCalled();
    })
});
