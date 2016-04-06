
class AppModuleController {

    constructor() {
        this.user = {
            username: 'John Snow',
            role: 'Admin',
            projects: ['Project 1', 'Project 2']
        };

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
    }


    openMenu($mdOpenMenu, event) {
        $mdOpenMenu(event);
    }

    logout() {
        console.log('logout stub');
    }

    static appControllerFactory() {

        function appController() {
            return new AppModuleController();
        }

        appController.$inject = [];

        return appController;
    }

}

export default AppModuleController;
