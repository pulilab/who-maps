import { calculateHeight } from '../../Utilities';
import { verifyEmail } from '../../store/modules/user';

class EmailConfirmationController {
  constructor ($scope, $state) {
    this.scope = $scope;
    this.state = $state;
    this.$onInit = this.onInit.bind(this);
    this.$onDestroy = this.onDestroy.bind(this);
  }

  onInit () {
    this.inProcess = true;
    this.style = {
      height: calculateHeight()
    };
    this.key = this.state.params.key;

    if (this.key) {
      this.activateEmail();
    }
  }

  onDestroy () {
  }

  async activateEmail () {
    let success = false;
    try {
      await verifyEmail({ key: this.key });
      success = true;
    } catch (e) {
      console.log(e);
    }
    this.scope.$evalAsync(() => {
      this.inProcess = false;
      this.success = success;
    });
  }

  static emailConfirmationFactory () {
    require('./EmailConfirmation.scss');

    function emailConfirmationController ($scope, $state) {
      return new EmailConfirmationController($scope, $state);
    }

    emailConfirmationController.$inject = ['$scope', '$state'];

    return emailConfirmationController;
  }
}

export default EmailConfirmationController;
