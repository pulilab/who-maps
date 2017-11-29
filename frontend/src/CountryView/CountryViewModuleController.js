import cloneDeep from 'lodash/cloneDeep';
import forEach from 'lodash/forEach';
import map from 'lodash/map';

import moment from 'moment';
import PDFExportStorage from './PDFExport/PDFExportStorage';
import * as CountryModule from '../store/modules/countries';
import * as UserModule from '../store/modules/user';

class CountryViewModuleController {

    constructor($scope, $filter, $state, $ngRedux) {
        this.scope = $scope;
        this.filter = $filter;
        this.state = $state;
        this.pdfStorage = PDFExportStorage.factory();
        this.$onInit = this.onInit.bind(this);
        this.generateFilters = this.generateFilters.bind(this);
        this.prepareFiltersCheckboxes = this.prepareFiltersCheckboxes.bind(this);
        this.watchers = this.watchers.bind(this);
        this.mapState = this.mapState.bind(this);
        this.applyFilters = this.applyFilters.bind(this);
        this.unsubscribe = $ngRedux.connect(this.mapState, CountryModule)(this);
    }

    mapState(state) {
        const mapData = CountryModule.getCurrentCountryMapData(state);
        const districtProjects = CountryModule.getCurrentCountryDistrictProjects(state);
        const selectedCountry = this.selectedCountry ? this.selectedCountry : CountryModule.getCurrentCountry(state);
        const projectsData = CountryModule.getCurrentCountryProjects(state);
        const countryProjects = cloneDeep(projectsData);
        const nationalLevelCoverage = this.filterNLDProjects(projectsData, districtProjects);

        return {
            userProfile: UserModule.getProfile(state),
            countries: CountryModule.getCountriesList(state),
            countriesLib: CountryModule.getCountriesLib(state),
            selectedCountry,
            mapData,
            districtProjects,
            projectsData,
            countryProjects,
            nationalLevelCoverage
        };
    }


    onInit() {
        this.header = this.generateHeader();
        this.lastFilter = null;
        this.watchers();
        this.showAllCountries = { id: false, name: 'Show all countries' };
    }

    watchers() {
        this.scope.$watchCollection(s => s.vm.countryProjects, this.generateFilters);
        this.scope.$watch(s => s.vm.filters, this.applyFilters, true);
        this.scope.$watch(s => s.vm.selectedCountry, this.updateCountry.bind(this), true);
    }

    applyFilters(filters, oldValue) {
        if (!filters || !oldValue) {
            return;
        }
        const oldOpen = oldValue.map(c => c.open);
        const newOpen = filters.map(c => c.open);
        if (oldOpen.every((v, i) => v === newOpen[i]) && Array.isArray(this.countryProjects)) {
            //  this was not triggered by an open-close of the filter but by an actual selection, so we can filter here
            const filtered = [];
            for (const cat of filters) {
                const selected = cat.items.filter(i => i.value).map(s => s.name);
                const inArray = inp => {
                    return selected.indexOf(inp) > -1;
                };
                if (selected && selected.length > 0) {
                    for (const p of this.countryProjects) {
                        const inProject = cat.filterMappingFn(p);
                        if (inProject.some(inArray)) {
                            filtered.push(p);
                        }
                    }
                }
            }
            this.scope.$evalAsync(() => {
                const oldLength = Array.isArray(this.projectsData) ? this.projectsData.length : 0;
                if (filtered && filtered.length > 0) {
                    this.projectsData = filtered;
                }
                else {
                    this.projectsData = this.countryProjects;
                }
                if (this.projectsData.length !== oldLength) {
                    this.nationalLevelCoverage = this.filterNLDProjects(this.projectsData);
                    this.districtProjects = this.filterDLDProjects(this.projectsData);
                }
            });
        }
    }

    generateHeader() {
        return {
            name: { up: false, down: false },
            country: { up: false, down: false },
            organisation_name: { up: false, down: false },
            donors: { up: false, down: false },
            contact_name: { up: false, down: false },
            implementation_overview: { up: false, down: false },
            implementing_partners: { up: false, down: false },
            geographic_scope: { up: false, down: false },
            health_focus_areas: { up: false, down: false }
        };
    }

    prepareFiltersCheckboxes(mapper) {
        // Set guarantee uniqueness;
        let structure = new Set();
        for (const item of this.countryProjects) {
            let inner = [];
            if (mapper instanceof Function) {
                inner = mapper(item);
            }
            else {
                inner = item[mapper];
            }
            inner = inner ? inner : [];
            for (const s of inner) {
                structure.add(s);
            }
        }
        structure = Array.from(structure);
        return structure.map(s => {
            return {
                value: false,
                name: s
            };
        });
    }

