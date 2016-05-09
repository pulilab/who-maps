import _ from 'lodash';
import Protected from './Protected';

/* global define, Promise, DEV */

let commonServices = false;

class CommonServices extends Protected {

    constructor() {
        super('');
        this.projectList = [];
        this.projectStructure = [];
        this.populateProjectList();
        this.populateProjectStructure();
        this.eventRegistrations();

        this.loadingCounter = 2;
        this.promiseResolve = void 0;
        this.loadedPromise = new Promise((resolve) => {
            this.promiseResolve = resolve;
        });
    }

    eventRegistrations() {
        this.EE.on('refreshProjects', this.populateProjectList.bind(this));
        this.EE.on('projectListUpdated', this.loadingProgress.bind(this));
        this.EE.on('projectStructureLoaded', this.loadingProgress.bind(this));
    }

    loadingProgress() {
        this.loadingCounter -= 1;
        if (this.loadingCounter === 0) {
            this.loadingCounter = 2;
            this.mergeOperations();
            this.promiseResolve();
        }
    }

    mergeOperations() {
        _.forEach(this.projectList, project => {
            const country = _.find(this.projectStructure.countries, { id: project.country });
            project.countryName = country.name;
        });
    }

    populateProjectList() {
        const promiseArray = [];
        this.get('projects/')
            .then((projects) => {
                this.projectList = projects;
                _.forEach(projects, project => {
                    this.getProjectDetail(project);
                    promiseArray.push(project.detailPromise);
                });

                Promise.all(promiseArray)
                    .then(() => {
                        this.EE.emit('projectListUpdated');
                    });
            });

    }

    populateProjectStructure() {
        this.get('projects/structure/')
            .then(structure => {
                this.projectStructure = structure;
                this.EE.emit('projectStructureLoaded');
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
        if (!commonServices)  {
            commonServices = new CommonServices();
        }
        if (DEV) {
            console.log(commonServices);
        }
        return commonServices;
    }
}

export default CommonServices.commonServiceFactory();
