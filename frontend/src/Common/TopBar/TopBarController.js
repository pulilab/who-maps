import Protected  from '../Protected';

class TopBarController extends Protected {

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
        let isImplementer = true;
        if (this.userProfile && this.userProfile.account_type !== 'I') {
            isImplementer = false;
        }
        return this.showFullNavigation && isImplementer
            && this.isLogin && this.hasProfile();
    }

    showCountryLevelViewButton() {
        return this.state.current.name !== 'country' && this.isLogin;
    }

    showGoToMyDashboardButton() {
        if (this.showSubBar) {
            return false;
        }
        return this.showFullNavigation && this.userType !== 0
            && (this.viewMode || this.state.current.name !== 'dashboard');
    }

    showSearch() {
        return this.showFullNavigation;
    }
    showLogin() {
        return this.state.current.name !== 'login' && !this.isLogin;
    }

    showSignUp() {
        return this.state.current.name !== 'signup' && !this.isLogin;
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

    static topBarControllerFactory() {
        require('./topBar.scss');
        function topBarController($state, $scope) {
            return new TopBarController($state, $scope);
        }

        topBarController.$inject = ['$state', '$scope'];

        return topBarController;
    }

}

export default TopBarController;
