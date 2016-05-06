import _ from 'lodash';
import NewProjectService from './NewProjectService';
import ProjectDefinition from '../ProjectDefinition';

/* global DEV */

class NewProjectController extends ProjectDefinition {

    constructor($scope, $state, structure) {
        super();
        this.ns = new NewProjectService();
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;
        this.axisStructure = this.processAxisStructure(structure);
        this.$onInit = this.initialization.bind(this);
        this.ns.projectStructure().then(this.handleStructureLoad.bind(this));
        this.bindFunctions();
    }

    bindFunctions() {
        this.countryCloseCallback = this.countryCloseCallback.bind(this);
        this.districtCloseCallback = this.districtCloseCallback.bind(this);
        this.setStrategy = this.setStrategy.bind(this);
        this.pipelinesCallback = this.pipelinesCallback.bind(this);
        this.log = this.log.bind(this);
    }

    initialization() {
        this.districtList = [];
        this.dataLoaded = false;
        this.sentForm = false;
        this.ns.projectStructure().then(this.handleStructureLoad.bind(this));
        if (this.editMode) {
            this.projectId = this.state.params.appName;
            this.ns.projectData(this.projectId)
                .then(answer => {
                    _.merge(this.project, answer);
                    console.log(this.project);
                });
        }
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

    handleStructureLoad(data) {
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
        this.handleCustomError('country');
    }

    handleDistrictData(data) {
        this.districtList = data;
        this.scope.$evalAsync();
    }

    repeatBind(item, form) {
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

    checkErrors(field) {
        return !_.isEmpty(this.newProjectForm[field].$error);
    }

    save() {
        this.sentForm = true;
        if (this.newProjectForm.$valid) {
            const processedForm = _.cloneDeep(this.project);
            this.mergeCustomAndDefault(processedForm);
            this.createCoverageArray(processedForm);
            processedForm.date = new Date().toJSON();
            this.ns.newProject(processedForm)
                .then(response => {
                    if (response && response.success) {
                        this.EE.emit('refreshProjects');
                    }
                    else {
                        _.forEach(response.data, (item, key) => {
                            this.newProjectForm[key].customError = item;
                            this.newProjectForm[key].$setValidity('custom', false);
                        });
                    }

                });
        }
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
            else if (item.typeChosen) {
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

    handleCustomError(key) {
        this.newProjectForm[key].$setValidity('custom', true);
        this.newProjectForm[key].customError = [];

    }


    static newProjectFactory() {
        require('./NewProject.scss');
        const structure = require('./Resources/structure.json');

        function newProject($scope, $state) {
            return new NewProjectController($scope, $state, structure);
        }
        newProject.$inject = ['$scope', '$state'];
        return newProject;
    }
}

export default NewProjectController;
