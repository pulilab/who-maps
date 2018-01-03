import TopBarBehaviour from '../TopBarBheaviour';
import * as CountryModule from '../../store/modules/countries';
import * as UserModule from '../../store/modules/user';

class CountryTopBarController extends TopBarBehaviour {

    constructor($state, $scope, $timeout, $ngRedux) {
        super($state, $scope, $ngRedux);
        this.EE = window.EE;
        this.timeout = $timeout;
        this.$onInit = this.onInit.bind(this);
        this.mapCountryState = this.mapCountryState.bind(this);
    }

    mapCountryState(state) {
        const countryData = CountryModule.getCountryCoverPage(state);
        const showCountryNameAndFlag = countryData && countryData.name && countryData.name !== 'WHO';
        return {
            ...this.mapState(state),
            countryData,
            countryFlag: CountryModule.getCurrentCountry(state).flag,
            pageLoaded: !!countryData.name,
            showCountryNameAndFlag,
            logoClass: showCountryNameAndFlag ? 'has-country-logo' : ''
        };
    }

    onInit() {
        this.pageLoaded = false;
        this.watchers();
        this.commonInit();

        window.onscroll = this.scrollEventHandler.bind(this);
        document.addEventListener('scroll', this.scrollEventHandler.bind(this), true);

        this.unsubscribe = this.$ngRedux.connect(this.mapCountryState, UserModule)(this);
    }

    onDestroy() {
        this.unsubscribe();
        this.commonOnDestroy();
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
