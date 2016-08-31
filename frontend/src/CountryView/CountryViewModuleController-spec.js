import CountryViewModuleController from './CountryViewModuleController';

/* global define, it, describe, expect, spyOn, beforeEach, jasmine, Promise, xit */

let vm = {};
const scope = {
    $evalAsync: () => {}
};

const csMock = {
    hssStructure: {
        continuum: {}
    },
    projectStructure: {
        technology_platforms: {}
    },
    isViewer: () => {},
    isMember: () => {}
};

const EE = {
    emit: () => {}
};

describe('CountryViewModuleController', () => {

    beforeEach(() => {
        vm = CountryViewModuleController.countryControllerFactory()(scope);
        vm.cs = csMock;
        vm.EE = EE;
    });

    it('has onInit fn. which gets countries, and generates filterArray', () => {
        spyOn(vm, 'getCountries');
        spyOn(vm, 'createFilterCategory').and.returnValue(1);

        vm.$onInit();
        expect(vm.getCountries).toHaveBeenCalled();
        expect(vm.createFilterCategory.calls.count()).toBe(5);
        expect(vm.filterArray.length).toEqual(5);
    });

    it('has an extractConstraints fn,', () => {
        const ret = vm.extractConstraints({'key': 'value', 'key2': 'value2'});
        expect(ret).toContain('key');
        expect(ret).toContain('key2');
    });

    it('has a concatenateApplications fn.', () => {
        const ret = vm.concatenateApplications(
            {
                'first': {'subApplications': {'a': 1, 'b': 2}},
                'second': {'subApplications': {'c': 3, 'd': 4}},
            }
        );
        expect(ret).toContain(1);
        expect(ret).toContain(2);
        expect(ret).toContain(3);
        expect(ret).toContain(4);
    });

    it('has a createFilterCategory fn.', () => {
        const ret = vm.createFilterCategory(
            'filtername',
            {'key': 1.1, 'key2': 1.2, 'key': 2.0},
            'key',
            null,
            a => a++
        );
        expect(ret.name).toBe('filtername');
        expect(Array.isArray(ret.items)).toBe(true);
        expect(ret.open).toBe(false);
    });

    it('has a replaceLodash fn.', () => {
        expect(vm.replaceLodash()).toBe('');
        expect(vm.replaceLodash('a_b')).toBe('a b');
    });

    it('has the commonservices\' isViewer and isMember fn.s', () => {
        spyOn(vm.cs, 'isViewer');
        spyOn(vm.cs, 'isMember');
        vm.isViewer('a');
        vm.isMember('b');
        expect(vm.cs.isViewer).toHaveBeenCalledWith('a');
        expect(vm.cs.isMember).toHaveBeenCalledWith('b');
    });

    it('has updateCountry fn.', () => {
        spyOn(vm, 'changeMapTo');
        spyOn(vm, 'getProjects');

        const countryObj = {name: 'aa'};
        vm.updateCountry(countryObj);
        expect(vm.changeMapTo).toHaveBeenCalledWith(countryObj);
        expect(vm.getProjects).toHaveBeenCalledWith(countryObj);

        countryObj.name = 'Show all countries';
        vm.updateCountry(countryObj);
        expect(vm.changeMapTo.calls.count()).toBe(1);
        expect(vm.getProjects.calls.count()).toBe(2);
    });

    it('has changeMapTo fn.', () => {
        const countryMock = {id: 'id'};
        spyOn(vm.EE, 'emit');
        spyOn(vm, 'fetchCountryMap');
        spyOn(vm, 'fetchDistrictProjects');

        vm.changeMapTo(countryMock);

        expect(vm.EE.emit).toHaveBeenCalledWith('country Changed');
        expect(vm.fetchCountryMap).toHaveBeenCalledWith('id');
        expect(vm.fetchDistrictProjects).toHaveBeenCalledWith('id');
    });

    it('has fetchDistrictProjects fn.', () => {
        spyOn(vm.EE, 'emit');
        spyOn(vm.service, 'getDistrictProjects').and.returnValue(new Promise((res, rej) => {
            res('resolved');
        }));

        vm.fetchDistrictProjects('id');
        expect(vm.service.getDistrictProjects).toHaveBeenCalledWith('id');
        expect(vm.EE.emit).toHaveBeenCalledWith('mapdataArrived', 'resolved');
    });

    it('has working fetchCountryMap fn.', () => {
        spyOn(vm.EE, 'emit');
        spyOn(vm.mapService, 'getCountryTopo').and.returnValue(new Promise((res, rej) => {
            res('resolved');
        }));

        vm.fetchCountryMap('id');
        expect(vm.mapService.getCountryTopo).toHaveBeenCalledWith('id');
        expect(vm.EE.emit).toHaveBeenCalledWith('topoArrived', 'resolved');
    });

    it('has working getProjects fn.', () => {
        spyOn(vm.EE, 'emit');
        spyOn(vm.service, 'getProjects').and.returnValue(new Promise((res, rej) => {
            res('resolved data');
        }));

        vm.getProjects({id: '1'});
        expect(vm.service.getProjects).toHaveBeenCalledWith('1');
        expect(vm.projectsData).toBe('resolved data');
        expect(vm.countryProjects).toBe('resolved data');
        expect(vm.EE.emit).toHaveBeenCalledWith('all country projects', 'resolved data');
    });

    it('has working getCountries fn.', () => {
        const countryCollMock = [
            {id: 0, name: 'c-te-d-ivoire'},
            {id: 1, name: 'tunguska'},
            {id: 2, name: 'albania'}
        ];
        spyOn(vm.mapService, 'getCountries').and.returnValue(new Promise((res, rej) => {
            res(countryCollMock);
        }));

        vm.getCountries();

        expect(vm.countriesLib[0]).toBe('cote d\'ivoire');
        expect(vm.countriesLib[1]).toBe('tunguska');
        expect(vm.countriesLib[2]).toBe('albania');
    });

    it('has generalFilter fn.', () => {
        const filters = {
            "continuum":["Identify target populations"],
            "interventions":[],
            "technology_platforms":[],
            "applications":[],
            "constraints":[]
        };
        vm.generalFilter(filters, 'continuum');
        expect(Array.isArray(filters.provisonalArray)).toBe(true);
    });

    it('has filterClv fn.', () => {
        vm.filterArray = [
          {
            "name": "continuum",
            "items": [
              {
                "name": "Identify target populations",
                "value": true
              },
              {
                "name": "Health promotion and intervention",
                "value": false
              }
            ],
            "open": false
          },
          {
            "name": "constraints",
            "items": [
              {
                "name": "Availability",
                "value": false
              },
              {
                "name": "Utilization",
                "value": false
              }
            ],
            "open": false
          }
        ];
        spyOn(vm.EE, 'emit');
        spyOn(vm, 'generalFilter');
        spyOn(vm, 'constraintsFilter');

        vm.filterClv();
        expect(vm.EE.emit).toHaveBeenCalledWith('projectsUpdated', vm.projectsData);
    });

    it('has constraintsFilter fn.', () => {
        const filters = {
            "continuum":["Identify target populations"],
            "interventions":[],
            "technology_platforms":[],
            "applications":[],
            "constraints":[]
        };
        vm.constraintsFilter(filters);

        expect(Array.isArray(filters.provisonalArray));

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
