import CountryViewModuleController from './CountryViewModuleController';

/* global define, it, describe, xit, expect, jasmine, Promise */

let cvc = null;

const $scope = {};

const orderBy = jasmine.createSpy('orderBy').and.returnValue([]);

const $filter = jasmine.createSpy('filter').and.returnValue(orderBy);

const cs = {
    hssStructure: {
        continuum: {},
        interventions: {},
        applications: {},
        taxonomies: {}
    },
    projectStructure: {
        technology_platforms: {}
    }
};


const service = {

};

const mapService = {
    getCountries:  jasmine.createSpy('getCountries').and.returnValue(Promise.resolve())
};

describe('CountryViewModuleController', () => {

    beforeEach(()=>{
        cvc = new CountryViewModuleController($scope, $filter, cs);
        cvc.service = service;
        cvc.mapService = mapService;
        cvc.$onInit();
    });

    it('should have an onInit function', () => {
        expect(cvc.$onInit).toBeDefined();
        expect(cvc.getCountries).toBeDefined();
        expect(cvc.createFilterCategory).toBeDefined();
        spyOn(cvc, 'createFilterCategory');
        spyOn(cvc, 'getCountries');
        cvc.$onInit();
        expect(cvc.createFilterCategory).toHaveBeenCalled();
        expect(cvc.getCountries).toHaveBeenCalled();
    });

    it('should have a function to extract constraints', () => {
        const collection = {
            a: [1, 2],
            b: [3, 4]
        };
        const extract = cvc.extractConstraints(collection);
        expect(extract).toContain('a');
        expect(extract.length).toBe(2);
    });

    it('should have a function to concatenate applications', () => {
        const applications = [
            { subApplications: ['a', 'b'] },
            { subApplications: ['c', 'd'] }
        ];

        const result = cvc.concatenateApplications(applications);
        expect(result).toContain('d');
        expect(result.length).toBe(4);
    });

    it('should have a function that creates the filter category', ()=> {
        expect(cvc.createFilterCategory).toBeDefined();
    });

    it('should have a function that replace lower dash', () => {
        const result = cvc.replaceLodash('_a');
        expect(result).toBe(' a');
    });

    it('should have a function that order by the name', () => {
        cvc.orderTable('name');
        expect(cvc.filter).toHaveBeenCalled();
    });

});
