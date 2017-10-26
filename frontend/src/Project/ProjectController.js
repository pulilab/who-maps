import _ from 'lodash';
import moment from 'moment';
import NewProjectService from './ProjectService';
import * as ProjectModule from '../store/modules/projects';
import * as SystemModule from '../store/modules/system';
import * as UserModule from '../store/modules/user';

/* global DEV, DEBUG, Promise */

class ProjectController  {

    constructor($scope, $state, Upload, toast, $timeout, $ngRedux) {
        this.ns = new NewProjectService(Upload);
        this.ccs = require('../Common/CustomCountryService');
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;
        this.timeout = $timeout;
        this.$onInit = this.onInit.bind(this);
        this.postSaveActions = this.postSaveActions.bind(this);
        this.getCountryFields = this.getCountryFields.bind(this);
        this.registerEventIfNotPresent = this.registerEventIfNotPresent.bind(this);
        this.toast = toast;
        this.unsubscribeProjects = $ngRedux.connect(this.mapData, ProjectModule)(this);
    }

    mapData(state) {
        return {
            project: ProjectModule.getCurrentProjectForEditing(state),
            structure: ProjectModule.getProjectStructure(state),
            users: SystemModule.userProfiles(state),
            userProfile: UserModule.profile(state),
            projectId: ProjectModule.getCurrentProject(state),
            userProjects: ProjectModule.getPublishedProjects(state)
        };
    }

    eventListeners() {

        this.registerEventIfNotPresent('projectScrollTo', this.scrollToFieldSet);
        this.registerEventIfNotPresent('componentLoaded', this.automaticScroll);
        this.registerEventIfNotPresent('activateFieldSet', this.changeHash);
    }

    registerEventIfNotPresent(eventName, handler) {
        if (!this.EE.listeners(eventName, true)) {
            this.EE.on(eventName, handler, this);
        }
    }

