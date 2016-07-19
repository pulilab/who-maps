import { AuthApi } from '../Common/';
import _ from 'lodash';

/* global Promise */

class HssModuleService extends AuthApi {

    constructor(_projectId) {
        super('projects');
        this.projectId = _projectId;
    }

    getData() {
        return this.get(this.projectId + '/hss/data/');
    }

    updateDetail(data, id) {
        let status = void 0;
        return this.put(`${id}/`, data)
            .then(answer => {
                status = answer.status;
                return answer.json();
            })
            .then(json => {
                return {
                    success: status < 400,
                    data: json
                };
            });
    }


    postContinuum(data) {
        _.chain(data.colSpan)
            .range()
            .forEach(item => {
                const body = {
                    'column_id': (data.columnId + item),
                    state: data.activated
                };

                return this.post(this.projectId + '/hss/continuum/', body);
            })
            .value();
    }

    postInterventions(columnId, interventions) {
        return this.post(this.projectId + '/hss/interventions/', { 'column_id': columnId, interventions });
    }
    postSpecialPopulations(columnId, target_population) {
        return this.post(this.projectId + '/hss/targetpopulation/', { 'column_id': columnId, target_population });
    }
    postBubbles(data) {
        return this.post(this.projectId + '/hss/bubbles/', data);
    }
    postConstraints(data) {
        return this.post(this.projectId + '/hss/constraints/', data);
    }
    postTaxonomy(appId, subAppId, content) {
        return this.post(this.projectId + '/hss/taxonomies/', { 'app_id': appId, 'subapp_id': subAppId, content });
    }

}

export default HssModuleService;
