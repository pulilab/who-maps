import _ from 'lodash';
import { hss, interventionsLib, applicationsLib, taxonomyLib } from './hssMockData';
import intro from 'intro.js';

class HssModuleController {

    constructor() {
        this.cell = [0, 1, 2, 3, 4, 5, 6];
        this.editMode = true;
        this.interventions = interventionsLib;
        this.applications = applicationsLib;
        this.taxonomy = taxonomyLib;
        this.constraints = _.keys(taxonomyLib);
        this.constraints = _.map(this.constraints, (value) => {
            return {
                name: value,
                icon: taxonomyLib[value].icon,
                toggled: false
            };
        });
        this.selectedConstraints = [];

        this.zeroRow = this.headerRow();
        this.motherRow = this.motherColumns();
        this.childRow = this.childColumns();
        this.intervertionLogoColumn = this.interventionHeaderLogoGenerator();
        this.interventionRow = this.interventionRows();
        this.applicationRow = this.applicationRows();
        this.tileClickCounter = 0;
        this.startTile = {};
        this.startIntro = this.hssIntro;
    }

    headerMiddleColumnDecorator() {
        return _.map(this.cell, (value) => {
            return {
                content: '',
                colSpan: 1,
                rowSpan: 1,
                className: (value + 1) % 2 === 0 ? 'even' : 'odd'
            };
        });
    }

    motherClickHandler(tile) {
        if (!this.editMode) {
            return;
        }
        const idList = [];
        tile.activated = !tile.activated;
        for (let i = tile.columnId; i < tile.columnId + tile.colSpan; i = i + 1) {
            idList.push(i);
        }
        this.interventionRow = _.map(this.interventionRow, (value) => {
            if (_.includes(idList, value.columnId)) {
                value.activated = !value.activated;
            }
            return value;
        });
        this.applicationRow = _.map(this.applicationRow, (value) => {
            if (_.includes(idList, value.columnId)) {
                value.activated = !value.activated;
            }
            return value;
        });
    }

    motherMiddleColumnDecorator() {
        return _.chain(this.cell)
            .map((value) => {
                return {
                    content: hss[value].mother.title,
                    colSpan: hss[value].mother.span,
                    rowSpan: 1,
                    invisible: _.isEmpty(hss[value].mother),
                    clickHandler: this.motherClickHandler.bind(this),
                    columnId: value,
                    activated: hss[value].activated,
                    className: ((value + 1) % 2 === 0 ? 'even' : 'odd') + ' mother',
                    introName: 'mother_middle_' + value
                };
            })
            .filter({
                invisible: false
            })
            .value();
    }

    childClickHandler(tile) {
        const mother = _.filter(this.motherRow, (value) => {
            return value.columnId === tile.columnId;
        })[0];
        if (tile.empty || !mother.activated) {
            return;
        }
        tile.activated = !tile.activated;
    }

    childMiddleColumnDecorator() {
        return _.map(this.cell, (value)=> {
            return {
                content: hss[value].child.title,
                className: (!hss[value].child.title ? 'empty' : '')
                + ' ' + ((value + 1) % 2 === 0 ? 'even' : 'odd')
                + ' child',
                colSpan: 1,
                rowSpan: 1,
                columnId: value,
                activated: hss[value].activated,
                empty: !hss[value].child.title,
                clickHandler: this.childClickHandler.bind(this),
                introName: 'child_middle_' + value
            };
        });
    }

    interventionHeaderLogoGenerator() {
        return {
            content: 'Interventions and stuff',
            className: '',
            colSpan: 2,
            rowSpan: 4
        };
    }

    interventionsMiddleColumnDecorator() {
        return _.map(this.cell, (value) => {
            return {
                content: null,
                className: (value + 1) % 2 === 0 ? 'even' : 'odd',
                colSpan: 1,
                rowSpan: 4,
                isInput: true,
                columnId: value,
                activated: false,
                selectValues: this.interventions[value],
                introName: 'interventions_middle_' + value
            };
        });
    }

