import _ from 'lodash';
import moment from 'moment';
import NewProjectService from './NewProjectService';
import ProjectDefinition from '../ProjectDefinition';
import CommonService  from '../CommonServices';

/* global DEV, Promise */

class NewProjectController extends ProjectDefinition {

    constructor($scope, $state, structure) {
        super();
        this.ns = new NewProjectService();
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;
        this.axisStructure = this.processAxisStructure(structure);
        this.$onInit = this.initialization.bind(this);
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
        this.handleStructureLoad();
        if (this.editMode) {
            this.projectId = this.state.params.appName;
            this.handleDataLoad();
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

    handleStructureLoad() {
        this.dataLoaded = true;
        this.structure = CommonService.projectStructure;
        this.structure.coverageTypes = ['clients', 'health workers', 'facilities'];
        this.scope.$evalAsync();
    }

    handleDataLoad() {
        const data = CommonService.getProjectData(this.projectId);
        this.createCoverageKeys(data);
        _.merge(this.project, data);

        this.userProjects = CommonService.projectList;
        this.project.date = moment(this.project.date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
        this.project.started = moment(this.project.started, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
        const country = _.filter(this.structure.countries, { id: this.project.country  });
        if (country[0] && country[0].name) {
            this.project.countryName = country[0].name;
        }

        this.ns.countryDistrict(this.project.country)
            .then(district => {
                this.districtList = district;
                this.unfoldCoverage();
                this.assignDefaultCustom();
                this.scope.$evalAsync();
            });

    }

    createCoverageKeys(data) {
        this.coverageKeys = _.chain(data.coverage)
            .map(item => {
                return _.keys(item);
            })
            .flatten()
            .filter(item => {
                return item !== 'district';
            })
            .map(item => {
                return item.replace('_', ' ');
            })
            .value();
    }

    assignDefaultCustom() {
        this.project.donors = _.map(this.project.donors, value => {
            return { value };
        });

        this.project.pre_assessment = _.map(this.project.pre_assessment, value => {
            return { value };
        });
    }

    unfoldCoverage() {
        const keys = _.cloneDeep(this.structure.coverageTypes);
        keys[1] = keys[1].replace(' ', '_');
        const newCoverage = [];
        _.forEach(this.project.coverage, coverage => {
            _.forEach(coverage, (props, key) => {
                if (keys.indexOf(key) > -1) {
                    newCoverage.push({
                        district: coverage.district,
                        districtChosen: coverage.district,
                        typeChosen: key.replace('_', ' '),
                        number: props
                    });
                }
                else if (this.coverageKeys.indexOf(key) > -1) {
                    newCoverage.push({
                        district: coverage.district,
                        districtChosen: coverage.district,
                        other: key,
                        number: props
                    });
                }
            });
        });
        this.project.coverage = newCoverage;
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

    checkErrors(field) {
        return !_.isEmpty(this.newProjectForm[field].$error);
    }


    save() {
        this.sentForm = true;
        if (this.newProjectForm.$valid) {
            const processedForm = _.cloneDeep(this.project);
            this.mergeCustomAndDefault(processedForm);
            this.createCoverageArray(processedForm);
            if (!this.editMode) {
                this.saveForm(processedForm);
            }
            else {
                this.updateForm(processedForm);
            }
        }
    }

    updateForm(processedForm) {
        this.ns.updateProject(processedForm, this.projectId)
            .then(response => {
                if (response && response.success) {
                    this.EE.emit('refreshProjects');
                }
                else {
                    this.handleResponse(response);
                }
            });
    }

    saveForm(processedForm) {
        processedForm.date = new Date().toJSON();
        this.ns.newProject(processedForm)
            .then(response => {
                if (response && response.success) {
                    this.EE.emit('refreshProjects');
                }
                else {
                    this.handleResponse(response);
                }

            });
    }

    handleResponse(response) {
        _.forEach(response.data, (item, key) => {
            this.newProjectForm[key].customError = item;
            this.newProjectForm[key].$setValidity('custom', false);
        });
    }

    flattenCustom(obj) {
        return this.unfoldObjects(obj.custom);
    }

    unfoldObjects(obj) {
        return _.chain(obj)
            .map(item => {
                item = item.value;
                return item;
            })
            .filter(item => {
                return !_.isNil(item);
            })
            .value();
    }

    concatCustom(obj) {
        const cat = _.concat(obj.custom, obj.standard);
        return _.filter(cat, item => {
            return !_.isNil(item) && !_.isEmpty(item);
        });
    }

    mergeCustomAndDefault(collection) {
        collection.technology_platforms.custom = this.flattenCustom(collection.technology_platforms);
        collection.technology_platforms = this.concatCustom(collection.technology_platforms);

        collection.licenses.custom = this.flattenCustom(collection.licenses);
        collection.licenses = this.concatCustom(collection.licenses);

        collection.digital_tools.custom = this.flattenCustom(collection.digital_tools);
        collection.digital_tools = this.concatCustom(collection.digital_tools);

        collection.pipelines = this.concatCustom(collection.pipelines);
        collection.donors = this.unfoldObjects(collection.donors);
        collection.pre_assessment = this.unfoldObjects(collection.pre_assessment);
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
