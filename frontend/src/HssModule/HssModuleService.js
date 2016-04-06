import { AuthApi } from '../Common/';


class HssModuleService extends AuthApi {

    constructor() {
        super('projects/');
    }

    getStructure() {
        return this.get('hss/structure/');
    }

    getData() {
        return this.get('1/hss/data/');
    }


    postContinuum(data) {
        const body = {
            'column_id': data.columnId
        };
        body[data.type] = data.activated;

        return this.post('1/hss/continuum/', body);
    }

    postInterventions(data) {
        return this.post('interventions', data);
    }
    postBubbles(data) {
        return this.post('bubbles', data);
    }
    postConstraints(data) {
        return this.post('constraints', data);
    }
    postTaxonomy(data) {
        return this.post('taxonomy', data);
    }

}

export default HssModuleService;
