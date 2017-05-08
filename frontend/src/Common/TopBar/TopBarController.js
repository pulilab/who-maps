import TopBarBehaviour  from '../TopBarBheaviour';

class TopBarController extends TopBarBehaviour {

    constructor($state, $scope) {
        super($state, $scope);
        this.$onInit = this.onInit.bind(this);
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
