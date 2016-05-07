import { AuthApi } from '../Common/';
import _ from 'lodash';

/* global Promise */

class HssModuleService extends AuthApi {

    constructor(_projectId) {
        super('projects');
        this.projectId = _projectId;
    }

    getDetail() {
        return this.get(`${this.projectId}/`);
    }

    getStructure() {
        return this.get('hss/structure/');
    }

    getData() {
        return this.get(this.projectId + '/hss/data/');
    }


    postContinuum(data) {
        _.chain(data.colSpan)
            .range()
            .forEach(item => {
                const body = {
                    'column_id': (data.columnId + item)
                };
                body[data.type] = data.activated;

                return this.post(this.projectId + '/hss/continuum/', body);
            })
            .value();
    }

    postInterventions(columnId, interventions) {
        return this.post(this.projectId + '/hss/interventions/', { 'column_id': columnId, interventions });
    }
    postBubbles(data) {
        return this.post(this.projectId + '/hss/bubbles/', data);
    }
    postConstraints(data) {
        return this.post(this.projectId + '/hss/constraints/', data);
    }
    postTaxonomy(appId, subAppId, content) {
        if (content.length > 0) {
            return this.post(this.projectId + '/hss/taxonomies/', { 'app_id': appId, 'subapp_id': subAppId, content });
        }
        return Promise.resolve({});
    }

}

export default HssModuleService;
