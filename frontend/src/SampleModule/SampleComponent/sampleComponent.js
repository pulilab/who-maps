function sampleComponentController() {
    require('./SampleComponent.scss');
    console.log('Test');
}

const sampleComponent = {
    controller: sampleComponentController,
    bindings: {
        testData: '='
    }
};

export default sampleComponent;
