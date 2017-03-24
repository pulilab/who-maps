import NewProjectController from './ProjectController';
import _ from 'lodash';


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let sc = {};

const $scope = {
    $evalAsync: jasmine.createSpy('eval'),
    $$postDigest: jasmine.createSpy('digest')
};

const mockData = {
    countries: [{
        id: 1,
        name: 'asd'
    }]
};

const $state = {
    params: {

    }
};

const cs = {
    projectStructure: mockData,
    userProfile: {
        organisation: 'asd'
    },
    populateProjectStructure: jasmine.createSpy('pps'),
    getProjectData: jasmine.createSpy('gpd').and.returnValue(Promise.resolve()),
    updateProject: jasmine.createSpy('updateProject').and.returnValue(Promise.resolve())
};

const $anchorScroll = {
    scroll: jasmine.createSpy('scroll').and.returnValue(true)
};
const $location = {};
const upload = {};

const structure = require('./Resources/structure.json');

describe('ProjectController', () => {

    beforeEach(() => {
        sc = new NewProjectController($scope, $state, upload, $anchorScroll, $location, cs, structure);
        sc.newProjectForm = {
            $valid: true,
            $setValidity: jasmine.createSpy('$setValidity')
        };
        sc.$onInit();
    });

    it('should have a function that import all the icons ', () => {
        const a = sc.importIconTemplates();
        expect(a['icon-axis1']).toBeDefined();
    });

    it('should have a function that process the axis structure', () => {

        expect(sc.processAxisStructure).toBeDefined();
        expect(sc.axisStructure[0]).toBeDefined();
    });

    it('should have a function that handle the server data loading', () => {

        sc.handleStructureLoad();
        expect(sc.dataLoaded).toBeTruthy();
        expect(sc.structure.coverageTypes.length).toBe(3);
        expect(sc.scope.$evalAsync).toHaveBeenCalled();

    });


    it('should have a function that handle the saving process ', () => {
        const e = document.createElement('div');
        e.setAttribute('id', 'npf');
        document.body.appendChild(e);
        spyOn(sc, 'scroll');
        spyOn(sc, 'mergeCustomAndDefault');
        spyOn(sc, 'createCoverageArray');
        spyOn(sc, 'saveForm');
        spyOn(sc, 'separateCoverageAndNationalLevelDeployments');
        spyOn(sc.ns, 'newProject').and.returnValue(Promise.resolve());
        sc.save();
        expect(sc.mergeCustomAndDefault).toHaveBeenCalled();
        expect(sc.createCoverageArray).toHaveBeenCalled();
        expect(sc.saveForm).toHaveBeenCalled();
        expect(sc.separateCoverageAndNationalLevelDeployments).toHaveBeenCalled();
    });

    it('should have a function that save a new form', () => {
        spyOn(sc.ns, 'newProject').and.returnValue(Promise.resolve());
        sc.saveForm(sc.project);
        expect(sc.ns.newProject).toHaveBeenCalled();
    });

    it('should have a function that update an existing form', () => {
        spyOn(sc.ns, 'updateProject').and.returnValue(Promise.resolve({ success: true }));
        sc.editMode = true;
        sc.updateForm(sc.project);
        expect(sc.ns.updateProject).toHaveBeenCalled();
    });

    it('should have some utility function', () => {
        expect(sc.concatCustom).toBeDefined();
        expect(sc.unfoldObjects).toBeDefined();
        expect(sc.createCoverageArray).toBeDefined();
    });

    it('should have a function that handle the onInit when is in editMode', () => {
        spyOn(sc, 'handleStructureLoad');
        sc.editMode = true;
        sc.onInit();
        expect(sc.cs.getProjectData).toHaveBeenCalled();
        expect(sc.handleStructureLoad).toHaveBeenCalled();
    });

    it('should have a function that handle the structure loaded from the server', () => {
        sc.handleStructureLoad(mockData);
        expect(sc.dataLoaded).toBe(true);
        expect(sc.structure).toBe(mockData);
        expect(sc.scope.$evalAsync).toHaveBeenCalled();
    });

    it('should have a function that handle the data loaded from the server', () => {
        spyOn(sc, 'createCoverageKeys');
        spyOn(sc.ccs, 'getCountryDistricts').and.returnValue(Promise.resolve({}));
        spyOn(sc, 'convertArraytoStandardCustomObj');
        sc.handleStructureLoad(mockData);
        sc.handleDataLoad();
        expect(sc.createCoverageKeys).toHaveBeenCalled();
        expect(sc.convertArraytoStandardCustomObj).toHaveBeenCalled();

    });

    it('should have a function that handles the national level deployment', () => {
        sc.project.national_level_deployment = [{ clients: 33 }];
        sc.mergeNationalLevelWithDistrictCoverage();
        expect(_.filter(sc.project.coverage, item => item.district === ' ENTIRE COUNTRY').length).toBeGreaterThan(0);
    });

    it('should have a function that separates the national level deployment before saving', () => {
        const isCoverage = item => item.district !== 'ENTIRE COUNTRY';
        sc.project.coverage = [
            { district: 'someDistrict' },
            { district: 'ENTIRE COUNTRY' }
        ];
        sc.separateCoverageAndNationalLevelDeployments(sc.project.coverage);
        const normalCoverage = _.filter(sc.project.coverage, isCoverage);
        const nationalLevelCoverage = _.reject(sc.project.coverage, isCoverage);
        expect(normalCoverage.length).toBe(1);
        expect(nationalLevelCoverage.length).toBe(1);


    });

    it('should have a function that handles custom errors', () => {
        sc.newProjectForm = {
            asd: {
                $setValidity: jasmine.createSpy('innerSet')
            }
        };
        sc.handleCustomError('asd');
        expect(sc.newProjectForm.asd.$setValidity).toHaveBeenCalled();
    });

    it('fetches all users, team members and viewers if in edit mode', () => {
        sc.editMode = true;
        spyOn(sc, 'bindFunctions');
        spyOn(sc, 'handleStructureLoad');
        spyOn(sc, 'handleDataLoad');
        spyOn(sc.ns, 'getGroups').and.callFake(() => { return { then: () => {} }; });
        sc.onInit();
        expect(sc.ns.getGroups).toHaveBeenCalled();
    });


    it('has a function, that saves team members and users to the API', () => {
        spyOn(sc.ns, 'putGroups');
        sc.putGroups();
        expect(sc.ns.putGroups).toHaveBeenCalled();
    });

});
