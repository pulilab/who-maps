import { default as AppModuleController } from '../../src/App/AppModuleController';
import { EE } from '../../src/Common/common';

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
        EE.initialize();
        ac = AppModuleController.appControllerFactory()($state, $scope);
        ac.cs = {
            projectList: [],
            projectStructure: mockData,
            populateProjectStructure: jasmine.createSpy('pps'),
            getProjectData: jasmine.createSpy('gpd'),
            reset: jasmine.createSpy('asd').and.returnValue({ loadedPromise: Promise.resolve() })
        };
    });

});