    onInit() {
        const self = this;
        this.eventListeners();
        this.districtList = [];
        this.isAddAnother = false;

        this.team = [];
        this.viewers = [];
        try {
            this.team.push(_.find(this.users, { id: this.userProfile.id }));
        }
        catch (e) {
            console.error('Auth token expired');
        }

        if (this.editMode) {
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
        this.watchers();
    }

    watchers() {
        this.scope.$watch(s => s.vm.project.country, this.getCountryFields);
    }

    getCountryFields(country, oldValue) {
        // this is ugly like this otherwise the coverage reporter fails
        if (!country) {
            return;
        }
        if ((oldValue && country !== oldValue) || this.editMode === undefined) {
            this.ccs.getCountryFields(country).then(res => {
                this.scope.$evalAsync(() => {
                    this.countryFields = res;
                    this.showCountryFields = res && res.length > 0;
                });
            });
        }
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

    convertCountryFieldsAnswer({ fields }) {
        return fields.map(f => {
            switch (f.type) {
            case 2:
                f.answer = parseInt(f.answer, 10);
                break;
            case 3:
                f.answer = f.answer === 'true';
                break;
            }
            return f;
        });
    }

    handleDataLoad(data) {
        if (!data.fields || data.fields.length === 0) {
            this.getCountryFields(data.country, -1);
        }
        this.scope.$evalAsync(() => {
            this.project = data;
            if (data.fields && data.fields.length > 0) {
                this.countryFields = this.convertCountryFieldsAnswer(data);
            }
        });

    }

    convertObjectArrayToStringArray(data) {
        const keyArray = ['donors', 'implementing_partners'];
        keyArray.forEach(key => {
            if (!data[key]) {
                return;
            }
            data[key] = data[key].map(value => value.value);
            data[key] = data[key].filter(item => item);
        });
        return Object.assign({}, data);
    }


    createDateFields(processedForm) {
        processedForm.start_date = moment(this.project.start_date).toJSON();
        processedForm.end_date = moment(this.project.end_date).toJSON();
        processedForm.implementation_dates = moment(this.project.implementation_dates).toJSON();
        return Object.assign({}, processedForm);
    }

    deleteUndefinedAndDoubleDollarKeys(item) {
        const output = {};
        Object.keys(item).forEach(key => {
            if (item[key] !== undefined && key !== '$$hashKey') {
                output[key] = item[key];
            }
        });
        return output;
    }

    removeEmptyChildObjects(processedForm) {
        const keyArray = ['coverage', 'platforms'];
        keyArray.forEach(key => {
            processedForm[key] = processedForm[key].filter(itm => {
                itm = this.deleteUndefinedAndDoubleDollarKeys(itm);
                if (itm.hasOwnProperty('available')) {
                    delete itm.available;
                }
                return Object.keys(itm).length > 0;
            });
        });

        return Object.assign({}, processedForm);
    }

    removeKeysWithoutValues(processedForm) {
        return _.reduce(processedForm, (result, value, key) => {
            if (value === null || value === '' || _.isPlainObject(value) && _.every(_.values(value), _.isNull)) {
                result[key] = void 0;
            }
            else {
                result[key] = value;
            }
            return result;
        }, {});
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
            // we do this on the original project object to force the ui to update
            this.checkCoverageType(this.project);
            let processedForm = Object.assign({}, this.project);
            processedForm.organisation_name = processedForm.organisation.name;
            processedForm.organisation = processedForm.organisation.id;
            processedForm = this.createDateFields(processedForm);
            processedForm = this.mergeCustomAndDefault(processedForm);
            processedForm = this.convertObjectArrayToStringArray(processedForm);
            processedForm = this.removeEmptyChildObjects(processedForm);
            processedForm = this.removeKeysWithoutValues(processedForm);
            processedForm.coverageType = undefined;
            if (!this.editMode) {
                this.saveForm(processedForm);
            }
            else {
                this.updateForm(processedForm);
            }
        }
        else {
            this.focusInvalidField();
        }

    }

    checkCoverageType(processedForm) {
        if (processedForm.coverageType === 2) {
            processedForm.coverage = [{}];
        }
        else if (processedForm.coverageType === 1) {
            processedForm.national_level_deployment = undefined;
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

    async putGroups(project) {
        const id = project && project.id ? project.id : this.projectId;
        await this.ns.putGroups(id, this.team, this.viewers);
        return this.cs.retrieveMemberAndViewer();
    }

    async saveCountryFields({ country, id }) {
        const toSave = this.countryFields.map(f => {
            f = Object.assign({}, f);
            f.answer = f.type === 3 ? JSON.stringify(f.answer) : f.answer;
            f.project = id;
            return f;
        });
        return this.ns.saveCountryFields(toSave, country, id);
    }

    async updateForm(processedForm) {
        const response = await this.ns.updateProject(processedForm, this.projectId);
        if (response && response.success) {
            // generate a single promise from multiple promise and wait for them to be done.
            const [putGroupResult] = await Promise.all([this.putGroups(), this.saveCountryFields(response.data)]);
            // update cached project data with the one from the backend
            this.cs.updateProject(response.data, processedForm);
            this.showToast('Project Updated');
            this.postUpdateActions(putGroupResult);
        }
        else {
            this.handleResponse(response);
        }

    }

    async saveForm(processedForm) {
        try {
            const response = await this.ns.newProject(processedForm);
            if (response && response.success) {
                // eslint-disable-next-line no-unused-vars
                const [putGroupResult, countryFieldResult] = await Promise.all([
                    this.putGroups(response.data),
                    this.saveCountryFields(response.data)
                ]);
                response.data.fields = countryFieldResult.fields ? countryFieldResult.fields.slice() : null;
                this.cs.addProjectToCache(response.data, processedForm);
                this.ownershipCheck(response.data);
                this.postSaveActions(putGroupResult);
                this.showToast('Project Saved');

            }
            else {
                this.handleResponse(response);
            }
        }
        catch (e) {
            console.error(e);
        }
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
            'his_bucket': [
                'Client applications'
            ],
            'hsc_challenges': [
                'Delayed reporting of events',
                'Lack of population denominator'
            ],
            'health_focus_areas': [],
            'government_approved': false,
            'government_investor': 0,
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
        const toast = {
            template:
              `<md-toast id="custom-toast">
                <div class="md-toast-content">
                  <span>${text}</span>
                </div>
              </md-toast>`,
            autoWrap: false,
            hideDelay: 3000
        };

        this.toast.show(toast);
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

    postUpdateActions(putGroupResult) {
        this.EE.emit('projectListUpdated');
        const addAnother = this.isAddAnother;
        this.isAddAnother = false;
        const isMember = putGroupResult.member.indexOf(parseInt(this.projectId, 10)) > -1;
        if (addAnother || !isMember) {
            const go = {
                state: isMember ? 'newProject' : 'dashboard',
                appName: this.projectId
            };
            this.navigate(go);
        }
    }

    postSaveActions(putGroupResult) {
        const addAnother = this.isAddAnother;
        this.isAddAnother = false;
        const go = {
            state: addAnother ? 'newProject' : 'editProject',
            appName: this.projectId
        };
        const isMember = putGroupResult.member.indexOf(parseInt(this.projectId, 10)) > -1;
        go.state = isMember ? go.state : 'dashboard';
        this.navigate(go);
    }

    navigate(go) {
        this.state.go(go.state, { appName: go.appName }, {
            location: 'replace',
            reload: true
        });
    }

    addErrorArray(errors, key) {
        this.form[key].customError = errors;
        this.form[key].$setValidity('custom', false);
    }

    handleResponse(response) {
        _.forEach(response.data, (item, key) => {
            try {
                if (item && _.isPlainObject(item)) {
                    _.forEach(item, (errors, subKey) => {
                        this.addErrorArray(errors, `${key}.${subKey}`);
                    });
                }
                else if (item && item[0] && _.isPlainObject(item[0])) {
                    _.forEach(item, (obj, index) => {
                        _.forEach(obj, (errors, subKey) => {
                            const fieldName = `${key}_${index}.${subKey}`;
                            this.addErrorArray(errors, fieldName);
                        });

                    });
                }
                else {
                    this.addErrorArray(item, key);
                }
            }
            catch (e) {
                console.error(e);
            }
        });

        this.scope.$evalAsync(()=>{
            this.focusInvalidField();
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
        const keyArray = ['interoperability_standards', 'licenses'];
        keyArray.forEach(key => {
            collection[key] = self.concatCustom(collection[key]);
        });

        collection.platforms.forEach(p => {
            if (p.custom) {
                p.name = p.custom;
            }
        });
        return Object.assign({}, collection);
    }

    static newProjectFactory() {
        require('./Project.scss');
        function newProject($scope, $state, Upload, $mdToast, $timeout, $ngRedux) {
            return new ProjectController($scope, $state, Upload, $mdToast, $timeout, $ngRedux);
        }
        newProject.$inject = ['$scope', '$state', 'Upload', '$mdToast', '$timeout', '$ngRedux'];
        return newProject;
    }
}

export default ProjectController;
