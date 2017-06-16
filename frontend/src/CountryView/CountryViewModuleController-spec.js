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
        spyOn(vm, 'generateFilters');
        vm.$onInit();
        expect(vm.getCountries).toHaveBeenCalled();
        expect(vm.generateFilters).toHaveBeenCalled();
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


    it('has a print implementing_partners fn', () => {
        const result = vm.printImplementingPartners({ implementing_partners: [1, 2] });
        expect(result).toBe('1, 2');
    });

});
