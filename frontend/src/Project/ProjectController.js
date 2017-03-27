import _ from 'lodash';
import moment from 'moment';
import NewProjectService from './ProjectService';
import ProjectDefinition from './ProjectDefinition';
import EditProfileService from '../Common/EditProfile/EditProfileService';

/* global DEV, DEBUG, Promise */

const wholeCountryName = ' ENTIRE COUNTRY';

class ProjectController extends ProjectDefinition {

    constructor($scope, $state, Upload, CommonService, toast) {
        super(CommonService);
        this.ns = new NewProjectService(Upload);
        this.es = new EditProfileService();
        this.ccs = require('../Common/CustomCountryService');
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;

        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.toast = toast;
    }

    bindFunctions() {
        this.log = this.log.bind(this);
    }

    eventListeners() {
        this.EE.on('projectScrollTo', this.scrollToFieldSet, this);
        this.EE.on('componentLoaded', this.automaticScroll, this);
        this.EE.on('activateFieldSet', this.changeHash, this);
    }

    onInit() {
        this.bindFunctions();
        this.eventListeners();
        if (this.inventoryMode) {
            this.createBlurHandle();
        }
        this.districtList = [];
        this.dataLoaded = false;
        this.handleStructureLoad();
        this.users = this.cs.usersProfiles;

        this.team = [];
        this.viewers = [];
        this.team.push(_.find(this.users, { id: this.userProfile.id }));

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
    }

    onDestroy() {
        this.EE.removeListener('projectScrollTo', this.scrollToFieldSet);
        this.EE.removeListener('componentLoaded', this.automaticScroll);
        this.EE.removeListener('activateFieldSet', this.changeHash);
    }

    automaticScroll(fieldSet) {
        const hash = window.location.hash.replace('#', '');
        if (hash === fieldSet) {
            this.EE.emit('projectScrollTo', hash);
        }
    }

    scrollToFieldSet(hash) {
        const element = window.document.getElementById(hash);
        const toScroll = window.document.getElementsByClassName('main-content')[0];
        if (element) {
            this.EE.emit('activateFieldSet', hash);
            toScroll.scrollTop = element.offsetTop - 60;
        }
    }

    changeHash(hash) {
        const l = window.location;
        const url = `${l.protocol}//${l.host}${l.pathname}#${hash}`;
        history.replaceState({}, '', url);
    }

    isViewer(project) {
        return this.cs.isViewer(project);
    }

    isMember(project) {
        return this.cs.isMember(project);
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
        this.project.started = this.convertDate(this.project.started);
        this.project.implementation_dates = this.convertDate(this.project.implementation_dates);
        this.project.project_end_date = this.convertDate(this.project.project_end_date);

        this.unfoldCoverage();
        this.assignDefaultCustom();
        this.mergeNationalLevelWithDistrictCoverage();
        this.scope.$evalAsync();

    }

    convertDate(date) {
        const dateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
        if (date) {
            return moment(date, dateFormat).toDate();
        }
        return undefined;
    }


    convertArraytoStandardCustomObj(data) {
        const interoperability_standards = {
            standard: [],
            custom: void 0
        };
        const health_focus_areas = {
            standard: [],
            custom: void 0
        };
        const technology_platforms = {
            standard: [],
            custom: void 0
        };

        this.structure.interoperability_standards =
            _.union(this.structure.interoperability_standards, data.interoperability_standards);
        interoperability_standards.standard = data.interoperability_standards;
        data.interoperability_standards = interoperability_standards;

        this.structure.health_focus_areas =
            _.union(this.structure.health_focus_areas, data.health_focus_areas);
        health_focus_areas.standard = data.health_focus_areas;
        data.health_focus_areas = health_focus_areas;

        this.structure.technology_platforms =
            _.union(this.structure.technology_platforms, data.technology_platforms);
        technology_platforms.standard = data.technology_platforms;
        data.technology_platforms = technology_platforms;
    }

    mergeNationalLevelWithDistrictCoverage() {
        _.forEach(this.project.national_level_deployment, item => {
            item.district = wholeCountryName;
            this.project.coverage.push(item);
        });
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


    createDateFields(processedForm) {
        processedForm.started = moment(this.project.started).toJSON();
        processedForm.implementation_dates = moment(this.project.implementation_dates).toJSON();
    }


    save() {
        const processedForm = _.cloneDeep(this.project);
        this.createDateFields(processedForm);
        this.mergeCustomAndDefault(processedForm);
        this.createCoverageArray(processedForm);
        this.separateCoverageAndNationalLevelDeployments(processedForm);
        if (!this.editMode) {
            processedForm.contact_email = 'WIP@wip.com';
            processedForm.contact_name = 'TEMPORARY';
            processedForm.implementation_dates = new Date().toJSON();
            this.saveForm(processedForm);
        }
        else {
            this.updateForm(processedForm);
            this.putGroups();
        }

    }

    putGroups() {
        return this.ns.putGroups(this.projectId, this.team, this.viewers);
    }

    updateForm(processedForm) {
        this.ns.updateProject(processedForm, this.projectId)
            .then(response => {
                if (response && response.success) {
                    // update cached project data with the one from the backend
                    this.cs.updateProject(response.data, this.projectId);
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

                    this.toast.show(
                        this.toast.simple()
                            .textContent('Project Saved!')
                            .position('bottom right')
                            .hideDelay(3000)
                    );
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
        const go = 'editProject';
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
        collection.technology_platforms = this.concatCustom(collection.technology_platforms);

        collection.licenses = this.project.licenses;

        collection.interoperability_standards = this.concatCustom(collection.interoperability_standards);
        collection.licenses = this.concatCustom(collection.licenses);
        collection.health_focus_areas = this.concatCustom(collection.health_focus_areas);
        collection.interoperability_links = _.toArray(collection.interoperability_links);
        collection.donors = this.unfoldObjects(collection.donors);
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


    handleCustomError(key) {
        this.newProjectForm[key].$setValidity('custom', true);
        this.newProjectForm[key].customError = [];
    }

    setCustomError(key, error) {
        this.newProjectForm[key].$setValidity('custom', false);
        this.newProjectForm[key].customError.push(error);
    }


    static newProjectFactory() {
        require('./Project.scss');
        const CommonService =  require('../Common/CommonServices');
        function newProject($scope, $state, Upload, $mdToast) {
            return new ProjectController($scope, $state, Upload, CommonService, $mdToast);
        }
        newProject.$inject = ['$scope', '$state', 'Upload', '$mdToast'];
        return newProject;
    }
}

export default ProjectController;
