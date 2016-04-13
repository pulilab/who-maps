import { trendingProjects } from '../../LandingPage/landingMock';

class SearchbarController {

    constructor() {
        const vm = this;
        vm.filters = {
            'Location': false,
            'Project name': true,
            'Health topic': false,
            'Technology platform': false,
            'Organization': false
        };
        vm.projects = trendingProjects;
        vm.resultNr = 12;
    }

    static searchbarFactory() {
        require('./Searchbar.scss');
        function searchbarCp() {
            return new SearchbarController();
        }

        searchbarCp.$inject = [];

        return searchbarCp;
    }

}

export default SearchbarController;
