import Protected  from '../Protected';

class CountryTopBarController extends Protected {

    constructor($state, $scope, $timeout) {
        super();
        this.EE = window.EE;
        this.state = $state;
        this.scope = $scope;
        this.timeout = $timeout;
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
        const vm = this;
        this.defaultOnInit();
        self.profileDataReady = false;
        this.cs = require('../CommonServices');
        this.ccs = require('../CustomCountryService');
        if (this.user) {
            this.cs.loadedPromise.then(() => {
                vm.userProfile = vm.cs.userProfile;
                vm.profileDataReady = true;
                vm.scope.$evalAsync();
            });
        }
        const subDomain = this.ccs.getSubDomain();
        this.countryFlag = this.ccs.getCountryFlag(subDomain);
        this.ccs.getCountryData(subDomain).then(data => {
            this.scope.$evalAsync(() => {
                vm.countryData = data;
            });
        });

        window.onscroll = this.scrollEventHandler.bind(this);
        document.addEventListener('scroll', this.scrollEventHandler.bind(this), true);
    }

    scrollEventHandler(e) {
        const vm = this;
        vm.timeout(() => {
            vm.isScrolled = e.target.scrollTop > 100 ? 'scrolled-down' : 'not-scrolled';
        });
    }


    hasProfile() {
        return this.cs.hasProfile();
    }

    showNewProjectButton() {
        return this.profileDataReady && this.userProfile.account_type === 'I' && this.hasProfile();
    }

    showCountryLevelViewButton() {
        return this.isLogin;
    }

    showGoToMyDashboardButton() {
        return this.profileDataReady;
    }

    showSearch() {
        return this.showFullNavigation;
    }
    showLogin() {
        return !this.isLogin;
    }

    showSignUp() {
        return !this.isLogin;
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
