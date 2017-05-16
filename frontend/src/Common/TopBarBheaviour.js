import Protected  from './Protected';

class TopBar extends Protected {

    constructor($state, $scope) {
        super();
        this.EE = window.EE;
        this.state = $state;
        this.scope = $scope;
        this.commonInit = this.commonInit.bind(this);
    }

    commonInit() {
        this.defaultOnInit();
        this.cs = require('./CommonServices');
        this.profileDataReady = false;
        this.writeUserRole = this.writeUserRole.bind(this);
    }

    hasProfile() {
        return this.cs.hasProfile();
    }

    showCountryLevelViewButton() {
        return this.isLogin && this.hasProfile();
    }

    showGoToMyDashboardButton() {
        return this.profileDataReady && this.hasProfile();
    }

    showPersonaMenu() {
        return this.profileDataReady && this.hasProfile();
    }

    showNewProjectButton() {
        return this.profileDataReady && this.userProfile.account_type === 'I' && this.hasProfile();
    }

    showPlanningAndGuidanceButton() {
        return this.isLogin;
    }


    showSearch() {
        return this.isLogin;
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
        const leftOver = window.document.querySelector('.md-open-menu-container.md-leave');
        if (leftOver) {
            leftOver.style.top = null;
            leftOver.style.right = null;
            leftOver.style.left = null;
            leftOver.style.bottom = null;
        }
        $mdOpenMenu(event);
    }

    logout() {
        this.isLogin = false;
        this.EE.emit('logout');
    }
}

export default TopBar;
