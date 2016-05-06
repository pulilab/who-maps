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
describe('NewProjectController', () => {

    beforeEach(() => {
        spyOn(NewProjectController.prototype, 'handleDistrictData').and.callThrough();
        sc = NewProjectController.newProjectFactory()($scope);
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

        sc.handleStructureLoad(mockData);
        expect(sc.dataLoaded).toBeTruthy();
        expect(sc.structure.coverageTypes.length).toBe(3);
        expect(sc.scope.$evalAsync).toHaveBeenCalled();

    });

    it('should have a function that handles the country ssmenu callback', () => {
        spyOn(sc.ns, 'countryDistrict').and.returnValue(Promise.resolve());
        sc.handleStructureLoad(mockData);
        sc.countryCloseCallback('asd');
        expect(sc.project.countryName).toBe('asd');
        expect(sc.ns.countryDistrict).toHaveBeenCalled();
    });

    it('should have a function that save the data', () => {
        spyOn(sc, 'mergeCustomAndDefault');
        spyOn(sc, 'createCoverageArray');
        spyOn(sc.ns, 'newProject').and.returnValue(Promise.resolve());
        sc.save();
        expect(sc.mergeCustomAndDefault).toHaveBeenCalled();
        expect(sc.createCoverageArray).toHaveBeenCalled();
        expect(sc.ns.newProject).toHaveBeenCalled();
    });

});
