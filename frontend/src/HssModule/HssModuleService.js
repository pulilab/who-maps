import { AuthApi } from '../Common/';


class HssModuleService extends AuthApi {

    constructor() {
        super('projects/1/hss');
    }

    getStructure() {
        return this.get('data');
    }

    getContinumData() {
        return this.get('continuum');
    }

    getInterventionsData() {
        return this.get('interventions');
    }

    getBubblesData() {
        return this.get('bubble');
    }

    getConstraintsData() {
        return this.get('constraints');
    }

    getTaxonomyData() {
        return this.get('taxonomies');
    }

    postContinuum(data) {
        return this.post('continuum', this.objectConverter(data));
    }

    postInterventions(data) {
        return this.post('interventions', this.objectConverter(data));
    }
    postBubbles(data) {
        return this.post('bubbles', this.objectConverter(data));
    }
    postConstraints(data) {
        return this.post('constraints', this.objectConverter(data));
    }
    postTaxonomy(data) {
        return this.post('taxonomy', this.objectConverter(data));
    }

}

export default HssModuleService;
