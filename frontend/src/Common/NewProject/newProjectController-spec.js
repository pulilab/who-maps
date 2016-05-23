import NewProjectController from './NewProjectController';


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
    getProjectData: jasmine.createSpy('gpd')
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
        spyOn(sc.ns, 'newProject').and.returnValue(Promise.resolve());
        sc.save();
        expect(sc.mergeCustomAndDefault).toHaveBeenCalled();
        expect(sc.createCoverageArray).toHaveBeenCalled();
        expect(sc.saveForm).toHaveBeenCalled();
    });

    it('should have a function that save a new form', () => {
        spyOn(sc.ns, 'newProject').and.returnValue(Promise.resolve());
        sc.saveForm(sc.project);
        expect(sc.ns.newProject).toHaveBeenCalled();
    });

    it('should have a function that update an existing form', () => {
        spyOn(sc.ns, 'updateProject').and.returnValue(Promise.resolve());
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
        spyOn(sc.ns, 'countryDistrict').and.returnValue(Promise.resolve());
        spyOn(sc, 'unfoldCoverage');
        spyOn(sc, 'assignDefaultCustom');

        sc.handleStructureLoad(mockData);
        sc.handleDataLoad();
        expect(sc.createCoverageKeys).toHaveBeenCalled();
        expect(sc.unfoldCoverage).toHaveBeenCalled();
        expect(sc.assignDefaultCustom).toHaveBeenCalled();

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

});
