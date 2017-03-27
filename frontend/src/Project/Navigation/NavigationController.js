
class NavigationController {

    constructor() {
        this.EE = window.EE;
        this.scrollTo = this.scrollTo.bind(this);
    }

    scrollTo(hash) {
        this.EE.emit('projectScrollTo', hash);
    }

    static navigationFactory() {
        require('./Navigation.scss');
        function navigation() {
            return new NavigationController();
        }
        navigation.$inject = [];
        return navigation;
    }
}

export default NavigationController;
