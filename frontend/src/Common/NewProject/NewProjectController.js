import _ from 'lodash';
import NewProjectService from './NewProjectService';

class NewProjectController {

    constructor($scope) {
        this.ns = new NewProjectService();
        this.project = {
            name: 'test',
            organisation: 'test',
            country: 1,
            countryName:'bangladesh',
            coverage: [{}],
            'technology_platforms': {
                standard: [],
                custom: [{}]
            },
            licenses: {
                standard: [],
                custom: [{}]
            },
            'digital_tools': {
                standard: [],
                custom: [{}]
            },
            'pre_assessment': Array(10),
            donors: [{}],
            application: [],
            reports: [{}],
            publications: [{}],
            pipelines: {
                standard: [],
                custom: void 0
            }

        };
        this.districtList = [];
        this.scope = $scope;
        this.dataLoaded = false;
        this.ns.projectStructure().then(this.handleDataLoad.bind(this));
        this.countryCloseCallback = this.countryCloseCallback.bind(this);
        this.districtCloseCallback = this.districtCloseCallback.bind(this);
    }

    addTechnologyPlatform() {
        this.project.technology_platforms.custom.push({});
    }
    rmTechnologyPlatform(t) {
        _.remove(this.project.technology_platforms.custom, item => {
            return item.$$hashKey === t.$$hashKey;
        });
    }

    technologyPlatformChange(t) {
        if (this.technologyPlatformChecked(t)) {
            _.remove(this.project.technology_platforms.standard, item => {
                return item === t;
            });
        }
        else {
            this.project.technology_platforms.standard.push(t);
        }
    }

    technologyPlatformChecked(t) {
        return this.project.technology_platforms.standard.indexOf(t) > -1;
    }


    licenseChange(t) {
        if (this.licenseChecked(t)) {
            _.remove(this.project.licenses.standard, item => {
                return item === t;
            });
        }
        else {
            this.project.licenses.standard.push(t);
        }
    }

    licenseChecked(t) {
        return this.project.licenses.standard.indexOf(t) > -1;
    }

    digitalToolChange(t) {
        if (this.digitalToolChecked(t)) {
            _.remove(this.project.digital_tools.standard, item => {
                return item === t;
            });
        }
        else {
            this.project.digital_tools.standard.push(t);
        }
    }

    digitalToolChecked(t) {
        return this.project.digital_tools.standard.indexOf(t) > -1;
    }

    applicationChange(t) {
        if (this.applicationChecked(t)) {
            _.remove(this.project.application, item => {
                return item === t;
            });
        }
        else {
            this.project.application.push(t);
        }
    }

    applicationChecked(t) {
        return this.project.application.indexOf(t) > -1;
    }

    addLicense() {
        this.project.licenses.custom.push({});
    }

    rmLicense(l) {
        _.remove(this.project.licenses.custom, item => {
            return item.$$hashKey === l.$$hashKey;
        });
    }

    addDigitalTool() {
        this.project.digital_tools.custom.push({});
    }

    rmDigitalTool(d) {
        _.remove(this.project.digital_tools.custom, item => {
            return item.$$hashKey === d.$$hashKey;
        });
    }


    addReportLink() {
        this.project.reports.push({});
    }

    rmReportLink(l) {
        _.remove(this.project.reports, item => {
            return item.$$hashKey === l.$$hashKey;
        });
    }


    addPublicationLink() {
        this.project.publications.push({});
    }

    rmPublicationLink(l) {
        _.remove(this.project.publications, item => {
            return item.$$hashKey === l.$$hashKey;
        });
    }

    addDonor() {
        this.project.donors.push({});
    }

    rmDonor(l) {
        _.remove(this.project.donors, item => {
            return item.$$hashKey === l.$$hashKey;
        });
    }


    handleDataLoad(data) {
        this.dataLoaded = true;
        this.structure = data;
        this.structure['technology_platforms'] = ['a', 'b', 'c', 'd'];
        this.structure['licenses'] = ['a', 'b', 'c', 'd'];
        this.structure['digital_tools'] = ['a', 'b', 'c', 'd'];
        this.structure['applications'] = ['a', 'b', 'c', 'd'];

        this.scope.$evalAsync();
    }

    countryCloseCallback(name) {
        const countries = _.filter(this.structure.countries, { name: name });
        this.project.countryName = name;
        this.project.country = countries[0].id;
        this.ns.countryDistrict(this.project.country)
            .then(this.handleDistrictData.bind(this));
    }

    handleDistrictData(data) {
        this.districtList = data;
        this.scope.$evalAsync();
    }

    repeatBind(item) {
        item.callBack = this.districtCloseCallback.bind(this, item);
    }

    districtCloseCallback(coverage, district) {
        coverage.district = district;
        console.log(this.project);
    }

    addCoverageItem() {
        this.project.coverage.push({});
    }

    save() {
        let processedForm = _.cloneDeep(this.project);
        this.mergeCustomAndDefault(processedForm);
        this.createCoverageArray(processedForm)
        console.log(processedForm);
    }

    flattenCustom(obj) {
        return _.map(obj.custom, item => {
            item = item.value;
            return item;
        });
    }

    concatCustom(obj) {
        return _.concat(obj.custom, obj.standard);
    }

    mergeCustomAndDefault(collection) {
        collection.technology_platforms.custom = this.flattenCustom(collection.technology_platforms);
        collection.technology_platforms = this.concatCustom(collection.technology_platforms);

        collection.licenses.custom = this.flattenCustom(collection.licenses);
        collection.licenses = this.concatCustom(collection.licenses);

        collection.digital_tools.custom = this.flattenCustom(collection.digital_tools);
        collection.digital_tools = this.concatCustom(collection.digital_tools);

        collection.pipelines = this.concatCustom(collection.pipelines);
    }

    createCoverageArray(collection) {
        const coverage = {};
        _.forEach(collection.coverage, item => {
            let type = void 0;
            if (item.other) {
                type = item.other;
            }
            else {
                type = item.type;
            }
            if (!coverage[item.district]) {
                coverage[item.district] = {};
            }
            coverage[item.district][type] = item.number;
            coverage[item.district].district = item.district;
        });

        collection.coverage = [];
        _.forEach(coverage, item => {
            collection.coverage.push(item);
        });
    }


    disableDetails() {
        return _.isNil(this.project.name) || _.isNil(this.project.organisation) || _.isNil(this.project.country);
    }

    handleCustomError(newProjectForm, key) {
        newProjectForm[key].$setValidity('custom', true);
        newProjectForm[key].customError = [];

    }


    static newProjectFactory() {
        require('./NewProject.scss');
        function newProject($scope) {
            return new NewProjectController($scope);
        }
        newProject.$inject = ['$scope'];
        return newProject;
    }
}

export default NewProjectController;
