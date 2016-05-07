import _ from 'lodash';
import NewProjectService from './NewProjectService';
import ProjectDefinition from '../ProjectDefinition';

/* global DEV */

class NewProjectController extends ProjectDefinition {

    constructor($scope, structure) {
        super();
        this.ns = new NewProjectService();
        this.districtList = [];
        this.scope = $scope;
        this.axisStructure = this.processAxisStructure(structure);
        this.dataLoaded = false;
        this.ns.projectStructure().then(this.handleDataLoad.bind(this));
        this.countryCloseCallback = this.countryCloseCallback.bind(this);
        this.districtCloseCallback = this.districtCloseCallback.bind(this);
        this.setStrategy = this.setStrategy.bind(this);
        this.pipelinesCallback = this.pipelinesCallback.bind(this);
        this.log = this.log.bind(this);
    }

    importIconTemplates() {
        // Import the whole folder in an collection of string templates, needed for proper webpack optimizations
        const templates = {};
        const templateRequire = require.context('./Resources/images/', true, /\.svg$/);
        templateRequire.keys().forEach((item) => {
            const key = item.split('.')[1].replace('/', '');
            templates[key] = templateRequire(item);
        });
        return templates;
    }

    processAxisStructure(structure) {
        const icons = this.importIconTemplates();
        _.forEach(structure, element => {
            element.img = icons[element.image];
        });
        return structure;
    }

    handleDataLoad(data) {
        this.dataLoaded = true;
        this.structure = data;
        this.structure.coverageTypes = ['clients', 'health workers', 'facilities'];
        this.scope.$evalAsync();
    }

    countryCloseCallback(name) {
        const countries = _.filter(this.structure.countries, { name });
        if (countries.length === 1) {
            this.project.countryName = name;
            this.project.country = countries[0].id;
            this.ns.countryDistrict(this.project.country)
                .then(this.handleDistrictData.bind(this));
        }
    }

    handleDistrictData(data) {
        this.districtList = data;
        this.scope.$evalAsync();
    }

    repeatBind(item) {
        item.districtCallback = this.districtCloseCallback.bind(this, item);
        item.typeCallback = this.typeCloseCallback.bind(this, item);
    }

    typeCloseCallback(coverage, type) {
        coverage.typeChosen = type;
    }

    districtCloseCallback(coverage, district) {
        coverage.district = district;
    }

    pipelinesCallback(data) {
        this.project.pipelines.standard = [];
        this.project.pipelines.standard.push(data);
    }

    setStrategy(strategy) {
        this.project.strategy = strategy;
    }


    save() {
        const processedForm = _.cloneDeep(this.project);
        this.mergeCustomAndDefault(processedForm);
        this.createCoverageArray(processedForm);
        processedForm.date = new Date().toJSON();
        this.ns.newProject(processedForm);
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

    log(data) {
        if (DEV) {
            console.log(data);
            console.log(this.project);
        }
    }

    createCoverageArray(collection) {
        const coverage = {};
        _.forEach(collection.coverage, item => {
            let type = void 0;
            if (item.other) {
                type = item.other;
            }
            else {
                type = item.typeChosen.replace(' ', '_');
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

    handleCustomError(newProjectForm, key) {
        newProjectForm[key].$setValidity('custom', true);
        newProjectForm[key].customError = [];

    }


    static newProjectFactory() {
        require('./NewProject.scss');
        const structure = require('./Resources/structure.json');

        function newProject($scope) {
            return new NewProjectController($scope, structure);
        }
        newProject.$inject = ['$scope'];
        return newProject;
    }
}

export default NewProjectController;
