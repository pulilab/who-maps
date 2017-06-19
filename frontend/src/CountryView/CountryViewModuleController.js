import _ from 'lodash';
import moment from 'moment';
import CountryService from './CountryService.js';
import PDFExportStorage from './PDFExport/PDFExportStorage';

class CountryViewModuleController {

    constructor($scope, $filter, $state,  CommonService) {

        this.EE = window.EE;
        this.cs = CommonService;
        this.scope = $scope;
        this.filter = $filter;
        this.state = $state;
        this.mapService = require('../Common/CustomCountryService');
        this.service = new CountryService();
        this.pdfStorage = PDFExportStorage.factory();
        this.$onInit = this.onInit.bind(this);
        this.generateFilters = this.generateFilters.bind(this);
        this.prepareFiltersCheckboxes = this.prepareFiltersCheckboxes.bind(this);
        this.flatGrandparentParent = this.flatGrandparentParent.bind(this);
        this.watchers = this.watchers.bind(this);
        this.applyFilters = this.applyFilters.bind(this);
    }


    onInit() {
        this.header = this.generateHeader();
        this.getCountries();
        this.lastFilter = null;
        this.watchers();
    }

    watchers() {
        this.scope.$watchCollection(s => s.vm.countryProjects, this.generateFilters);
        this.scope.$watch(s => s.vm.filters, this.applyFilters, true);
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
                    this.EE.emit('projectsUpdated', this.projectsData);
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
            interventions: { up: false, down: false },
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
                return Array.isArray(p.interventions) ? p.interventions : [];
            },
            open: false,
            items: this.prepareFiltersCheckboxes('interventions')
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

    flatGrandparentParent(collection, parentName, childName) {
        let result = [];
        for (const grandpa of collection) {
            result = result.concat(this.flatParent(grandpa[parentName], childName));
        }
        return Array.from(new Set(result));
    }

    flatParent(collection, childName) {
        let result = [];
        for (const item of collection) {
            result = result.concat(item[childName]);
        }
        return result;
    }


    getCountries() {

        this.mapService.getCountries().then(data => {
            this.countries = data.slice();
            this.countriesLib = {};
            this.countries.forEach(country => {
                this.countriesLib[country.id] = country.name;
            });

            // console.debug('COUNTRY LIB', this.countriesLib);
            this.countries.unshift({ id: false, name: 'Show all countries' });

            if (this.cs.userProfile && this.cs.userProfile.country) {
                const name = this.cs.userProfile.country;
                this.selectedCountry = _.find(this.countries, { name });
                this.updateCountry(this.selectedCountry);
                this.scope.$evalAsync();
            }
        });
    }

    isViewer(project) {
        return this.cs.isViewer(project);
    }

    isMember(project) {
        return this.cs.isMember(project);
    }


    getProjects(countryObj) {
        // console.debug('Selected:', countryObj);
        this.service.getProjects(countryObj.id).then(data => {
            // console.debug('PROJECTS in ' + countryObj.name, data);
            this.projectsData = data;
            this.countryProjects = _.cloneDeep(data);
            this.EE.emit('projectsUpdated', data);
        });
    }

    updateCountry(countryObj) {
        if (countryObj.name !== 'Show all countries') {
            this.changeMapTo(countryObj);
        }
        this.getProjects(countryObj);
    }

    changeMapTo(countryObj) {
        // console.log('chosen country:', countryObj);
        this.EE.emit('country Changed');
        this.fetchCountryMap(countryObj.id);
        this.fetchDistrictProjects(countryObj.id);
    }

    // For map TAB
    fetchDistrictProjects(countryId) {
        this.service.getDistrictProjects(countryId).then(data => {
            // console.debug('getDistrictProjects:', data);
            this.EE.emit('mapdataArrived', data);
        });
    }

    fetchCountryMap(id) {
        this.mapService.getCountryMapData(id).then(data => {
            this.EE.emit('topoArrived', data);
        });
    }

    exportPDF() {
        this.pdfStorage.setData(this.projectsData, this.selectedCountry);
        const href = this.state.href('pdf-export');
        window.open(href);
    }

    exportCSV() {
        const ids = _.map(this.projectsData, p => {
            return p.id;
        });
        this.service.exportCSV(ids).then(response => {
            const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${response}`);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `clv-export-${moment().format('MMMM-Do-YYYY-h-mm-ss ')}.csv`);
            link.setAttribute('target', '_blank');
            document.body.appendChild(link);

            link.click();
        });
    }

    orderTable(name) {
        _.forEach(this.header, h => {
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
        function countryController($scope, $filter, $state) {
            const CommonService = require('../Common/CommonServices');
            return new CountryViewModuleController($scope, $filter, $state, CommonService);
        }

        countryController.$inject = ['$scope', '$filter', '$state'];

        return countryController;
    }

}

export default CountryViewModuleController;
