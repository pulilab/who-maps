import GeneralOverviewController from '../../src/Project/GeneralOverview/GeneralOverviewController';
import { $scope, $element, $state, $ngRedux, A } from '../testUtilities';
import * as ProjectModule from '../../src/store/modules/projects';
import * as CountriesModule from '../../src/store/modules/countries';
/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let controller = {};


describe('GeneralOverviewController', () => {

    beforeEach(()=> {
        controller = GeneralOverviewController.factory()({}, $element, $state(), $ngRedux);
        controller.scope = $scope(controller);
    });

    it('mapData fn', () => {
        spyOn(ProjectModule, 'getSimilarProject').and.returnValue([{ id: 1 }, { id: 2 }]);
        spyOn(CountriesModule, 'getCountriesList').and.returnValue(1);
        controller.project = { id: 1 };
        const result = controller.mapData({});
        expect(ProjectModule.getSimilarProject).toHaveBeenCalled();
        expect(CountriesModule.getCountriesList).toHaveBeenCalled();
        expect(result.similarProject).toEqual([{ id: 2 }]);
        expect(result.countriesList).toEqual(1);
    });

    it('should have an onInit function', () => {
        spyOn(controller, 'watchers');
        spyOn(controller, 'defaultOnInit');

        controller.onInit();
        expect(controller.defaultOnInit).toHaveBeenCalled();
        expect(controller.watchers).toHaveBeenCalled();
        expect(controller.$ngRedux.connect).toHaveBeenCalled();
    });

    it('should have a watcher function', () => {
        controller.project = {};
        spyOn(controller, 'validateDateRange');
        controller.watchers();
        expect(controller.scope.$watch).toHaveBeenCalled();
        expect(controller.scope.$watchGroup).toHaveBeenCalled();
        expect(controller.validateDateRange).toHaveBeenCalled();
    });
    it('validateDateRange fn', () => {
        spyOn(controller, 'setCustomError');
        spyOn(controller, 'handleCustomError');
        const dates = [new Date(), new Date()];
        controller.validateDateRange(dates);
        expect(controller.handleCustomError).toHaveBeenCalled();
        dates[0].setYear(2200);
        controller.validateDateRange(dates);
        expect(controller.setCustomError).toHaveBeenCalled();

        const result = controller.validateDateRange([undefined, undefined]);
        expect(result).toBe(undefined);

    });

    it('getUsers fn.', () => {
        expect(controller.getUsers).toBeDefined();
        controller.users = [
            {
                name: 'Jess', organisation_name: 'Flikli'
            }, {
                name: 'Nico', organisation_name: 'Pulilab'
            }, {
                name: 'Tigest', organisation_name: 'WHO'
            }, {
                name: 'Garret'
            }, {
                organisation_name: 'WHO'
            }
        ];
        expect(controller.getUsers('tig')[0].organisation_name).toBe('WHO');
        expect(controller.getUsers('E').length).toBe(2);
    });

    it(' async checkName fn.', A(async () => {
        spyOn(controller, 'handleCustomError');
        spyOn(controller, 'setCustomError');
        controller.project = {
            name: 'a'
        };
        controller.currentName = 'a';
        controller.searchDuplicateProjectName = jasmine.createSpy('searchDuplicateProjectName');

        await controller.checkName();
        expect(controller.handleCustomError).toHaveBeenCalledWith('name');
        expect(controller.searchDuplicateProjectName).not.toHaveBeenCalled();
        expect(controller.setCustomError).not.toHaveBeenCalled();

        controller.currentName = 'b';
        await controller.checkName();
        expect(controller.handleCustomError).toHaveBeenCalledWith('name');
        expect(controller.searchDuplicateProjectName).toHaveBeenCalledWith('a');
        expect(controller.setCustomError).not.toHaveBeenCalled();

        controller.similarProject = [{ name: 'b' }];
        await controller.checkName();
        expect(controller.handleCustomError).toHaveBeenCalledWith('name');
        expect(controller.searchDuplicateProjectName).toHaveBeenCalledWith('a');
        expect(controller.setCustomError).not.toHaveBeenCalled();

        controller.similarProject = [{ name: 'A' }];
        await controller.checkName();
        expect(controller.handleCustomError).toHaveBeenCalledWith('name');
        expect(controller.searchDuplicateProjectName).toHaveBeenCalledWith('a');
        expect(controller.setCustomError).toHaveBeenCalledWith('name', 'Project name is not unique');

    }));

    it('openSimilarProject fn.', () => {
        const event = {
            preventDefault: jasmine.createSpy('preventDefault')
        };

        const project = {
            isOwn: true
        };

        controller.openSimilarProject(project, event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(controller.state.go).toHaveBeenCalledWith('dashboard', jasmine.any(Object));

        project.isOwn = false;
        controller.openSimilarProject(project, event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(controller.state.go).toHaveBeenCalledWith('public-dashboard', jasmine.any(Object));

    });
});
