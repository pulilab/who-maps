import ConstraintsController from './ConstraintsController';
import { EE } from '../../Common/';

/* global define, it, describe, expect, beforeEach, jasmine, spyOn */

let ic = {};
const $timeout = arg => {
    arg();
};

describe('constraintsController', () => {

    beforeEach(() => {
        EE.initialize();
        ic = ConstraintsController.constraintsFactory()($timeout);
    });

});
