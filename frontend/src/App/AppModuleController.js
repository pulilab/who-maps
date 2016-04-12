import { Protected } from '../Common/';

class AppModuleController extends Protected {

    constructor($state, $scope) {
        super();
        this.EE = window.EE;
        this.state = $state;
        this.scope = $scope;
        this.showFullNavigation = false;
        if (this.user) {
            this.user.projects = ['Project 1', 'Project 2'];
        }

        this.currentProject = {
            name: 'Project 1',
            version: {
                id: '3',
                date: '12 Feb, 2016'
            },
            organization: 'IRD: Pakistan',
            contact: {
                name: 'Jane M Doe',
                email: 'po@kungFu.panda'
            }
        };

        this.notifications = [1, 2, 3];

        this.scope.$watch(() => {
            return this.state.current.name;
        }, value => {
            this.showCompleteNavigation(value, this.isLogin);
        });



        this.EE.on('login', this.handleLoginEvent.bind(this));
        this.EE.on('unauthorized', this.handleUnauthorized.bind(this));
    }

    handleLoginEvent(forced) {
        if (forced) {
            console.log('some forced action');
        }
        this.systemLogin();
        this.state.go('hss');
    }

    handleUnauthorized() {
        this.state.go('login');
    }

    showCompleteNavigation(state, isLogin) {
        const isLanding = state === 'landing';
        this.showFullNavigation = !isLanding && isLogin;
    }


    openMenu($mdOpenMenu, event) {
        $mdOpenMenu(event);
    }

    logout() {
        this.systemLogout();
        this.showCompleteNavigation(null, false);
    }

    static appControllerFactory() {

        function appController($state, $scope) {
            return new AppModuleController($state, $scope);
        }

        appController.$inject = ['$state', '$scope'];

        return appController;
    }

}

export default AppModuleController;
