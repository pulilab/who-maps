class ProjectComponentController {

    constructor() {
        // const vm = this;
        // console.warn('Projectcomponent LOADED!');
    }

    static projectComponentFactory() {
        require('./ProjectComponent.scss');
        function projectCp($element) {
            return new ProjectComponentController($element);
        }

        projectCp.$inject = [];

        return projectCp;
    }

}

export default ProjectComponentController;
