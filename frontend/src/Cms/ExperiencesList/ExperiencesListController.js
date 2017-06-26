class ExperienceListController {

    constructor($scope) {
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
        this.cs = require('../CmsService');
        this.domains = require('../resources/domains');
        const axisIndex = parseInt(this.axisId, 10);
        const domainIndex = parseInt(this.domainId, 10);
        this.domain = this.domains[axisIndex].domains[domainIndex];
        this.data = [];
        this.getData();
        this.newExperience = {
            body: null,
            valid: false,
            name: null,
            domain: this.domain.id,
            type: 3
        };

        this.watchers();
    }

    getData() {
        return this.cs.getData().then(data => {
            this.data = data;
        });
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

    saveExperience() {
        return this.cs.addContent(this.newExperience).then(() => {
            this.scope.$evalAsync(() => {
                this.newExperience.body = false;
            });
        });
    }

    disableAddButton(experience) {
        return !experience.valid || !experience.name || experience.name.length > 120;
    }

    static factory() {
        require('./ExperiencesList.scss');
        function experienceListController($scope) {
            return new ExperienceListController($scope);
        }
        experienceListController.$inject = ['$scope'];
        return experienceListController;
    }
}

export default ExperienceListController;
