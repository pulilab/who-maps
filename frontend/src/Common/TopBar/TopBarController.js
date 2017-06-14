import TopBarBehaviour  from '../TopBarBheaviour';

class TopBarController extends TopBarBehaviour {

    constructor($state, $scope) {
        super($state, $scope);
        this.$onInit = this.onInit.bind(this);
        this.axis = 0;
        this.domain = 0;
        this.setAxisDomain = this.setAxisDomain.bind(this);
    }

    onInit() {
        const self = this;
        this.commonInit();
        if (this.user) {
            this.cs.loadedPromise.then(() => {
                self.userProfile = self.cs.userProfile;
                if (self.userProfile) {
                    self.profileDataReady = true;
                }
                self.scope.$evalAsync();
            });
        }
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
        return this.isLogin;
    }

    static topBarControllerFactory() {
        require('./topBar.scss');
        function topBarController($state, $scope) {
            return new TopBarController($state, $scope);
        }

        topBarController.$inject = ['$state', '$scope'];

        return topBarController;
    }

}

export default TopBarController;
