import _ from 'lodash';
import { normalizeName } from '../utilities';
import * as CmsModule from '../../store/modules/cms';

class DashboardWidgetController {

    constructor($scope, $ngRedux) {
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
        this.watchers = this.watchers.bind(this);
        this.splitType = this.splitType.bind(this);
        this.unsubscribe = $ngRedux.connect(this.mapState, CmsModule)(this);
    }

    onInit() {
        this.axes = require('../resources/domains');
        this.domains = _.flatMap(this.axes, axis => {
            return axis.domains;
        });
        this.lessons = [];
        this.resources = [];
        this.experiences = [];
        this.currentDomain = this.domains[Math.floor(Math.random() * this.domains.length)];
        this.watchers();
    }

    mapState(state) {
        return {
            all: CmsModule.getCmsData(state)
        };
    }

    watchers() {
        this.scope.$watchGroup([s => s.vm.currentDomain, s => s.vm.scores], ([domain, scores]) => {
            if (domain && scores && scores.length > 0) {
                this.setDomainVariables(domain, scores);
                this.splitType(this.all);
            }
        });

        this.scope.$watchCollection(s => s.vm.all, this.splitType);
    }

    splitType(data) {
        if (this.currentDomain && this.currentDomain.id) {
            const id = this.currentDomain.id;
            this.resources = data.filter(item => item.type === 1 && item.domain === id);
            this.lessons = data.filter(item => item.type === 2 && item.domain === id);
            this.experiences = data.filter(item => item.type === 3 && item.domain === id);
        }
    }

    setDomainVariables(domain, scores) {
        const axis = this.axes.find(ax => {
            return ax.domains.some(d => {
                return d.id === domain.id;
            });
        });
        this.axisColor = normalizeName(axis.name);
        this.domainIcon = normalizeName(domain.name);
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

            this.domainScore = Math.round((selectedDomain.domain_sum * 100) / selectedDomain.domain_max);
        }
    }

    nextDomain() {
        let next = _.findIndex(this.domains, d => d.id === this.currentDomain.id) + 1;
        if (next > this.domains.length - 1) {
            next = 0;
        }
        this.currentDomain = this.domains[next];

    }

    prevDomain() {
        let prev = _.findIndex(this.domains, d => d.id === this.currentDomain.id) - 1;
        if (prev === -1) {
            prev = this.domains.length - 1;
        }
        this.currentDomain = this.domains[prev];

    }

    static factory() {
        require('./DashboardWidget.scss');
        function dashboardWidgetController($scope, $ngRedux) {
            return new DashboardWidgetController($scope, $ngRedux);
        }
        dashboardWidgetController.$inject = ['$scope', '$ngRedux'];
        return dashboardWidgetController;
    }
}

export default DashboardWidgetController;
