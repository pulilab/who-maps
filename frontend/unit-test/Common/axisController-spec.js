import AxisController from '../../src/Common/Axis/AxisController';
import { $scope } from '../testUtilities';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */
let ac = {};

const scope = $scope(ac);
let parseAxisData;

describe('axisController', () => {

    beforeEach(() => {
        ac = AxisController.axisFactory()(scope);
        parseAxisData = spyOn(ac, 'parseAxisData');
        ac.axisData = require('./axisMockData');
        ac.$onInit();
    });

    it('should have a factory function', () => {
        expect(AxisController.axisFactory).toBeDefined();
        const onSpot = AxisController.axisFactory()(scope);
        expect(onSpot.constructor.name).toBe(ac.constructor.name);
    });

    it('has a watchers fn', () => {
        parseAxisData.and.callFake(() => {});
        ac.watchers();
        expect(parseAxisData).toHaveBeenCalled();
    });

    it('has initialization == $onInit fn.', () => {
        ac.axisData = undefined;
        ac.axisId = null;
        spyOn(ac, 'watchers');
        ac.$onInit();
        expect(ac.watchers).toHaveBeenCalledTimes(1);
        expect(ac.axisId).toBe(0);

        ac.$onInit();
        expect(ac.watchers).toHaveBeenCalledTimes(2);
    });

    it('parseAxisData fn.', () => {
        spyOn(ac, 'parseDomainData');
        spyOn(ac, 'advanceClassGenerator').and.returnValue('mock-class');

        parseAxisData.and.callThrough();
        ac.parseAxisData(ac.axisData);

        expect(ac.axisName).toBe(' GROUNDWORK')
        expect(ac.axisClass).toBe('axis1')
        expect(ac.axisPicture).toBeDefined();
        expect(ac.axisScorePercentage).toBe(ac.axisData.axis_score)
        expect(ac.axisScoreClass).toBe('mock-class')
        expect(ac.axisCompletitionClass).toBe('mock-class')
        expect(ac.domains.length).toBe(3);

        expect(ac.advanceClassGenerator).toHaveBeenCalledTimes(2);
        expect(ac.advanceClassGenerator).toHaveBeenCalledWith(ac.axisScorePercentage);
        expect(ac.advanceClassGenerator).toHaveBeenCalledWith(ac.axisCompletition);
        expect(ac.parseDomainData).toHaveBeenCalledTimes(1);
    });

    it('has setDomainActive fn.', () => {
        ac.domainId = '15';
        const res1 = ac.setDomainActive(15);
        expect(res1).toBe(true);

        ac.domainId = '15';
        const res2 = ac.setDomainActive(14);
        expect(res2).toBe(false);

        ac.domainId = undefined;
        const res3 = ac.setDomainActive(14);
        expect(res3).toBe(false);
    });

    it('has parseDomainData fn.', () => {
        parseAxisData.and.callThrough();
        spyOn(ac, 'parseDomainData').and.callThrough();
        ac.parseAxisData(ac.axisData);

        expect(ac.parseDomainData).toHaveBeenCalled();
        expect(ac.domains.every(domain => {
            return domain.id && domain.name.length;
        }));
    });

    it('has a fn, that emit a domain change event', () => {
        spyOn(window.EE, 'emit');
        ac.axisId = 'mock axisId';
        ac.changeDomain({ index: 12 });
        expect(window.EE.emit).toHaveBeenCalledWith('mapsDomainChange', 'mock axisId', 12);
    });

    it('has a fn, that emit an axis change event', () => {
        spyOn(window.EE, 'emit');
        ac.axisId = 'mock axisId';
        ac.goToAxis();
        expect(window.EE.emit).toHaveBeenCalledWith('mapsAxisChange', 'mock axisId');
    });

    it('has a class generator fn', () => {
        const res0 = ac.advanceClassGenerator(-10);
        const res1 = ac.advanceClassGenerator(20);
        const res2 = ac.advanceClassGenerator(50);
        const res3 = ac.advanceClassGenerator(60);
        const res4 = ac.advanceClassGenerator(100);
        const res5 = ac.advanceClassGenerator(110);

        expect(res0).toBe('red');
        expect(res1).toBe('red');
        expect(res2).toBe('yellow');
        expect(res3).toBe('yellow');
        expect(res4).toBe('green');
        expect(res5).toBe('green');
    });
});