    headerRow() {
        const row = [{
            content: '',
            className: 'even',
            colSpan: 2,
            rowSpan: 1
        }];
        return row.concat(this.headerMiddleColumnDecorator());
    }

    motherColumns() {
        const row = [{
            content: 'Mother',
            className: 'title',
            colSpan: 2,
            rowSpan: 1
        }];
        return row.concat(this.motherMiddleColumnDecorator());
    }

    childColumns() {
        const row = [{
            content: 'Child',
            className: 'title',
            colSpan: 2,
            rowSpan: 1
        }];
        return row.concat(this.childMiddleColumnDecorator());
    }

    interventionRows() {
        let cols = [];
        cols = cols.concat(this.interventionsMiddleColumnDecorator());
        return cols;
    }

    applicationClassGenerator(tile) {
        return tile.rowBubbles.length > 0 ? tile.applicationStyle : 'application_disabled';
    }

    applicationHeaderGenerator(index) {
        const subApp = _.values(this.applications[index].subApplications);
        return [{
            content: this.applications[index].name,
            applicationStyle: 'application_' + this.applications[index].id,
            className: '',
            colSpan: 2,
            rowSpan: 1,
            rowIndex: index,
            model: this.applications[index],
            subApplications: subApp,
            applicationId: this.applications[index].id,
            appLabel: this.applications[index].id,
            isHeader: true,
            isMain: true,
            rowBubbles: [],
            classGenerator: this.applicationClassGenerator.bind(this),
            introName: 'applications_header_' + index
        }];
    }

    applicationsMiddleColumnDecorator(index) {
        return _.map(this.cell, (value) => {
            return {
                content: '',
                className: (value + 1) % 2 === 0 ? 'even' : 'odd',
                rowIndex: index,
                columnId: value,
                colSpan: 1,
                rowSpan: 1,
                isDefined: false,
                isInput: true,
                insertMode: false,
                invisible: false,
                subAppOpen: false,
                isMain: true,
                applicationId: this.applications[index].id,
                appLabel: this.applications[index].id,
                activated: hss[value].activated,
                introName: 'applications_middle_' + value
            };
        });
    }

    taxonomyColumnGenerator(index) {
        return [{
            content: '',
            className: 'taxonomy',
            colSpan: 2,
            rowSpan: 1,
            isInput: false,
            isSelect: true,
            isTax: true,
            isMain: true,
            rowIndex: index,
            rowEnabled: false,
            introName: 'taxonomy_column_' + index
        }];
    }

    subApplicationHeaderGenerator(subApp, index, id) {
        const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        return [{
            content: subApp[index],
            className: index === subApp.length - 1 ? 'lastSub' : 'sub',
            colSpan: 2,
            rowSpan: 1,
            isInput: false,
            isHeader: true,
            rowIndex: index,
            fatherId: id,
            applicationStyle: 'application_' + id,
            appLabel: id + alphabet[index],
            disabled: true,
            rowBubbles: [],
            classGenerator: this.applicationClassGenerator.bind(this)
        }];
    }

    subAppMiddleColumnDecorator(index, id) {
        const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        return _.map(this.cell, (value) => {
            return {
                content: '',
                className: (value + 1) % 2 === 0 ? 'even' : 'odd',
                rowIndex: index,
                columnId: value,
                colSpan: 1,
                rowSpan: 1,
                isDefined: false,
                isInput: true,
                insertMode: false,
                invisible: false,
                appLabel: id + alphabet[index],
                activated: hss[value].activated,
                fatherId: id,
                disabled: true,
                isMain: false
            };
        });
    }

    subAppTaxonomyColumnGenerator(index, id) {
        return [{
            content: '',
            className: 'taxonomy',
            colSpan: 2,
            rowSpan: 1,
            fatherId: id,
            isInput: true,
            isSelect: true,
            disabled: true,
            isTax: true,
            rowIndex: index,
            rowEnabled: false
        }];
    }

