



function sampleComponentController() {
    require('./SampleComponent.scss');
    console.log('Test')
}



var sampleComponent = {
    controller: sampleComponentController,
    bindings: {
        testData: '='
    }
};

export default sampleComponent;
