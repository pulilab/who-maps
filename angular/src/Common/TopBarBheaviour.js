import * as UserModule from '../store/modules/user';

class TopBar {
  constructor ($state, $scope, $ngRedux) {
    this.EE = window.EE;
    this.state = $state;
    this.scope = $scope;
    this.$ngRedux = $ngRedux;
    this.commonInit = this.commonInit.bind(this);
    this.commonOnDestroy = this.commonOnDestroy.bind(this);
  }

  commonInit () {
    this.writeUserRole = this.writeUserRole.bind(this);
    this.currentState = this.state.current.name;
  }

  commonOnDestroy () {}

  mapState (state) {
    const profile = UserModule.getProfile(state);
    const userLanguage = UserModule.getUserLanguage(state);
    const profileValid = !!(profile && profile.country && profile.organisation && profile.name);
    return {
      profile,
      profileValid,
      token: state.user.token,
      userLanguage
    };
  }

  writeUserRole () {
    let type = null;
    if (this.profile) {
      switch (this.profile.account_type) {
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

  openMenu ($mdOpenMenu, event) {
    const leftOver = window.document.querySelector('.md-open-menu-container.md-leave');
    if (leftOver) {
      leftOver.style.top = null;
      leftOver.style.right = null;
      leftOver.style.left = null;
      leftOver.style.bottom = null;
    }
    $mdOpenMenu(event);
  }

  async logout () {
    await this.state.go('landing');
    this.doLogout();
  }
}

export default TopBar;
