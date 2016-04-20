
class MapsToolkitModuleController {

    static mapsControllerFactory() {
        function mapsController($scope, $state) {
            return new MapsToolkitModuleController($scope, $state);
        }

        mapsController.$inject = ['$scope', '$state'];

        return mapsController;
    }
}

export default MapsToolkitModuleController;
