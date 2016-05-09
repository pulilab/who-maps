import intro from 'intro.js';
import _ from 'lodash';

const introText = 'IntroJS Component: ';
class IntroJsController {

    constructor() {
        const vm = this;
        vm.introJs = intro.introJs("#main-view");
    }

    parseOptions() {
        const result = {
            steps: [],
            exitOnOverlayClick: false
        };
        if (!(this.sourceString instanceof Object)) {
            console.error(introText + 'invalid object');
            result.steps = [];
        }
        else {
            if (!this.sourceString.hasOwnProperty('steps')) {
                console.error(introText + 'supplied json is missing the required field STEPS');
                result.steps = [];
            }

            result.steps = _.chain(this.sourceString.steps)
                .cloneDeep()
                .forEach((value, key) => {
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
        return result;
    }

    element(name) {
        if (name.tagName === void 0) {
            return document.querySelectorAll(name);
        }
        return name;
    }

    start() {
        this.introJs.setOptions(this.parseOptions());
        this.introJs.onafterchange(targetElement => {
            targetElement.scrollIntoView(true);
        });
        this.introJs.start();

    }


    static introJsFactory() {
        require('./IntroJs.scss');
        function introJs() {
            return new IntroJsController();
        }

        introJs.$inject = [];

        return introJs;
    }

}

export default IntroJsController;
