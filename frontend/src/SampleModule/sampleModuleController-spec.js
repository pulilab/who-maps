import {default as SampleModuleController} from './SampleModuleController';

describe('SampleModuleController', () => {
    it('should have a function that return -some-', () => {
        let sampleModuleController = new SampleModuleController;
        let result = sampleModuleController.printAndReturnSome();
        expect(result).toBe('some');
    })
});