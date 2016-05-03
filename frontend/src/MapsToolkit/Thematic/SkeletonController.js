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

    }

    changeSpot(axisId, domainId) {
        this.axis = axisId;
        this.domain = domainId;
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