    generateFilters(countryProjects) {
        if (!countryProjects || !Array.isArray(countryProjects)) {
            return;
        }
        const extractStrategies = p => {
            let r = [];
            for (const plat of p.platforms) {
                r = r.concat(plat.strategies);
            }
            return r;
        };
        const digitalHealthInterventions = {
            name: 'Digital Health Interventions',
            filterMappingFn: extractStrategies,
            open: false,
            items: this.prepareFiltersCheckboxes(extractStrategies)
        };

        const healthInterventions = {
            name: 'Health Focus Areas',
            filterMappingFn: p => {
                return Array.isArray(p.health_focus_areas) ? p.health_focus_areas : [];
            },
            open: false,
            items: this.prepareFiltersCheckboxes('health_focus_areas')
        };
        const healthInformationSystems = {
            name: 'Health Information Systems',
            filterMappingFn: p => {
                return Array.isArray(p.his_bucket) ? p.his_bucket : [];
            },
            open: false,
            items: this.prepareFiltersCheckboxes('his_bucket')
        };

        const healthSystemChallenges = {
            name: 'Health System Challenges',
            filterMappingFn: p => {
                return Array.isArray(p.hsc_challenges) ? p.hsc_challenges : [];
            },
            open: false,
            items: this.prepareFiltersCheckboxes('hsc_challenges')
        };

        const extractSoftware = p => {
            return p.platforms.map(plat => plat.name);
        };

        const software = {
            name: 'Software',
            filterMappingFn: extractSoftware,
            open: false,
            items: this.prepareFiltersCheckboxes(extractSoftware)
        };

        this.filters = [digitalHealthInterventions, healthInterventions,
            healthInformationSystems, healthSystemChallenges, software];
    }

    filterNLDProjects(allProjects) {
        let districtsIds = [];
        for (const d in this.countryDistrictProjects) {
            districtsIds = districtsIds.concat(this.countryDistrictProjects[d]);
        }
        districtsIds = Array.from(new Set(districtsIds));
        districtsIds = districtsIds.map(d =>  d.id);
        return allProjects.filter(p => districtsIds.indexOf(p.id) === -1);
    }

    filterDLDProjects(allProjects) {
        const newDistrictCoverage = {};
        const projectsId = allProjects.map(p=> p.id);
        for (const d in this.countryDistrictProjects) {
            const districtProjects =
              this.countryDistrictProjects[d].filter(p => projectsId.indexOf(p.id) > -1);
            if (districtProjects && districtProjects.length > 0) {
                newDistrictCoverage[d] = districtProjects;
            }
        }
        return newDistrictCoverage;
    }


    updateCountry(newVal, oldVal) {
        if (oldVal && (newVal.name !== oldVal.name)) {
            if (newVal.name !== 'Show all countries') {
                this.setCurrentCountry(newVal.id);
            }
            this.loadCountryProjectsOrAll(newVal.id);
        }

        if (this.projectsData.length === 0) {
            this.loadCountryProjectsOrAll(newVal.id);
        }

    }

    exportPDF() {
        this.pdfStorage.setData(this.projectsData, this.selectedCountry);
        const href = this.state.href('pdf-export');
        window.open(href);
    }

    async exportCSV() {
        const ids = map(this.projectsData, p => {
            return p.id;
        });
        const response = await CountryModule.csvExport(ids);

        const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${response}`);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `clv-export-${moment().format('MMMM-Do-YYYY-h-mm-ss ')}.csv`);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);

        link.click();
    }

    orderTable(name) {
        forEach(this.header, h => {
            h.up = false;
            h.down = false;
        });
        this.header[name].down = true;
        let lastFilter = null;
        let orderKey = `-${name}`;
        if (name !== this.lastFilter) {
            lastFilter = name;
            orderKey = name;
            this.header[name].down = false;
            this.header[name].up = true;
        }
        this.lastFilter = lastFilter;
        this.projectsData = this.filter('orderBy')(this.projectsData, orderKey);
    }

    printImplementingPartners({ implementing_partners }) {
        if (implementing_partners.length > 0) {
            return implementing_partners.join(', ').trim();
        }
        return '';
    }

    static countryControllerFactory() {
        function countryController($scope, $filter, $state, $ngRedux) {
            return new CountryViewModuleController($scope, $filter, $state, $ngRedux);
        }

        countryController.$inject = ['$scope', '$filter', '$state', '$ngRedux'];

        return countryController;
    }

}

export default CountryViewModuleController;
