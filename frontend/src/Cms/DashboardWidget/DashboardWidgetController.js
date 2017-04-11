import _ from 'lodash';

class DashboardWidgetController {

    constructor($scope) {
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
        const mockData = require('../resources/mockData');
        this.axes = require('../resources/domains');
        this.lessons = mockData.lessons;
        this.resources = mockData.resources;
        this.experiences = mockData.experiences;
        const domains = _.flatMap(this.axes, axis => {
            return axis.domains;
        });

        this.watchers();
        this.currentDomain = domains[Math.floor(Math.random() * domains.length)];
    }


    watchers() {
        const self = this;
        this.scope.$watchGroup([() => {
            return this.currentDomain;
        }, () => {
            return this.scores;
        }], ([domain, scores]) => {
            self.setDomainVariables(domain, scores);
        });
    }

    setDomainVariables(domain, scores) {
        const axis = this.axes.find(ax => {
            return ax.domains.indexOf(domain) > -1;
        });
        this.axisColor = this.normalizeName(axis.name);
        this.domainIcon = this.normalizeName(domain);
        if (scores) {
            const domainScores = _.flatMap(scores, score => {
                return score.domains;
            }).map(dom => {
                const domainNameParts = dom.domain.split(':');
                dom.name = domainNameParts.pop().toLowerCase().trim();
                return dom;
            });

            const selectedDomain = domainScores.find(score => {
                return score.name === domain.toLowerCase();
            });

            this.domainScore = (selectedDomain.domain_sum * 100) / selectedDomain.domain_max;
        }
    }

    normalizeName(name) {
        return name.toLowerCase().replace('&', 'and').replace(/ /g, '-');
    }

    static factory() {
        require('./DashboardWidget.scss');
        function dashboardWidgetController($scope) {
            return new DashboardWidgetController($scope);
        }
        dashboardWidgetController().$inject = ['$scope'];
        return dashboardWidgetController;
    }
}

export default DashboardWidgetController;
