import _ from 'lodash';
import moment from 'moment';
import NewProjectService from './NewProjectService';
import ProjectDefinition from '../ProjectDefinition';
import EditProfileService from '../EditProfile/EditProfileService';

/* global DEV, DEBUG, Promise */

const wholeCountryName = 'ENTIRE COUNTRY';

class NewProjectController extends ProjectDefinition {

    constructor($scope, $state, Upload, CommonService, structure) {
        super(CommonService);
        this.ns = new NewProjectService(Upload);
        this.es = new EditProfileService();
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;
        this.axisStructure = this.processAxisStructure(structure);
        this.$onInit = this.onInit.bind(this);
    }

    bindFunctions() {
        this.countryCloseCallback = this.countryCloseCallback.bind(this);
        this.districtCloseCallback = this.districtCloseCallback.bind(this);
        this.setStrategy = this.setStrategy.bind(this);
        this.pipelinesCallback = this.pipelinesCallback.bind(this);
        this.log = this.log.bind(this);
        this.getUsers = this.getUsers.bind(this);
    }

    onInit() {
        this.bindFunctions();
        this.districtList = [];
        this.dataLoaded = false;
        this.sentForm = false;
        this.handleStructureLoad();

        this.allUsers = this.cs.usersProfiles;

        this.team = [];
        this.viewers = [];
        this.team.push(_.find(this.allUsers, { id: this.userProfile.id }));

        if (this.editMode) {
            this.projectId = this.state.params.appName;
            this.cs.getProjectData(this.projectId)
                .then(this.handleDataLoad.bind(this));
            this.ns.getGroups(this.state.params.appName)
                .then(groups => {
                    this.team = groups.data.team;
                    this.viewers = groups.data.viewers;
                });
        }

        if (this.inventoryMode) {
            this.project.organisation = void 0;
        }

    }

    isViewer(project) {
        return this.cs.isViewer(project);
    }

    isMember(project) {
        return this.cs.isMember(project);
    }


    getUsers(criteria) {
        return this.allUsers.filter(el => {
            if (el && el.name) {
                return el.name.toLowerCase().includes(criteria.toLowerCase()) ||
                    el.organisation__name.toLowerCase().includes(criteria.toLowerCase());
            }
            return false;
        });
    }

    putGroups() {
        return this.ns.putGroups(this.projectId, this.team, this.viewers);
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
        this.structure = this.cs.projectStructure;
        this.structure.coverageTypes = ['clients', 'health workers', 'facilities'];
        this.scope.$evalAsync();
    }

