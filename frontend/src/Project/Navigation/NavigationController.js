class NavigationController {

    constructor($anchorScroll) {
        this.scroll = $anchorScroll;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.locationHashChanged = this.locationHashChanged.bind(this);
    }

    onInit() {
        window.addEventListener('hashchange', this.locationHashChanged);

    }

    onDestroy() {
        window.removeEvent('hashchange', this.locationHashChanged);
    }

    locationHashChanged() {
        this.scroll();
    }

    static navigationFactory() {
        require('./Navigation.scss');
        function navigation($anchorScroll) {
            return new NavigationController($anchorScroll);
        }
        navigation.$inject = ['$anchorScroll'];
        return navigation;
    }
}

export default NavigationController;
