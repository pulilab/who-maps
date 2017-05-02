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
        expect(vm.createFilterCategory.calls.count()).toBe(1);
        expect(vm.filterArray.length).toEqual(1);
    });

    it('has an extractConstraints fn,', () => {
        const ret = vm.extractConstraints({ 'key': 'value', 'key2': 'value2' });
        expect(ret).toContain('key');
        expect(ret).toContain('key2');
    });

    it('has a concatenateApplications fn.', () => {
        const ret = vm.concatenateApplications({
            'first': { 'subApplications': { 'a': 1, 'b': 2 } },
            'second': { 'subApplications': { 'c': 3, 'd': 4 } } }
        );
        expect(ret).toContain(1);
        expect(ret).toContain(2);
        expect(ret).toContain(3);
        expect(ret).toContain(4);
    });

    it('has a createFilterCategory fn.', () => {
        const ret = vm.createFilterCategory(
          'filtername',
          { 'key': 1.1, 'key2': 1.2, 'key3': 2.0 },
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

        const countryObj = { name: 'aa' };
        vm.updateCountry(countryObj);
        expect(vm.changeMapTo).toHaveBeenCalledWith(countryObj);
        expect(vm.getProjects).toHaveBeenCalledWith(countryObj);

        countryObj.name = 'Show all countries';
        vm.updateCountry(countryObj);
        expect(vm.changeMapTo.calls.count()).toBe(1);
        expect(vm.getProjects.calls.count()).toBe(2);
    });

    it('has changeMapTo fn.', () => {
        const countryMock = { id: 'id' };
        spyOn(vm.EE, 'emit');
        spyOn(vm, 'fetchCountryMap');
        spyOn(vm, 'fetchDistrictProjects');

        vm.changeMapTo(countryMock);

        expect(vm.EE.emit).toHaveBeenCalledWith('country Changed');
        expect(vm.fetchCountryMap).toHaveBeenCalledWith('id');
        expect(vm.fetchDistrictProjects).toHaveBeenCalledWith('id');
    });

    it('has a filterByPlatforms Fn.', () => {
        const filters = {
            'platforms': ['Bamboo']
        };
        const projects = [
            {
                id: 1,
                platforms:  [
                    { name: 'Bamboo' }
                ]
            },
            {
                id:2,
                platforms: undefined
            }];
        const result = vm.filterByPlatforms(projects, filters);
        expect(result.length).toBe(1);
    });

    it('has filterClv fn.', () => {
        vm.filterArray = [
            {
                'name': 'continuum',
                'items': [
                    {
                        'name': 'Identify target populations',
                        'value': true
                    },
                    {
                        'name': 'Health promotion and intervention',
                        'value': false
                    }
                ],
                'open': false
            },
            {
                'name': 'constraints',
                'items': [
                    {
                        'name': 'Availability',
                        'value': false
                    },
                    {
                        'name': 'Utilization',
                        'value': false
                    }
                ],
                'open': false
            }
        ];
        spyOn(vm.EE, 'emit');
        spyOn(vm, 'filterByPlatforms');
        vm.countryProjects = [{
            id: 1,
            platforms:  [
                { name: 'Bamboo' }
            ]
        }];
        vm.filterClv();
        expect(vm.filterByPlatforms).toHaveBeenCalled();
        expect(vm.EE.emit).toHaveBeenCalledWith('projectFiltered', vm.projectsData);
    });


    it('has a print implementing_partners fn', () => {
        const result = vm.printImplementingPartners({ implementing_partners: [1, 2] });
        expect(result).toBe('1, 2');
    });

});
