import { calculateHeight, getSubDomain } from '../../Utilities';
import * as CountriesModule from '../../store/modules/countries';

class TermOfUseController {

    constructor($scope, $window, $ngRedux) {
        this.EE = window.EE;
        this.scope = $scope;
        this.window = $window;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.unsubscribe = $ngRedux.connect(this.mapState, CountriesModule)(this);
    }

    mapState(state) {
        const countryData = CountriesModule.getCountryCoverPage(state);
        const showFooter = countryData.footer_text && countryData.footer_title;
        return {
            countryData,
            countryCover: CountriesModule.getCountryCoverPicture(state),
            showFooter
        };
    }

    onInit() {
        const subDomain = getSubDomain();
        this.setCurrentCountryFromCode(subDomain);
        this.menuEntry = ['contact', 'terms of use'];
        this.currentSection = 'terms of use';
        this.style = {
            height: calculateHeight()
        };
    }

    onDestroy() {
        this.unsubscribe();
    }

    goBack() {
        this.window.history.back();
    }

    onDestroy() {
    }

    openSection(section) {
        this.currentSection = section;
    }

    static termOfUseFactory() {
        require('./TermsOfUse.scss');

        function termOfUseController($scope, $window, $ngRedux) {
            return new TermOfUseController($scope, $window, $ngRedux);
        }

        termOfUseController.$inject = ['$scope', '$window', '$ngRedux'];

        return termOfUseController;
    }

}

export default TermOfUseController;
