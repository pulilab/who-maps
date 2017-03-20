import { default as CountryTopBarController } from './CountryTopBarController';
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

const $timeout = toCall => {
    return toCall();
};

describe('CountryTopBarController', () => {

    beforeEach(() => {
        ac = CountryTopBarController.countryTopBarControllerFactory()($state, $scope, $timeout);
        ac.cs = {
            projectList: [],
            projectStructure: mockData,
            populateProjectStructure: jasmine.createSpy('pps'),
            getProjectData: jasmine.createSpy('gpd'),
            reset: jasmine.createSpy('asd').and.returnValue({ loadedPromise: Promise.resolve() })
        };
    });

});
