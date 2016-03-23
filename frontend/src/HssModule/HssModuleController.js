import intro from 'intro.js';

class HssModuleController {

    constructor() {
        this.EE = window.EE;
        this.startIntro = this.hssIntro;
    }

    element(name) {
        return document.querySelectorAll(name)[0];
    }

    hssIntro() {
        const introObj = intro.introJs();
        introObj.setOptions(
            {
                steps: [
                    {
                        intro: 'HSS Framework short tutorial'
                    },
                    {
                        intro: 'to switch between edit mode and view mode do not use it for now',
                        element: this.element('.intro_edit_mode')
                    },
                    {
                        intro: 'Activate main continuum element by clicking here, do it now!',
                        element: this.element('.mother_middle_1')
                    },
                    {
                        intro: 'Select this one too for the sake of tutorial',
                        element: this.element('.mother_middle_2')
                    },
                    {
                        intro: 'Activate sub continuum element by clicking here, ' +
                        'this element can not be activated because his mother column is not',
                        element: this.element('.child_middle_5')
                    },
                    {
                        intro: 'Once a column is activate select interventions from the select menu here',
                        element: this.element('.interventions_middle_1')
                    },
                    {
                        intro: 'Select one or more constraints from here',
                        element: this.element('.intro_constraints')
                    },
                    {
                        intro: 'To create an editing bubble click on an activated application cell',
                        element: this.element('.applications_middle_1')
                    },
                    {
                        intro: 'And then click to another application cell',
                        element: this.element('.applications_middle_2')
                    },
                    {
                        intro: 'Is now possible to edit the newly created bubble',
                        element: this.element('.applications_middle_1')
                    },
                    {
                        intro: 'Once a bubble is created the row get activated and it is possible to select constraints',
                        element: this.element('.taxonomy_column_0')
                    },
                    {
                        intro: 'The application is now active, to show the subapp click on the application name',
                        element: this.element('.applications_header_0')
                    }

                ]
            }
        );
        introObj.start();
    }

}

export default HssModuleController;
