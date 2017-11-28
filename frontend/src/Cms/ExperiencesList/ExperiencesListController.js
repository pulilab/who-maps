import * as CmsModule from '../../store/modules/cms';

class ExperienceListController {

    constructor($scope, $ngRedux) {
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
        this.unsubscribe = $ngRedux.connect(this.mapState, CmsModule)(this);
    }

    onInit() {
        this.domains = require('../resources/domains');
        const axisIndex = parseInt(this.axisId, 10);
        const domainIndex = parseInt(this.domainId, 10);
        this.domain = this.domains[axisIndex].domains[domainIndex];
        this.newExperience = {
            body: null,
            valid: false,
            name: null,
            domain: this.domain.id,
            type: 3
        };

        this.watchers();
    }

    mapState(state) {
        return {
            data: state.cms.data
        };
    }

    watchers() {
        this.scope.$watchCollection(() => {
            return this.data;
        }, data => {
            this.experiences = data.filter(exp => {
                return exp.domain === this.domain.id && exp.type === 3;
            });
        });
    }

    async saveExperience() {
        await this.saveOrUpdateContent(this.newExperience);
        this.newExperience.body = false;
        this.newExperience.name = null;
        this.form.$setUntouched();
        this.form.$setPristine();
    }

    disableAddButton(experience) {
        return !experience.valid || !experience.name || experience.name.length > 120;
    }

    static factory() {
        require('./ExperiencesList.scss');
        function experienceListController($scope, $ngRedux) {
            return new ExperienceListController($scope, $ngRedux);
        }
        experienceListController.$inject = ['$scope', '$ngRedux'];
        return experienceListController;
    }
}

export default ExperienceListController;
