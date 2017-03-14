import { default as AppModuleController } from './CountryTopBarController';
import { EE } from '../common';

EE.initialize();

/* global define, it, describe, beforeEach, expect, jasmine, spyOn, Promise */

let ac = {};
const $state = {
    go: () => {},
    current: {
        name: 'mock'
    }
};

const mockData = {
    countries: [{
        id: 1,
        name: 'asd'
    }]
};

const $scope = {
    $watch: () => {}
};

describe('CountryTopBarController', () => {

    beforeEach(() => {
        ac = AppModuleController.subBarControllerFactory()($state, $scope);
        ac.cs = {
            projectList: [],
            projectStructure: mockData,
            populateProjectStructure: jasmine.createSpy('pps'),
            getProjectData: jasmine.createSpy('gpd'),
            reset: jasmine.createSpy('asd').and.returnValue({ loadedPromise: Promise.resolve() })
        };
    });


    it('should have a function that update the selected project', () => {
        spyOn(ac.state, 'go');
        ac.user = { projects: [{ name: 'asd', id: 1 }] };
        ac.updateProject('asd');
        expect(ac.state.go).toHaveBeenCalled();
    });

    it('should have a function to open a modal menu', () => {
        const spy = jasmine.createSpy('menuOpener');
        ac.openMenu(spy, {});
        expect(spy).toHaveBeenCalled();
    });

    it('should have a function to perform logout', () => {
        spyOn(ac, 'systemLogout');

        ac.logout();
        expect(ac.cs.reset).toHaveBeenCalled();
        expect(ac.systemLogout).toHaveBeenCalled();

    });

});
