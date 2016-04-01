
class AppModuleController {

    constructor(){
        this.user = {
            username: 'John Snow',
            role: 'Admin',
            currentProject: 'Project 1',
            projects: ['Project 1', 'Project 2', 'Project 3']
        };
        
        this.notifications = [1, 2, 3];
    }


    openMenu($mdOpenMenu, event) {
        $mdOpenMenu(event);
    }

    logout() {
        console.log('SCADUSH');
        window.location.href = 'https://youtu.be/rFhWkLKONO0?t=49';
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
