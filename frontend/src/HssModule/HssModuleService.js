import { AuthApi } from '../Common/';
import _ from 'lodash';


class HssModuleService extends AuthApi {

    constructor() {
        super('projects/');
    }

    getStructure() {
        return this.get('hss/structure/');
    }

    getData() {
        return this.get('3/hss/data/');
    }


    postContinuum(data) {
        _.chain(data.colSpan)
            .range()
            .forEach(item => {
                const body = {
                    'column_id': (data.columnId + item)
                };
                body[data.type] = data.activated;

                return this.post('3/hss/continuum/', body);
            })
            .value();
    }

    postInterventions(columnId, interventions) {
        return this.post('3/hss/interventions/', { 'column_id': columnId, interventions });
    }
    postBubbles(data) {
        return this.post('3/hss/bubbles/', data);
    }
    postConstraints(data) {
        return this.post('3/hss/constraints/', data);
    }
    postTaxonomy(appId, subAppId, content) {
        return this.post('3/hss/taxonomies/', { 'app_id': appId, 'subapp_id': subAppId, content });
    }

}

export default HssModuleService;
