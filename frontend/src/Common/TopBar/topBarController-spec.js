import { default as TopBarController } from './TopBarController';
import { EE } from '../common';
import { $scope, $state } from '../../testUtilities';

EE.initialize();

/* global define, it, describe, beforeEach, expect, jasmine, spyOn, Promise */

let ac = {};

const mockData = {
    countries: [{
        id: 1,
        name: 'asd'
    }]
};

const scope = $scope(ac);

describe('TopBarController', () => {

    beforeEach(() => {
        ac = TopBarController.topBarControllerFactory()($state, scope);
        ac.scope = $scope(ac);
        ac.cs = {
            projectList: [],
            projectStructure: mockData,
            populateProjectStructure: jasmine.createSpy('pps'),
            getProjectData: jasmine.createSpy('gpd'),
            reset: jasmine.createSpy('asd').and.returnValue({ loadedPromise: Promise.resolve() })
        };
    });

    it('should have a watcher function', () => {
        spyOn(ac, 'setAxisDomain');
        ac.state = $state;
        ac.watchers();
        expect(ac.setAxisDomain).toHaveBeenCalled();
    });

    it('should have a function that set domain and axis when appropriate', () => {
        const params = {
            axisId: null,
            domainId: null
        };
        ac.setAxisDomain(params);
        expect(ac.axis).toBe(0);
        expect(ac.domain).toBe(0);
        params.axisId = 1;
        params.domainId = 2;

        ac.setAxisDomain(params);
        expect(ac.axis).toBe(1);
        expect(ac.domain).toBe(2);
    });
});
