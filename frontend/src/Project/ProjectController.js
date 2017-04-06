import _ from 'lodash';
import moment from 'moment';
import NewProjectService from './ProjectService';
import ProjectDefinition from './ProjectDefinition';
import EditProfileService from '../Common/EditProfile/EditProfileService';

/* global DEV, DEBUG, Promise */

class ProjectController extends ProjectDefinition {

    constructor($scope, $state, Upload, CommonService, toast, $timeout) {
        super(CommonService);
        this.ns = new NewProjectService(Upload);
        this.es = new EditProfileService();
        this.ccs = require('../Common/CustomCountryService');
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;
        this.timeout = $timeout;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.postSaveActions = this.postSaveActions.bind(this);
        this.toast = toast;
    }

    eventListeners() {
        this.EE.on('projectScrollTo', this.scrollToFieldSet, this);
        this.EE.on('componentLoaded', this.automaticScroll, this);
        this.EE.on('activateFieldSet', this.changeHash, this);
    }

    onInit() {
        const self = this;
        this.eventListeners();
        this.districtList = [];
        this.dataLoaded = false;
        this.isAddAnother = false;
        this.handleStructureLoad();
        this.users = this.cs.usersProfiles;

        this.team = [];
        this.viewers = [];
        try {
            this.team.push(_.find(this.users, { id: this.userProfile.id }));
        }
        catch (e) {
            console.error('Auth token expired');
            this.EE.emit('unauthorized');
        }

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
        else {
            this.ccs.findCountryId(this.cs.userProfile.country).then(countryId => {
                this.scope.$evalAsync(() => {
                    self.project.country = countryId;
                });
            });
        }

        if (DEV) {
            this.fillTestForm();
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

    handleStructureLoad() {
        this.dataLoaded = true;
        this.structure = this.cs.projectStructure;
        this.scope.$evalAsync();
    }

    handleDataLoad(data) {
        data = _.cloneDeep(data);
        this.convertArrayToStandardCustomObj(data);
        this.userProjects = this.cs.projectList;
        data.start_date = this.convertDate(data.start_date);
        data.implementation_dates = this.convertDate(data.implementation_dates);
        data.end_date = this.convertDate(data.end_date);
        data = this.convertStringArrayToObjectArray(data);
        data = this.fillEmptyCollectionsWithDefault(data);
        this.scope.$evalAsync(() => {
            this.project = data;
        });

    }

    fillEmptyCollectionsWithDefault(data) {
        data.coverage = data.coverage ? data.coverage : [{}];
        data.platforms = data.platforms ? data.platforms : [{}];
        return Object.assign({}, data);
    }

    convertDate(date) {
        const dateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
        if (date) {
            return moment(date, dateFormat).toDate();
        }
        return undefined;
    }

    convertStringArrayToObjectArray(data) {
        const keyArray = ['donors', 'implementing_partners'];
        keyArray.forEach(key => {
            data[key] = data[key].map(value => {
                return { value };
            });
            if (data[key].length === 0) {
                data[key].push({});
            }
        });
        return Object.assign({}, data);
    }

    convertObjectArrayToStringArray(data) {
        const keyArray = ['donors', 'implementing_partners'];
        keyArray.forEach(key => {
            data[key] = data[key].map(value => value.value);
            data[key] = data[key].filter(item => item);
        });
        return Object.assign({}, data);
    }

    convertArrayToStandardCustomObj(data) {
        const keyArray = ['interoperability_standards', 'health_focus_areas', 'licenses'];

        keyArray.forEach(key=> {
            const scaffold = {
                standard: [],
                custom: void 0
            };
            this.structure[key] = _.union(this.structure[key], data[key]);
            scaffold.standard = data[key];
            data[key] = scaffold;
        });
    }

    createDateFields(processedForm) {
        processedForm.start_date = moment(this.project.start_date).toJSON();
        processedForm.end_date = moment(this.project.end_date).toJSON();
        processedForm.implementation_dates = moment(this.project.implementation_dates).toJSON();
        return Object.assign({}, processedForm);
    }

    removeEmptyChildObjects(processedForm) {
        const keyArray = ['coverage', 'platforms'];

        keyArray.forEach(key => {
            processedForm[key] = processedForm[key].filter(cov => {
                return Object.keys(cov).length > 1;
            });
        });

        return Object.assign({}, processedForm);
    }

    removeKeysWithoutValues(processedForm) {
        _.forEach(processedForm, (value, key) => {
            if (value === null || value === '') {
                processedForm[key] = undefined;
            }
        });
        return Object.assign({}, processedForm);
    }

    clearCustomErrors() {
        _.forEach(this.form, formItem => {
            if (formItem && formItem.customError && formItem.customError.length > 0) {
                formItem.$setValidity('custom', true);
                formItem.customError = [];
            }
        });
    }


    save() {
        this.clearCustomErrors();
        if (this.form.$valid) {
            let processedForm = Object.assign({}, this.project);
            processedForm.organisation = processedForm.organisation.id;
            processedForm = this.createDateFields(processedForm);
            processedForm = this.mergeCustomAndDefault(processedForm);
            processedForm = this.convertObjectArrayToStringArray(processedForm);
            processedForm = this.removeEmptyChildObjects(processedForm);
            processedForm = this.removeKeysWithoutValues(processedForm);
            processedForm.interoperability_links =  _.toArray(processedForm.interoperability_links);
            if (!this.editMode) {
                this.saveForm(processedForm);
            }
            else {
                this.updateForm(processedForm);
                this.putGroups();
            }
        }
        else {
            this.focusInvalidField();
        }

    }


    focusInvalidField() {
        this.showToast('Validation error');
        this.timeout(()=>{
            const firstInvalid = document.getElementById('npf').querySelector('.ng-invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }, 100);
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
                    this.showToast('Project Updated!');
                    this.postUpdateActions();
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
                    this.cs.addProjectToCache(response.data);
                    this.putGroups().then(() => {
                        this.postSaveActions();
                        this.showToast('Project Saved!');
                    });
                }
                else {
                    this.handleResponse(response);
                }

            });
    }

    fillTestForm() {
        const data = {
            'name': Math.random().toString(36).substr(2, 20),
            'organisation': {
                'id': 1,
                'name': 'Pulilab'
            },
            'country': 33,
            'countryName': null,
            'coverage': [
                {
                }
            ],
            'platforms': [
                {
                    'name': 'Bamboo',
                    'strategies': [
                        'Point of care and diagnostics'
                    ]
                }
            ],
            'licenses': {
                'standard': []
            },
            'donors': [
                {
                    'value': 'dsfdsfdsf'
                }
            ],
            'application': [],
            'reports': [
                {}
            ],
            'publications': [
                {}
            ],
            'links': [
                {}
            ],
            'contact_name': 'dfadsfdsfsdfas',
            'contact_email': 'dsf@dsaf.coim',
            'implementation_overview': 'dsfdsfdsf',
            'implementation_dates': new Date(),
            'health_focus_areas': {
                'standard': []
            },
            'geographic_scope': 'dsfds',
            'interoperability_links': [],
            'interoperability_standards': {
                'standard': []
            },
            'wiki': '',
            'repository': '',
            'mobile_application': '',
            'implementing_partners': [
            ],
            'data_exchanges': [],
            'his_bucket': [
                'a'
            ],
            'hsc_challenges': [
                'b'
            ],
            'interventions': [],
            'government_investor': false,
            'national_level_deployment': {
                'health_workers': 2,
                'facilities': 2,
                'clients': 2
            }
        };
        if (window.location.search.indexOf('test') > -1) {
            this.scope.$evalAsync(() => {
                this.project = data;
            });
        }
    }

    showToast(text) {
        this.toast.show(
            this.toast.simple()
                .textContent(text)
                .position('bottom right')
                .hideDelay(3000)
        );
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

    postUpdateActions() {
        this.EE.emit('projectListUpdated');
        const addAnother = this.isAddAnother;
        this.isAddAnother = false;
        if (addAnother) {
            const go = {
                state: 'newProject',
                appName: this.projectId
            };
            this.navigate(go);
        }
    }

    postSaveActions() {
        const addAnother = this.isAddAnother;
        this.isAddAnother = false;
        const go = {
            state: addAnother ? 'newProject' : 'editProject',
            appName: this.projectId
        };
        this.navigate(go);
    }

    navigate(go) {
        this.state.go(go.state, { appName: go.appName }, {
            location: 'replace',
            reload: true
        });
    }

    handleResponse(response) {
        const self = this;
        _.forEach(response.data, (item, key) => {
            if (this.form[key]) {
                this.form[key].customError = item;
                this.form[key].$setValidity('custom', false);
            }
            else {
                console.error('missing name in the form: ', key);
            }
        });
        this.scope.$evalAsync(()=>{
            self.focusInvalidField();
        });

    }

    concatCustom(obj) {
        const cat = _.concat(obj.custom, obj.standard);
        return _.filter(cat, item => {
            return !_.isNil(item) && !_.isEmpty(item);
        });
    }

    mergeCustomAndDefault(collection) {
        const self = this;
        const keyArray = ['interoperability_standards', 'licenses', 'health_focus_areas'];
        keyArray.forEach(key => {
            collection[key] = self.concatCustom(collection[key]);
        });
        return Object.assign({}, collection);
    }

    static newProjectFactory() {
        require('./Project.scss');
        const CommonService =  require('../Common/CommonServices');
        function newProject($scope, $state, Upload, $mdToast, $timeout) {
            return new ProjectController($scope, $state, Upload, CommonService, $mdToast, $timeout);
        }
        newProject.$inject = ['$scope', '$state', 'Upload', '$mdToast', '$timeout'];
        return newProject;
    }
}

export default ProjectController;
