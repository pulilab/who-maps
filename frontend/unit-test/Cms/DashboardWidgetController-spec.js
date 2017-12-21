import DashboardWidgetController from '../../src/Cms/DashboardWidget/DashboardWidgetController';
import { scores } from './mockData';
import { $scope, $ngRedux } from '../testUtilities';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = {};


describe('DashboardWidgetController', () => {

    beforeEach(()=> {
        controller = DashboardWidgetController.factory()(null, $ngRedux);
        controller.scope = $scope(controller);
    });

    it('should have a factory function', () => {
        expect(DashboardWidgetController.factory).toBeDefined();
        const onSpot = DashboardWidgetController.factory()($scope(controller), $ngRedux);
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });

    it('should have an onInit function', () => {
        spyOn(controller, 'watchers');
        controller.$onInit();
        expect(controller.watchers).toHaveBeenCalled();
    });

    it('should have a watcher function', () => {
        const watcherSpy = spyOn(controller, 'watchers');
        spyOn(controller, 'mapState');
        controller.$onInit();
        watcherSpy.and.callThrough();
        spyOn(controller, 'setDomainVariables');
        spyOn(controller, 'splitType');
        controller.scores = [1];
        controller.currentDomain = 2;
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
        controller.axes = require('./domains');
        controller.setDomainVariables({ id: 1, name: 'Parameters of Scale' }, scores);
        expect(controller.axisColor).toBe('groundwork');
        expect(controller.domainIcon).toBe('parameters-of-scale');
        const score = Math.round((scores[0].domains[0].domain_sum * 100) / scores[0].domains[0].domain_max);
        expect(controller.domainScore).toBe(score);

    });

    it('should have a next domain fn', () => {
        spyOn(controller, 'watchers');
        controller.domains = [{ id: 1 }, { id: 2 }];
        controller.currentDomain = controller.domains[0];
        controller.nextDomain();
        expect(controller.currentDomain.id).toBe(controller.domains[1].id);

        controller.currentDomain = controller.domains.slice(-1)[0];
        controller.nextDomain();
        expect(controller.currentDomain.id).toBe(controller.domains[0].id);
    });


    it('should have a prev domain fn', () => {
        spyOn(controller, 'watchers');
        controller.domains = [{ id: 1 }, { id: 2 }];
        controller.currentDomain = controller.domains[1];
        controller.prevDomain();
        expect(controller.currentDomain.id).toBe(controller.domains[0].id);

        controller.currentDomain = controller.domains[0];
        controller.prevDomain();
        expect(controller.currentDomain.id).toBe(controller.domains.slice(-1)[0].id);
    });
});
