import TopBarBehaviour  from '../TopBarBheaviour';
import { getSubDomain } from '../../Utilities';

class CountryTopBarController extends TopBarBehaviour {

    constructor($state, $scope, $timeout, $ngRedux) {
        super($state, $scope, $ngRedux);
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
        const subDomain = getSubDomain();
        this.countryFlag = this.ccs.getCountryFlag(subDomain);
        this.ccs.getCountryData(subDomain).then(data => {
            this.scope.$evalAsync(() => {
                vm.countryData = data;
                vm.pageLoaded = true;
                vm.showCountryNameAndFlag = vm.countryData && vm.countryData.name && vm.countryData.name !== 'WHO';
                vm.logoClass = vm.showCountryNameAndFlag ? 'has-country-logo' : '';
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
        function countryTopBarController($state, $scope, $timeout, $ngRedux) {
            return new CountryTopBarController($state, $scope, $timeout, $ngRedux);
        }

        countryTopBarController.$inject = ['$state', '$scope', '$timeout', '$ngRedux'];

        return countryTopBarController;
    }

}

export default CountryTopBarController;
