import DashboardWidgetController from './DashboardWidgetController';
import { scores } from '../resources/mockData';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;

const scope = {
    $watchGroup: jasmine.createSpy('watchGroup').and.callFake((toCallArray, action) => {
        toCallArray = toCallArray.map(call => {
            return call();
        });
        action(toCallArray);
    }),
    $watchCollection: jasmine.createSpy('$watchCollection').and.callFake((toCall, action) =>  action(toCall())),
    $evalAsync: jasmine.createSpy('evalAsync').and.callFake(toCall => toCall())
};

describe('DashboardWidgetController', () => {

    beforeEach(()=> {
        controller = DashboardWidgetController.factory()(scope);
    });

    it('should have an onInit function', () => {
        spyOn(controller, 'watchers').and.callThrough();
        controller.$onInit();
        expect(controller.cs.constructor.name).toBe('CmsService');
        expect(controller.currentDomain).toBeDefined();
        expect(controller.watchers).toHaveBeenCalled();
    });

    it('should have a function to get the data', (done) => {
        controller.$onInit();
        spyOn(controller.cs, 'getData').and.returnValue(Promise.resolve([1, 2, 3]));
        controller.getData().then(() => {
            expect(controller.all[0]).toBe(1);
            done();
        });
    });

    it('should have a watcher function', () => {
        controller.$onInit();
        spyOn(controller, 'setDomainVariables');
        spyOn(controller, 'splitType');

        controller.watchers();

        expect(controller.splitType).toHaveBeenCalled();
        expect(controller.setDomainVariables).toHaveBeenCalled();

    });

    it('should have a function that divide the data in it\'s category', () => {
        const data = [{ type: 1, domain: 1 }, { type: 1, domain: 2 }, { type: 2, domain: 1 }, { type: 3, domain: 1 }];
        controller.currentDomain = {
            id: 1,
            name: 'a'
        };
        controller.splitType(data);
        expect(controller.lessons.length).toBe(1);
        expect(controller.resources.length).toBe(1);
        expect(controller.experiences.length).toBe(1);
    });

    it('should have a function that set the domain Variables', () => {
        controller.scores = scores;
        controller.axes = require('../resources/domains');
        controller.setDomainVariables({ id: 1, name: 'Parameters of Scale' }, scores);
        expect(controller.axisColor).toBe('groundwork');
        expect(controller.domainIcon).toBe('parameters-of-scale');
        const score = Math.round((scores[0].domains[0].domain_sum * 100) / scores[0].domains[0].domain_max);
        expect(controller.domainScore).toBe(score);

    });

    it('should have a next domain fn', () => {
        spyOn(controller, 'watchers');
        spyOn(controller, 'getData');
        controller.$onInit();
        controller.currentDomain = controller.domains[0];
        controller.nextDomain();
        expect(controller.currentDomain.id).toBe(controller.domains[1].id);

        controller.currentDomain = controller.domains.slice(-1)[0];
        controller.nextDomain();
        expect(controller.currentDomain.id).toBe(controller.domains[0].id);
    });

    it('should have a prev domain fn', () => {
        spyOn(controller, 'watchers');
        spyOn(controller, 'getData');
        controller.$onInit();
        controller.currentDomain = controller.domains[1];
        controller.prevDomain();
        expect(controller.currentDomain.id).toBe(controller.domains[0].id);

        controller.currentDomain = controller.domains[0];
        controller.prevDomain();
        expect(controller.currentDomain.id).toBe(controller.domains.slice(-1)[0].id);
    });


    it('should have a factory function', () => {
        expect(DashboardWidgetController.factory).toBeDefined();
        const onSpot = DashboardWidgetController.factory()();
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });
});
