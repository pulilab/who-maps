import * as LanguageModule from '../../store/modules/language';

class CountryPartnersController {

    constructor($scope, $state, $ngRedux) {
        this.scope = $scope;
        this.state = $state;
        this.$ngRedux = $ngRedux;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.mapState = this.mapState.bind(this);
    }

    mapState(state) {
        this.translate = LanguageModule.translate.bind(this, state);
        return {};
    }

    onInit() {
        this.unsubscribe = this.$ngRedux.connect(this.mapState, null)(this);
    }

    onDestroy() {
        this.unsubscribe();
    }

    computeLogoStyle(logo) {
        return { 'background-image': `url(${logo})` };
    }

    static countryPartnersFactory() {
        require('./countryPartners.scss');
        function countryPartners($scope, $state, $ngRedux) {
            return new CountryPartnersController($scope, $state, $ngRedux);
        }

        countryPartners.$inject = ['$scope', '$state', '$ngRedux'];

        return countryPartners;
    }
}

export default CountryPartnersController;
