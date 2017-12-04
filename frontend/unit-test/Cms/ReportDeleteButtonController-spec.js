import ReportButtonController from '../../src/Cms/ReportDeleteButton/ReportDeleteButtonController';
import {$ngRedux} from '../testUtilities';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;


describe('ReportDeleteButtonController', () => {

    beforeEach(()=> {
        controller = ReportButtonController.factory()($ngRedux);
    });

    it('should have a factory  function', () => {
        expect(ReportButtonController.factory).toBeDefined();
        const onSpot = ReportButtonController.factory()($ngRedux);
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });
});
