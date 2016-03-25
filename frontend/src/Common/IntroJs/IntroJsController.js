import intro from 'intro.js';
import _ from 'lodash';

class IntroJsController {

    constructor($timeout) {
        const vm = this;
        vm.introJs = intro.introJs();
        $timeout(() => {
            vm.options = vm.parseInboundString();
            vm.introJs.setOptions();
        });
    }

    parseInboundString() {
        console.log(this.sourceString);
        const obj = this.sourceString;
        if (!obj.hasOwnProperty('steps')) {
            console.error('Supplied json is missing the required field STEPS');
            return;
        }

        this.sourceString = _.chain(obj.steps)
            .map((value, key) => {
                if (!value.hasOwnProperty('intro')) {
                    console.error('the step number ' + key + ' is missing the required field INTRO');
                    value.toDelete = true;
                }

                if (value.element) {
                    value.element = this.element(value.element);
                    if (value.element.length > 1) {
                        console.warn('The selector provided in the json match' +
                            ' more than one element, only the first will be used');
                    }
                    value.element = value.element[0];
                }

                return value;
            })
            .filter(item => {
                return item.toDelete === false;
            })
            .value();
    }

    element(name) {
        return document.querySelectorAll(name);
    }

    start() {
        this.introJs.start();
    }


    static introJsFactory() {
        require('./IntroJs.scss');
        function introJs($timeout) {
            return new IntroJsController($timeout);
        }

        introJs.$inject = ['$timeout'];

        return introJs;
    }

}

export default IntroJsController;