    subApplicationRows(index) {
        let cols = [];
        const subApp = _.values(this.applications[index].subApplications);
        const appId = this.applications[index].id;

        for (let i = 0; i < subApp.length; i = i + 1) {
            cols = cols.concat(this.subApplicationHeaderGenerator(subApp, i, appId));
            cols = cols.concat(this.subAppMiddleColumnDecorator(i, appId));
            cols = cols.concat(this.subAppTaxonomyColumnGenerator(i, appId));
        }
        return cols;
    }

    applicationRows() {
        const appNumber = this.applications.length;
        let cols = [];
        for (let i = 0; i < appNumber; i = i + 1) {
            cols = cols.concat(this.applicationHeaderGenerator(i));
            cols = cols.concat(this.applicationsMiddleColumnDecorator(i));
            cols = cols.concat(this.taxonomyColumnGenerator(i));
            cols = cols.concat(this.subApplicationRows(i));
        }
        return cols;
    }

    enableSubApp(tile) {
        if (!tile.subApplications) {
            return;
        }
        tile.subAppOpen = !tile.subAppOpen;
        const appId = tile.model.id;
        _.map(this.applicationRow, (value) => {
            if (value.fatherId && value.fatherId === appId) {
                value.disabled = !value.disabled;
            }
            return value;
        });
    }

    clickHandler(tile) {
        if (tile.isDefined) {
            return;
        }
        if (this.tileClickCounter === 0) {
            this.tileClickCounter = this.tileClickCounter + 1;
            this.tileBalloonStartHandler(tile);
        }
        else if (this.tileClickCounter === 1) {
            this.tileClickCounter = 0;
            this.tileBalloonEndHandler(tile);
        }
    }

    inputHandler(tile, event) {
        if (event.which === 13) {
            tile.insertMode = false;
        }
    }

    findSameRowCandidate(tile) {
        return _.chain(this.applicationRow)
            .filter({ rowIndex: tile.rowIndex, activated: true })
            .filter((value) => {
                return value.columnId >= this.startTile.columnId
                    && value.columnId <= tile.columnId
                    && this.startTile.fatherId === value.fatherId;
            })
            .value();
    }

    tileBalloonStartHandler(tile) {
        this.startTile = tile;
    }

    tileBalloonEndHandler(tile) {
        let applicationStyle;
        const rowColumns = this.findSameRowCandidate(tile);

        if (rowColumns.length === 0) {
            this.startTile = void 0;
            return;
        }

        this.applicationRow = _.map(this.applicationRow, (value) => {
            if (tile.isMain) {
                if (value.rowIndex === tile.rowIndex && value.isMain) {
                    if (value.isHeader) {
                        applicationStyle = value.applicationStyle;
                        value.rowBubbles.push(rowColumns);
                    }
                    if (value.isTax) {
                        value.rowEnabled = true;
                    }
                }
            }
            else if (value.rowIndex === tile.rowIndex && value.fatherId === tile.fatherId && !value.isMain) {
                if (value.isHeader) {
                    value.rowBubbles.push(rowColumns);
                    applicationStyle = value.applicationStyle;
                }
                if (value.isTax) {
                    value.rowEnabled = true;
                }
            }
            return value;
        });

        rowColumns.forEach((value, key)=> {
            if (key === 0) {
                value.colSpan = rowColumns.length;
                value.isDefined = true;
                value.status = applicationStyle;
            }
            else {
                value.invisible = true;
            }
        });

        this.applicationRow = _.filter(this.applicationRow, (value) => {
            return !value.invisible || !value.isInput;
        });
    }

    constraintChanged() {
        this.selectedConstraints = [];
        _.forEach(this.constraints, (value) => {
            if (value.toggled) {
                this.selectedConstraints = this.selectedConstraints.concat(taxonomyLib[value.name].values);
            }
        });
    }

    classGenerator(tile) {
        return tile.className + ' ' + (tile.activated ? 'activated' : 'not-activated')
            + ' ' + (tile.subAppOpen ? 'app-open' : 'app-closed')
            + ' ' + tile.introName;
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
