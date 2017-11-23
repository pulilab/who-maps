import TopBarBehaviour  from '../TopBarBheaviour';

class TopBarController extends TopBarBehaviour {

    constructor($state, $scope, $ngRedux) {
        super($state, $scope, $ngRedux);
        this.$onInit = this.onInit.bind(this);
        this.axis = 0;
        this.domain = 0;
        this.setAxisDomain = this.setAxisDomain.bind(this);
    }

    onInit() {
        this.commonInit();
        this.watchers();
    }

    watchers() {
        this.scope.$watch(s => s.vm.state.params, this.setAxisDomain);
    }

    setAxisDomain(params) {
        this.axis = params.axisId ? parseInt(params.axisId, 10) : 0;
        this.domain = params.domainId ? parseInt(params.domainId, 10) : 0;
    }

    showThematic() {
        return this.userModel;
    }

    static topBarControllerFactory() {
        require('./topBar.scss');
        function topBarController($state, $scope, $ngRedux) {
            return new TopBarController($state, $scope, $ngRedux);
        }

        topBarController.$inject = ['$state', '$scope', '$ngRedux'];

        return topBarController;
    }

}

export default TopBarController;
