import _ from 'lodash';
import Protected from './Protected';

/* global define, Promise, DEV, Symbol */

const singleton = Symbol();
const singletonEnforcer = Symbol();


const loadingArray = ['list', 'structure', 'user-profile'];

class CommonServices extends Protected {

    constructor(enforcer) {
        super('');
        if (enforcer !== singletonEnforcer) {
            const error = { error: 'Cannot construct singleton' };
            throw error;
        }
        this.initialize();
    }

    initialize() {
        this.user = this.retrieveLoginStatus();
        this.projectList = [];
        this.hash = Math.random().toString(36);
        this.projectStructure = [];
        this.retrieveUser = this.retrieveUser.bind(this);
        this.loadingCheck = _.cloneDeep(loadingArray);
        this.promiseResolve = void 0;
        this.promiseReject = void 0;
        this.loadedPromise = new Promise((resolve, reject) => {
            this.promiseResolve = resolve;
            this.promiseReject = reject;
        });
        if (this.user) {
            this.loadData();
        }
    }

    uglifyCountryName(name) {
        let nameParts = name.replace(' ', '-').split('-');
        nameParts = _.map(nameParts, item =>{
            return _.lowerCase(item);
        });
        return nameParts.join('-');
    }

    prettifyCountryName(name) {
        let nameParts = name.replace('-', ' ').split(' ');
        nameParts = _.map(nameParts, item => {
            return _.capitalize(item);
        });
        return nameParts.join(' ');
    }

    reset() {
        this.initialize();
        return this;
    }

    loadData() {
        this.retrieveUser();
        this.populateProjectList();
        this.populateProjectStructure();
    }

    loadingProgress(name) {
        if (DEV) {
            console.log(this.loadingCheck, name);
        }
        _.remove(this.loadingCheck, item => {
            return item === name;
        });
        if (this.loadingCheck.length === 0) {
            this.mergeOperations();
            this.promiseResolve();
            this.loadingCheck = _.cloneDeep(loadingArray);
        }


    }

    mergeOperations() {
        if (DEV) {
            console.log('Project Structure loaded: ', this.projectStructure.countries);
        }
        _.forEach(this.projectList, project => {
            const country = _.find(this.projectStructure.countries, { id: project.country });
            if (country) {
                project.countryName = this.prettifyCountryName(country.name);
            }
        });

        _.forEach(this.projectStructure.countries, country => {
            country.name = this.prettifyCountryName(country.name);
        });
    }

    retrieveUser() {
        const vm = this;
        vm.get('userprofiles/').then(user => {
            vm.userProfile = user[0];
            vm.userProfile.email = this.user.username;
            this.loadingProgress('user-profile');
        });
    }

    populateProjectList() {
        const promiseArray = [];
        this.get('projects/')
            .then((projects) => {
                console.log('retrieved from server: ', projects);
                this.projectList = projects;
                _.forEach(projects, project => {
                    this.getProjectDetail(project);
                    promiseArray.push(project.detailPromise);
                });

                Promise.all(promiseArray)
                    .then(() => {
                        this.loadingProgress('list');
                    }, () => {
                        this.promiseReject();
                    });
            });
    }

    populateProjectStructure() {
        this.get('projects/structure/')
            .then(structure => {
                this.projectStructure = structure;
                this.loadingProgress('structure');
            }, () => {
                this.promiseReject();
            });
    }

    getProjectDetail(project) {
        project.detailPromise = this.get(`projects/${project.id}/`);
        project.detailPromise.then(data => {
            _.merge(project, data);
        });
    }

    getProjectData(_id) {
        const id = parseInt(_id, 10);
        return _.find(this.projectList, { id });
    }

    static commonServiceFactory() {
        if (!this[singleton]) {
            this[singleton] = new CommonServices(singletonEnforcer);
        }
        return this[singleton];
    }
}

export default CommonServices.commonServiceFactory();
