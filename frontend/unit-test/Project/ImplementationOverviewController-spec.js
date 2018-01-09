import ImplementationOverviewController from '../../src/Project/ImplementationOverview/ImplementationOverviewController';
import { $scope, $element, $ngRedux } from '../testUtilities';
import * as CountriesModule from '../../src/store/modules/countries';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = null;

const structure = {
    health_focus_areas: []
};

describe('ImplementationOverview', () => {

    beforeEach(()=> {
        controller = ImplementationOverviewController.factory()({}, $element, $ngRedux);
        controller.scope = $scope(controller);
    });

    it('mapData fn.', () => {
        spyOn(CountriesModule, 'getCurrentCountryFirstSubLevel').and.returnValue(1);
        spyOn(CountriesModule, 'getCurrentCountrySecondSubLevel').and.returnValue(2);
        spyOn(CountriesModule, 'getCurrentCountrySubLevelNames').and.returnValue([1, 2]);
        const result = controller.mapData({});
        expect(CountriesModule.getCurrentCountryFirstSubLevel).toHaveBeenCalled();
        expect(CountriesModule.getCurrentCountrySecondSubLevel).toHaveBeenCalled();
        expect(CountriesModule.getCurrentCountrySubLevelNames).toHaveBeenCalled();
        expect(result.districtList).toBe(1);
        expect(result.secondSubLevelList).toBe(2);
        expect(result.subLevelNames).toEqual([1,2]);
    });

    it('should have an on init function', () => {
        spyOn(controller, 'watchers');
        spyOn(controller, 'defaultOnInit');
        controller.structure = structure;
        controller.onInit();
        expect(controller.watchers).toHaveBeenCalled();
        expect(controller.defaultOnInit).toHaveBeenCalled();
    });

    it('onDestroy fn.', () => {
        controller.unsubscribe = jasmine.createSpy('unsubscribe');
        controller.defaultOnDestroy = jasmine.createSpy('defaultOnDestroy');
        controller.onDestroy();
        expect(controller.unsubscribe).toHaveBeenCalled();
        expect(controller.defaultOnDestroy).toHaveBeenCalled();
    });

    it('watchers fn.', () => {
        controller.project = {};
        controller.project.platforms = [];
        controller.structure = {};
        controller.structure.technology_platform = [];
        spyOn(controller, 'setAvailableDictOptions');
        spyOn(controller, 'clearDistrict');
        spyOn(controller, 'addClearOption');
        controller.watchers();
        expect(controller.scope.$watch).toHaveBeenCalled();
        expect(controller.scope.$watchGroup).toHaveBeenCalled();
        expect(controller.setAvailableDictOptions).toHaveBeenCalled();
        expect(controller.clearDistrict).toHaveBeenCalled();
        expect(controller.addClearOption).toHaveBeenCalled();
    });

    it('addClearOption fn', () => {
        let district = null;
        controller.addClearOption(district);
        expect(district).toEqual(null);

        district = [];
        controller.addClearOption(district);
        expect(district).toEqual([]);

        district = [{
            available: ['Clear selection']
        }];

        controller.addClearOption(district);
        expect(district).toEqual(district);

        district = [{
            available: ['Clear selection'],
            district: 1
        }];

        controller.addClearOption(district);
        expect(district).toEqual(district);

        district = [{
            available: ['a', 'b'],
            district: 1
        }];

        controller.addClearOption(district);
        expect(district[0].available[0]).toEqual('Clear selection');
    });

    it('clearDistrict Fn.', () => {
        let coverage = null;
        controller.clearDistrict(coverage);
        expect(coverage).toEqual(null);

        coverage = [];
        controller.clearDistrict(coverage);
        expect(coverage).toEqual([]);

        coverage = [{
            district: 1,
            health_workers: 2,
            facilities: 3,
            clients: 4
        }];

        controller.clearDistrict(coverage);
        expect(coverage).toEqual(coverage);


        coverage = [{
            district: 'Clear selection',
            health_workers: 2,
            facilities: 3,
            clients: 4
        }];

        controller.clearDistrict(coverage);
        expect(coverage[0]).toEqual({
            district: undefined,
            health_workers: undefined,
            facilities: undefined,
            clients: undefined
        });

    });

    it('removeUnavailableDistricts fn', () => {
        controller.project = {};
        let districts = null;
        controller.removeUnavailableDistricts(districts);
        expect(controller.project).toEqual(controller.project);

        controller.project.coverage = [];
        controller.removeUnavailableDistricts(districts);
        expect(controller.project).toEqual(controller.project);

        controller.project.coverage = [{ district: 1 }];
        controller.removeUnavailableDistricts(districts);
        expect(controller.project).toEqual(controller.project);

        districts = [];
        controller.removeUnavailableDistricts(districts);
        expect(controller.project).toEqual(controller.project);

        districts = [1, 2];
        controller.removeUnavailableDistricts(districts);
        expect(controller.project).toEqual(controller.project);

        controller.project.coverage = [{ district: 99 }];
        controller.removeUnavailableDistricts(districts);
        expect(controller.project.coverage).toEqual([{ district: undefined }]);

    });

    it('should have a mapping fn for interventions', () => {
        const health_focus_areas = [
            {
                name: 'a',
                subGroups: [{
                    name: 'b',
                    items: ['a', 'b']
                }, {
                    name: 'c',
                    items: ['ee', 'dd']
                }]
            },
            {
                name: 'aa',
                subGroups: [{
                    name: 'bb',
                    items: ['aa', 'bb']
                }, {
                    name: 'cc',
                    items: ['eee', 'ddd']
                }]
            }
        ];
        const r = controller.mapHealthFocusAreas(health_focus_areas);
        expect(r[0].subGroups[0].name).toBe('a');
        expect(r[0].subGroups[0].class).toBe('group-1');
    });
});
