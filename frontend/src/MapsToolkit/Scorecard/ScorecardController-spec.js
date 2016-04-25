import ScorecardController from './ScorecardController';

/* global define, it, describe, expect, beforeEach, spyOn, Promise */

let sc = {};

const $state = {
    params: {
        axisId: 0,
        domainId: 0
    },
    go: () => {
    },
    current: {
        name: ''
    }
};

const $scope = {
    $evalAsync: () => {}
};

describe('ScorecardController', () => {

    beforeEach(() => {
        spyOn(ScorecardController.prototype, 'initialization');
        sc = ScorecardController.scorecardFactory()($scope, $state);
    });

});
