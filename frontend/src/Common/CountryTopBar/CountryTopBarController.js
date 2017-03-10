import Protected  from '../Protected';

class CountryTopBarController extends Protected {

    constructor($state, $scope) {
        super();
        this.EE = window.EE;
        this.state = $state;
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
        this.defaultOnInit();
        this.cs = require('../CommonServices');
        this.writeUserRole = this.writeUserRole.bind(this);
        if (this.user) {
            this.userProfile = this.cs.userProfile;
        }
    }

    hasProfile() {
        return this.cs.hasProfile();
    }

    showNewProjectButton() {
        return this.showFullNavigation && this.userProfile.account_type === 'I'
            && this.isLogin && this.hasProfile();
    }

    showCountryLevelViewButton() {
        return this.state.current.name !== 'country' && this.isLogin;
    }

    showGoToMyDashboardButton() {
        return this.showFullNavigation && this.userType !== 0
            && (this.viewMode || this.state.current.name !== 'dashboard');
    }

    showSearch() {
        return this.showFullNavigation;
    }
    showLogin() {
        // return this.state.current.name !== 'login' && !this.isLogin;
        return true;
    }

    showSignUp() {
        // return this.state.current.name !== 'signup' && !this.isLogin;
        return true;
    }

    writeUserRole() {
        let type = null;
        switch (this.userProfile.account_type) {
        case 'I':
            type = 'Implementer';
            break;
        case 'G':
            type = 'Government';
            break;
        case 'D':
            type = 'Financial Investor';
            break;
        case 'Y':
            type = 'Inventory';
            break;
        }
        return type;
    }

    openMenu($mdOpenMenu, event) {
        $mdOpenMenu(event);
    }

    logout() {
        this.EE.emit('logout');
    }

    static countryTopBarControllerFactory() {
        require('./countryTopBar.scss');
        function countryTopBarController($state, $scope) {
            return new CountryTopBarController($state, $scope);
        }

        countryTopBarController.$inject = ['$state', '$scope'];

        return countryTopBarController;
    }

}

export default CountryTopBarController;
