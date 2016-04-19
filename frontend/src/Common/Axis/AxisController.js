import _ from 'lodash';


class AxisController {

    constructor() {
    }


    static axisFactory() {
        require('./Axis.scss');
        function signup($scope) {
            return new AxisController($scope);
        }
        signup.$inject = ['$scope'];
        return signup;
    }
}

export default AxisController;
