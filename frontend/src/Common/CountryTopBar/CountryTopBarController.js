import TopBarBehaviour  from '../TopBarBheaviour';

class CountryTopBarController extends TopBarBehaviour {

    constructor($state, $scope, $timeout) {
        super($state, $scope);
        this.EE = window.EE;
        this.timeout = $timeout;
        this.ccs = require('../CustomCountryService');
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
        const vm = this;
        this.pageLoaded = false;
        this.watchers();
        this.commonInit();
        if (this.user) {
            this.cs.loadedPromise.then(vm.setProfileData.bind(vm));
        }
        const subDomain = this.ccs.getSubDomain();
        this.countryFlag = this.ccs.getCountryFlag(subDomain);
        this.ccs.getCountryData(subDomain).then(data => {
            this.scope.$evalAsync(() => {
                vm.countryData = data;
                vm.pageLoaded = true;
            });
        });

        window.onscroll = this.scrollEventHandler.bind(this);
        document.addEventListener('scroll', this.scrollEventHandler.bind(this), true);
    }

    watchers() {
        const self = this;
        this.scope.$watch(() => {
            return this.state.current.name;
        }, stateName => {
            stateName = stateName.replace(/ /g, '-');
            self.pageClass = `page-${stateName}`;
        });
    }

    setProfileData() {
        this.userProfile = this.cs.userProfile;
        if (this.userProfile) {
            this.profileDataReady = true;
        }
        this.scope.$evalAsync();
    }

    scrollEventHandler(e) {
        const vm = this;
        vm.timeout(() => {
            vm.isScrolled = e.target.scrollTop > 100 ? 'scrolled-down' : 'not-scrolled';
        });
    }

    static countryTopBarControllerFactory() {
        require('./countryTopBar.scss');
        function countryTopBarController($state, $scope, $timeout) {
            return new CountryTopBarController($state, $scope, $timeout);
        }

        countryTopBarController.$inject = ['$state', '$scope', '$timeout'];

        return countryTopBarController;
    }

}

export default CountryTopBarController;