    handleDataLoad(data) {
        this.createCoverageKeys(data);
        this.convertArraytoStandardCustomObj(data);
        _.merge(this.project, data);
        this.userProjects = this.cs.projectList;
        this.project.date = moment(this.project.date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
        this.project.started = moment(this.project.started, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();

        this.ns.countryDistrict(this.project.country)
            .then(district => {
                this.districtList = district;
                this.mergeNationalLevelWithDistrictCoverage();
                this.unfoldCoverage();
                this.assignDefaultCustom();
                this.addDefaultEmpty();
                this.scope.$evalAsync();
            });
        this.scope.$evalAsync();

    }

    convertArraytoStandardCustomObj(data) {
        const interoperability_standards = {
            standard: [],
            custom: void 0
        };

        this.structure.interoperability_standards = _.union(this.structure.interoperability_standards, data.interoperability_standards)
        interoperability_standards.standard = data.interoperability_standards;
        data.interoperability_standards = interoperability_standards;


    }

    mergeNationalLevelWithDistrictCoverage() {
        this.districtList.unshift(wholeCountryName);
        _.forEach(this.project.national_level_deployment, item => {
            item.district = wholeCountryName;
            this.project.coverage.push(item);
        });
    }

    addDefaultEmpty() {
        this.project.files.push({ type: 'report', id: -1 });
        this.project.files.push({ type: 'publication', id: -1 });
    }

    customOrder(a) {
        if (a.id === -1) {
            return Infinity;
        }
        return a.id;
    }


    isCurrentProject(projectId) {
        return parseInt(projectId, 10) === parseInt(this.projectId, 10);
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
            delete value.$$hashKey;
            if (!_.isEmpty(value)) {
                return { value };
            }
            return { 'value': '' };
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
        this.project.coverage = newCoverage.length > 0 ? newCoverage : [{}];
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
        this.mergeNationalLevelWithDistrictCoverage();
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
        if (this.newProjectForm && this.newProjectForm[field]) {
            return !_.isEmpty(this.newProjectForm[field].$error);
        }
        return true;
    }


    save() {
        this.sentForm = true;
        if (this.newProjectForm.$valid) {
            const processedForm = _.cloneDeep(this.project);
            this.mergeCustomAndDefault(processedForm);
            this.createCoverageArray(processedForm);
            this.separateCoverageAndNationalLevelDeployments(processedForm);
            if (!this.editMode) {
                this.saveForm(processedForm);
            }
            else {
                this.updateForm(processedForm);
                this.putGroups();
            }
        }
    }

    updateForm(processedForm) {
        this.ns.updateProject(processedForm, this.projectId)
            .then(response => {
                if (response && response.success) {
                    // update cached project data with the one from the backend
                    this.cs.updateProject(response.data, this.projectId);
                    this.state.go('dashboard');
                }
                else {
                    this.handleResponse(response);
                }
            });
    }

    saveForm(processedForm) {
        this.ns.newProject(processedForm)
            .then(response => {
                if (response && response.success) {
                    this.ownershipCheck(response.data);
                    if (this.inventoryMode) {
                        this.putGroups().then(this.postSaveActions.bind(this));
                    }
                    else {
                        this.postSaveActions();
                    }
                }
                else {
                    this.handleResponse(response);
                }

            });
    }

    ownershipCheck(project) {
        const id = this.userProfile.id;
        const rights = _.concat(this.team, this.viewers);
        if (rights.length > 0 && _.find(rights, { id })) {
            this.projectId = project.id;
        }
        else {
            const last  = _.last(this.cs.projectList);
            this.projectId = last && last.id ? last.id : null;
        }
    }

    postSaveActions() {
        const go = this.inventoryMode ?  'inventory' : 'editProject';
        this.EE.emit('refreshProjects', { go, appName: this.projectId });
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
        const copy = _.cloneDeep(collection);
        collection.organisation = copy.organisation.id;
        this.log(copy, collection);
        // collection.technology_platforms.custom = this.flattenCustom(collection.technology_platforms);
        collection.technology_platforms = this.project.technology_platforms;

        // collection.licenses.custom = this.flattenCustom(collection.licenses);
        collection.licenses = this.project.licenses;

        // collection.digital_tools.custom = this.flattenCustom(collection.digital_tools);
        // collection.digital_tools = this.concatCustom(collection.digital_tools);
        collection.interoperability_standards = this.concatCustom(collection.interoperability_standards);
        collection.interoperability_links = _.toArray(collection.interoperability_links);
        collection.pipelines = this.concatCustom(collection.pipelines);
        collection.donors = this.unfoldObjects(collection.donors);
        collection.pre_assessment = this.unfoldObjects(collection.pre_assessment);
        collection.wiki = this.project.wiki;
        collection.repository = this.project.repository;
        collection.mobile_application = this.project.mobile_application;
    }

    log(...args) {
        if (DEBUG) {
            args.forEach(item => {
                console.log(item);
            });
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

    separateCoverageAndNationalLevelDeployments(processedForm) {
        const filterWholeCountry = item => {
            return item.district === wholeCountryName;
        };
        processedForm.national_level_deployment = _.filter(processedForm.coverage, filterWholeCountry);
        processedForm.coverage = _.reject(processedForm.coverage, filterWholeCountry);
    }

    uploadFile(data, type) {
        const vm = this;
        this.ns.uploadFile(data, type, this.projectId)
            .then(result => {
                vm.project.files.splice(-2, 0, result.data[0]);
                vm.scope.$evalAsync();
            });
    }

    rmReportFile(f) {
        this.ns.deleteFile(f.id)
            .then(() => {
                this.delReportFile(f);
            });

    }

    rmPublicationFile(f) {
        this.ns.deleteFile(f.id)
            .then(() => {
                this.delPublicationFile(f);
            });
    }

    downloadFile(f) {
        this.ns.downloadFile(f);
    }


    handleCustomError(key) {
        this.newProjectForm[key].$setValidity('custom', true);
        this.newProjectForm[key].customError = [];
    }

    setCustomError(key, error) {
        this.newProjectForm[key].$setValidity('custom', false);
        this.newProjectForm[key].customError.push(error);
    }

    checkName() {
        this.handleCustomError('name');
        this.ns.autocompleteProjectName(this.project.name)
            .then(result => {
                _.forEach(result, project => {
                    project.isOwn = _.find(this.cs.projectList, pj => {
                        return pj.id === project.id;
                    });
                });
                this.similarProject = result;
                if (result && result[0] && result[0].name.toLowerCase() === this.project.name.toLowerCase()) {
                    this.setCustomError('name', 'Project name is not unique');
                }
                this.scope.$evalAsync();
            });
    }

    openSimilarProject(project, event) {
        event.preventDefault();
        if (project.isOwn) {
            this.state.go('dashboard', { appName: project.id });
        }
        else {
            this.state.go('public-dashboard', { appName: project.id });
        }

    }

    focusSpecifyField(index) {
        const field = document.getElementById(`interoperabilityLink_${index}`)
        if(!field.value) {
            field.value = 'http://';
        }
        field.focus();
    }

    interoperabilityLinkBlur(index) {
        const field = document.getElementById(`interoperabilityLink_${index}`)
        if (field.value === 'http://') {
            field.value = null;
        }
    }

    organisationSearch(name) {
        return this.es.autocompleteOrganization(name);
    }

    addOrganisation(name) {
        return this.es.addOrganization(name)
            .then(response => {
                this.userProfile.organisation = response;
            });
    }


    static newProjectFactory() {
        require('./NewProject.scss');
        const structure = require('./Resources/structure.json');
        const CommonService =  require('../CommonServices');
        function newProject($scope, $state, Upload) {
            return new NewProjectController($scope, $state, Upload, CommonService, structure);
        }
        newProject.$inject = ['$scope', '$state', 'Upload'];
        return newProject;
    }
}

export default NewProjectController;
