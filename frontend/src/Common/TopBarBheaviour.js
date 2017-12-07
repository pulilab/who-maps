import * as UserModule from '../store/modules/user';

class TopBar {

    constructor($state, $scope, $ngRedux) {
        this.EE = window.EE;
        this.state = $state;
        this.scope = $scope;
        this.commonInit = this.commonInit.bind(this);
        this.commonOnDestroy = this.commonOnDestroy.bind(this);
        this.unsubscribe = $ngRedux.connect(this.mapState, UserModule)(this);
    }

    commonInit() {
        this.writeUserRole = this.writeUserRole.bind(this);
    }

    commonOnDestroy() {
        this.unsubscribe();
    }

    mapState(state) {
        return {
            userModel: state.user
        };
    }

    hasProfile() {
        const p = this.userModel.profile;
        return !!(p && p.country && p.organisation && p.name);
    }

    showCountryLevelViewButton() {
        return this.hasProfile();
    }

    showGoToMyDashboardButton() {
        return this.userModel.token;
    }

    showPersonaMenu() {
        return this.userModel.token;
    }

    showNewProjectButton() {
        return this.hasProfile();
    }

    showPlanningAndGuidanceButton() {
        return this.hasProfile();
    }


    showSearch() {
        return this.userModel.token;
    }
    showLogin() {
        return this.state.current.name !== 'login' && !this.userModel.token;
    }

    showSignUp() {
        return this.state.current.name !== 'signup' && !this.userModel.token;
    }

    writeUserRole() {
        let type = null;
        if (this.userModel && this.userModel.profile) {
            switch (this.userModel.profile.account_type) {
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
        this.doLogout();
        this.state.go('landing');
    }
}

export default TopBar;
