import intro from 'intro.js';
import _ from 'lodash';

const introText = 'IntroJS Component: ';
class IntroJsController {

    constructor($timeout) {
        const vm = this;
        vm.introJs = intro.introJs();
        vm.options = {};
        $timeout(() => {
            vm.parseOptions();
            vm.introJs.setOptions(
                vm.options
            );
        });
    }

    parseOptions() {
        if (!(this.sourceString instanceof Object)) {
            console.error(introText + 'invalid object');
            this.options.steps = {};
        }
        else {


            if (!this.sourceString.hasOwnProperty('steps')) {
                console.error(introText + 'supplied json is missing the required field STEPS');
                this.options.steps = {};
            }

            this.options.steps = _.chain(this.sourceString.steps)
                .map((value, key) => {
                    value.toDelete = false;
                    if (!value.hasOwnProperty('intro')) {
                        console.error(introText + 'the step number ' + key + ' is missing the required field INTRO');
                        value.toDelete = true;
                    }

                    if (value.element) {
                        const selector = this.element(value.element);
                        if (selector.length > 1) {
                            console.warn(introText + 'The selector provided in the json match' +
                                ' more than one element, only the first will be used');
                        }
                        if (selector.length === 0) {
                            value.toDelete = true;
                            console.warn(introText + 'no element found matching the selector: ' + value.element);
                        }
                        value.element = selector.item(0);
                    }
                    return value;
                })
                .filter(item => {
                    return !item.toDelete;
                })
                .value();
        }
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
