import NewProjectController from './NewProjectController';
import _ from 'lodash';


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

let sc = {};

const $scope = {
    $evalAsync: jasmine.createSpy('eval')
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

const upload = {};

const structure = require('./Resources/structure.json');

describe('NewProjectController', () => {

    beforeEach(() => {
        spyOn(NewProjectController.prototype, 'handleDistrictData').and.callThrough();
        sc = new  NewProjectController($scope, $state, upload, cs, structure);
        sc.newProjectForm = {
            $valid: true,
            $setValidity: jasmine.createSpy('$setValidity')
        };
        sc.startDateMonth = 2;
        sc.startDateYear = 2000;
        sc.startDateDay = 12;
        sc.project.health_focus_areas = {
            standard: [1,2,3],
            custom: void 0
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

    it('should have a function that handles the country ssmenu callback', () => {
        spyOn(sc.ns, 'countryDistrict').and.returnValue(Promise.resolve());
        spyOn(sc, 'handleCustomError');
        sc.handleStructureLoad();
        sc.countryCloseCallback('asd');
        expect(sc.project.countryName).toBe('asd');
        expect(sc.ns.countryDistrict).toHaveBeenCalled();
    });

    it('should have a function that handle the saving process ', () => {
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
        expect(sc.cs.updateProject).toHaveBeenCalled();
    });

    it('should have some utility function', () => {
        expect(sc.concatCustom).toBeDefined();
        expect(sc.unfoldObjects).toBeDefined();
        expect(sc.createCoverageArray).toBeDefined();
    });

    it('should have a function that handle the onInit when is in editMode', () => {
        spyOn(sc, 'handleDataLoad');
        spyOn(sc, 'handleStructureLoad');
        sc.editMode = true;
        sc.onInit();
        expect(sc.handleDataLoad).toHaveBeenCalled();
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
        spyOn(sc.ns, 'countryDistrict').and.returnValue(Promise.resolve({}));
        spyOn(sc, 'unfoldCoverage');
        spyOn(sc, 'assignDefaultCustom');
        spyOn(sc, 'mergeNationalLevelWithDistrictCoverage');
        spyOn(sc, 'addDefaultEmpty');
        spyOn(sc, 'convertArraytoStandardCustomObj');

        sc.handleStructureLoad(mockData);
        sc.handleDataLoad();
        expect(sc.createCoverageKeys).toHaveBeenCalled();
        expect(sc.unfoldCoverage).toHaveBeenCalled();
        expect(sc.assignDefaultCustom).toHaveBeenCalled();
        expect(sc.mergeNationalLevelWithDistrictCoverage).toHaveBeenCalled();
        expect(sc.addDefaultEmpty).toHaveBeenCalled();
        expect(sc.convertArraytoStandardCustomObj).toHaveBeenCalled();

    });

    it('should have a function that handles the national level deployment', () => {
        sc.project.national_level_deployment = [{ clients: 33 }];
        sc.mergeNationalLevelWithDistrictCoverage();
        expect(sc.districtList).toContain('ENTIRE COUNTRY');
        expect(_.filter(sc.project.coverage, item => item.district === 'ENTIRE COUNTRY').length).toBeGreaterThan(0);
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

    it('has a function, that parses all users, and returns if they contain the string (#1 fn param)', () => {
        expect(sc.getUsers).toBeDefined();
        sc.allUsers = [
            {
                name: 'Jess', organisation__name: 'Flikli'
            }, {
                name: 'Nico', organisation__name: 'Pulilab'
            }, {
                name: 'Tigest', organisation__name: 'WHO'
            }
        ];
        expect(sc.getUsers('tig')[0].organisation__name).toBe('WHO');
        expect(sc.getUsers('E').length).toBe(2);
    });

    it('has a function, that saves team members and users to the API', () => {
        spyOn(sc.ns, 'putGroups');
        sc.putGroups();
        expect(sc.ns.putGroups).toHaveBeenCalled();
    });

});
