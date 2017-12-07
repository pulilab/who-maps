import MyProjectListController from '../../src/MyProjects/MyProjectList/MyProjectListController';
import { $scope, $state } from '../testUtilities';

let controller = {};

const scope = $scope(controller);


/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */
describe('MyProjectListController', () => {

    beforeEach(()=> {
        controller = new MyProjectListController(scope, $state());
    });
});
