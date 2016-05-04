
class SkeletonController {

    constructor($scope) {

        const parent = $scope.$parent.vm;

        this.axis = parent.axis;
        this.domain = parent.domain;
        this.data = parent.data;
        this.text = parent.text;
        this.icons = parent.icons;

        this.domainActivationSetter(+this.axis, +this.domain, true);

        this.data = this.data.map((axis, aInd) => {
            axis.expand = aInd === this.axis;
            return axis;
        });

    }

    changeSpot(axisId, domainId) {
        domainId = domainId || 0;
        this.domainActivationSetter(+this.axis, +this.domain, false);
        this.axis = axisId;
        this.domain = domainId;
        this.domainActivationSetter(+this.axis, +this.domain, true);
    }

    domainActivationSetter(axisId, domainId, state) {
        this.data[axisId + 2].domains[domainId].active = state;
    }

    static skeletonFactory() {
        const skeleton = ($scope) => {
            return new SkeletonController($scope);
        };
        skeleton.$inject = ['$scope'];
        return skeleton;
    }
}

export default SkeletonController;
