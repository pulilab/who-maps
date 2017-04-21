import _ from 'lodash';

class DashboardWidgetController {

    constructor($scope) {
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
        this.cs = require('../CmsService');
        this.axes = require('../resources/domains');
        this.domains = _.flatMap(this.axes, axis => {
            return axis.domains;
        });
        this.lessons = [];
        this.resources = [];
        this.experiences = [];
        this.all = [];
        this.getData();
        this.watchers();
        this.currentDomain = this.domains[Math.floor(Math.random() * this.domains.length)];
    }

    getData() {
        this.cs.getData().then(data => {
            this.scope.$evalAsync(() => {
                this.all = data;
            });
        });
    }


    watchers() {
        this.scope.$watchGroup([() => {
            return this.currentDomain;
        }, () => {
            return this.scores;
        }], ([domain, scores]) => {
            this.setDomainVariables(domain, scores);
            this.splitType(this.all);
        });

        this.scope.$watchCollection(() => {
            return this.all;
        }, data => {
            this.splitType(data);
        });
    }

    splitType(data) {
        const id = this.currentDomain.id;
        this.lessons = data.filter(item => item.type === 1 && item.domain === id);
        this.resources = data.filter(item => item.type === 2 && item.domain === id);
        this.experiences = data.filter(item => item.type === 3 && item.domain === id);
    }

    setDomainVariables(domain, scores) {
        const axis = this.axes.find(ax => {
            return ax.domains.indexOf(domain) > -1;
        });
        this.axisColor = this.normalizeName(axis.name);
        this.domainIcon = this.normalizeName(domain.name);
        if (scores) {
            const domainScores = _.flatMap(scores, score => {
                return score.domains.map(dom => {
                    const domainNameParts = dom.domain.split(':');
                    dom.name = domainNameParts.pop().toLowerCase().trim();
                    return dom;
                });
            });
            const selectedDomain = domainScores.find(score => {
                return score.name === domain.name.toLowerCase();
            });

            this.domainScore = (selectedDomain.domain_sum * 100) / selectedDomain.domain_max;
        }
    }

    nextDomain() {
        let next = this.domains.indexOf(this.currentDomain) + 1;
        if (next > this.domains.length - 1) {
            next = 0;
        }
        this.currentDomain = this.domains[next];

    }

    prevDomain() {
        let prev = this.domains.indexOf(this.currentDomain) - 1;
        if (prev === -1) {
            prev = this.domains.length - 1;
        }
        this.currentDomain = this.domains[prev];

    }

    normalizeName(name) {
        return name.toLowerCase().replace('&', 'and').replace(/ /g, '-');
    }

    static factory() {
        require('./DashboardWidget.scss');
        function dashboardWidgetController($scope) {
            return new DashboardWidgetController($scope);
        }
        dashboardWidgetController.$inject = ['$scope'];
        return dashboardWidgetController;
    }
}

export default DashboardWidgetController;
