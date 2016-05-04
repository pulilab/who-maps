// import angular from 'angular';

class SkeletonController {

    constructor($scope) {

        // console.log('SkeletonController loaded!!');

        const parent = $scope.$parent.vm;

        this.axis = parent.axis;
        this.domain = parent.domain;
        this.data = parent.data;
        this.text = parent.text;
        this.icons = parent.icons;

        this.domainActivationSetter(+this.axis, +this.domain, true);

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
