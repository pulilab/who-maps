import * as LanguageModule from '../../store/modules/language';

class DisclaimerController {

    constructor($scope, $ngRedux) {
        this.scope = $scope;
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


    static factory() {
        function disclaimer($scope, $ngRedux) {
            return new DisclaimerController($scope, $ngRedux);
        }
        disclaimer.$inject = ['$scope', '$ngRedux'];
        return disclaimer;
    }
}

export default DisclaimerController;
