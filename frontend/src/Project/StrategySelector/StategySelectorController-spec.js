import StrategySelectorController from './StrategySelectorController';
import { StrategySelectorDialog } from './StrategySelectorController';
import { dialog, $scope, toast } from '../../testUtilities';
/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;


const upload = {};

describe('StrategySelectorController', () => {

    beforeEach(()=> {
        controller = StrategySelectorController.factory()();
    });

    it('should have a factory  function', () => {
        expect(StrategySelectorController.factory).toBeDefined();
        const onSpot = StrategySelectorController.factory()();
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });


});


describe('StrategySelectorDialog', () => {
    beforeEach(()=> {
        controller = StrategySelectorDialog.factory()($scope(controller), dialog);
    });

    it('should have a factory  function', () => {
        expect(StrategySelectorDialog.factory).toBeDefined();
        const onSpot = StrategySelectorDialog.factory()($scope(controller));
        expect(onSpot.constructor.name).toBe(controller.constructor.name);
    });

    it('should have a cancel function', () => {
        controller.cancel();
        expect(controller.dialog.cancel).toHaveBeenCalled();
    });


});
