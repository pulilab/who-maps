import _ from 'lodash';

class SkeletonController {

    constructor($scope, $interpolate, $anchorScroll) {
        this.scope = $scope;
        const parent = $scope.$parent.vm;
        this.interpolate = $interpolate;
        this.axis = +parent.axis;
        this.domain = +parent.domain;
        this.data = _.cloneDeep(parent.data);
        this.text = parent.text;
        this.icons = parent.icons;
        this.scroll = $anchorScroll;

        this.domainActivationSetter(+this.axis, +this.domain, true);

        this.templates = this.importHtmlTemplates();

        this.data = this.data.map((axis, aInd) => {
            axis.expand = (aInd - 2) === this.axis;
            return axis;
        });
    }

    importHtmlTemplates() {
        // Import the whole folder in an collection of string templates, needed for proper webpack optimizations
        const templates = {};
        const templateRequire = require.context('./static/', true, /\.html$/);
        templateRequire.keys().forEach((item) => {
            templates[item.slice(2)] = this.interpolate(templateRequire(item))(this.scope);
        });
        return templates;
    }

    axisClick(axis, id) {
        axis.expand = true;
        this.changeSpot(id - 2, 0);
    }

    changeSpot(axisId, domainId) {
        domainId = domainId || 0;
        this.domainActivationSetter(this.axis, this.domain, false);
        this.axis = axisId;
        this.domain = domainId;
        this.domainActivationSetter(this.axis, this.domain, true);

        this.scroll('help-anchor');
    }

    domainActivationSetter(axisId, domainId, state) {
        this.data[axisId + 2].domains[domainId].active = state;
    }

    static skeletonFactory() {
        const skeleton = ($scope, $interpolate, $anchorScroll) => {
            return new SkeletonController($scope, $interpolate, $anchorScroll);
        };
        skeleton.$inject = ['$scope', '$interpolate', '$anchorScroll'];
        return skeleton;
    }
}

export default SkeletonController;
